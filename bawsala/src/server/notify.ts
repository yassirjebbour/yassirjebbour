import "server-only";
import { asSystem, asUser } from "./db";
import { log } from "./log";
import { translator } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import { env } from "./env";

export type NotificationKind = "task_due" | "plan_ready" | "skill_suggestions" | "security" | "announcement" | "opportunity";

/** In-app notification. `dedupeKey` prevents duplicates (e.g. one "task due" per task per day). */
export async function notify(userId: string, kind: NotificationKind, data: Record<string, unknown>, dedupeKey?: string) {
  await asSystem((tx) =>
    tx.query(`INSERT INTO notifications (user_id, kind, data, dedupe_key) VALUES ($1,$2,$3,$4) ON CONFLICT (user_id, dedupe_key) DO NOTHING`, [userId, kind, JSON.stringify(data), dedupeKey ?? null]),
  ).catch((e) => log.warn("notify.failed", { kind, err: e }));
}

export const listNotifications = (userId: string) =>
  asUser(userId, (tx) => tx.query<{ id: string; kind: NotificationKind; data: Record<string, unknown>; read_at: Date | null; created_at: Date }>(
    `SELECT id, kind, data, read_at, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, [userId]));

export const unreadCount = (userId: string) =>
  asUser(userId, (tx) => tx.one<{ n: number }>(`SELECT count(*)::int n FROM notifications WHERE user_id = $1 AND read_at IS NULL`, [userId])).then((r) => r?.n ?? 0);

export async function markRead(userId: string, ids?: string[]) {
  await asUser(userId, (tx) =>
    ids?.length
      ? tx.query(`UPDATE notifications SET read_at = now() WHERE user_id = $1 AND id = ANY($2::uuid[]) AND read_at IS NULL`, [userId, ids])
      : tx.query(`UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL`, [userId]),
  );
}

// ---------------- email outbox ----------------
export type EmailTemplate = "reset" | "password_changed" | "reminder";

export async function enqueueEmail(opts: { userId: string | null; to: string; template: EmailTemplate; locale: Locale; data: Record<string, string> }) {
  await asSystem((tx) => tx.query(`INSERT INTO email_outbox (user_id, to_email, template, locale, data) VALUES ($1,$2,$3,$4,$5)`, [opts.userId, opts.to, opts.template, opts.locale, JSON.stringify(opts.data)]));
}

export function renderEmail(template: EmailTemplate, locale: Locale, data: Record<string, string>) {
  const t = translator(locale);
  const map = { reset: ["email.reset_subject", "email.reset_body"], password_changed: ["email.password_changed_subject", "email.password_changed_body"], reminder: ["email.reminder_subject", "email.reminder_body"] } as const;
  const [s, b] = map[template];
  return { subject: t(s, data), text: t(b, data) };
}

/**
 * Delivers queued emails with retries (exponential backoff, max 5 attempts).
 * Without RESEND_API_KEY nothing is sent: rows are marked 'skipped' and the body is logged
 * in development only (never in production, where it could contain reset links).
 */
export async function deliverOutbox(limit = 20) {
  const rows = await asSystem((tx) => tx.query<{ id: string; to_email: string; template: EmailTemplate; locale: Locale; data: Record<string, string>; attempts: number }>(
    `SELECT id, to_email, template, locale, data, attempts FROM email_outbox WHERE status = 'queued' AND send_after <= now() ORDER BY created_at LIMIT $1 FOR UPDATE SKIP LOCKED`, [limit]));
  let sent = 0, failed = 0, skipped = 0;
  for (const r of rows) {
    const { subject, text } = renderEmail(r.template, r.locale, r.data);
    const key = env().RESEND_API_KEY;
    if (!key) {
      if (env().NODE_ENV !== "production") log.info("email.dev_preview", { to: r.to_email, subject, text });
      await asSystem((tx) => tx.query(`UPDATE email_outbox SET status = 'skipped', last_error = 'no_provider' WHERE id = $1`, [r.id]));
      skipped++;
      continue;
    }
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json", "idempotency-key": r.id },
        body: JSON.stringify({ from: env().EMAIL_FROM, to: [r.to_email], subject, text }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`resend ${res.status}`);
      const j = (await res.json()) as { id?: string };
      await asSystem((tx) => tx.query(`UPDATE email_outbox SET status = 'sent', sent_at = now(), provider_id = $2, attempts = attempts + 1 WHERE id = $1`, [r.id, j.id ?? null]));
      sent++;
    } catch (e) {
      const attempts = r.attempts + 1;
      await asSystem((tx) => tx.query(
        `UPDATE email_outbox SET attempts = $2, last_error = $3, status = CASE WHEN $2 >= 5 THEN 'failed' ELSE 'queued' END,
                send_after = now() + make_interval(mins => power(2, $2)::int) WHERE id = $1`, [r.id, attempts, String((e as Error).message).slice(0, 200)]));
      failed++;
    }
  }
  return { sent, failed, skipped };
}
