import { timingSafeEqual } from "node:crypto";
import { asSystem } from "@/server/db";
import { notify, enqueueEmail, deliverOutbox } from "@/server/notify";
import { pruneRateLimits } from "@/server/ratelimit";
import { env } from "@/server/env";
import { log } from "@/server/log";
import type { Locale } from "@/i18n/config";

/**
 * Daily job (call from the host's scheduler with header `Authorization: Bearer $CRON_SECRET`):
 * due-task notifications, opt-in reminder emails, outbox delivery with retries, housekeeping.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  if (!secret || got.length !== secret.length || !timingSafeEqual(Buffer.from(got), Buffer.from(secret))) return Response.json({ error: { code: "unauthorized" } }, { status: 401 });
  const due = await asSystem((tx) => tx.query<{ user_id: string; task_id: string; title: string; email: string; name: string; locale: Locale; email_reminders: boolean | null; unsubscribe_token: string | null }>(
    `SELECT t.user_id, t.id task_id, t.title, u.email, u.name, u.locale, np.email_reminders, np.unsubscribe_token
       FROM plan_tasks t JOIN plans p ON p.id = t.plan_id AND p.status = 'active' JOIN users u ON u.id = t.user_id
       LEFT JOIN notification_prefs np ON np.user_id = t.user_id
      WHERE t.completed_at IS NULL AND t.due_on = current_date`));
  for (const d of due) {
    await notify(d.user_id, "task_due", { task: d.title }, `due:${d.task_id}`);
    if (d.email_reminders) await enqueueEmail({ userId: d.user_id, to: d.email, template: "reminder", locale: d.locale, data: { name: d.name, task: d.title, link: `${env().APP_URL}/app/plan`, unsubscribe: `${env().APP_URL}/api/v1/unsubscribe?token=${d.unsubscribe_token}` } });
  }
  const outbox = await deliverOutbox(100);
  await pruneRateLimits();
  log.info("cron.daily", { due: due.length, ...outbox });
  return Response.json({ ok: true, due: due.length, outbox });
}
