import { z } from "zod";
import { route, readJson, json, clientIp, ApiError } from "@/server/http/api";
import { zPassword } from "@/server/http/schemas";
import { rateLimit } from "@/server/ratelimit";
import { asSystem } from "@/server/db";
import { hashToken } from "@/server/auth/tokens";
import { hashPassword } from "@/server/auth/password";
import { deleteAllSessions } from "@/server/auth/session";
import { notify, enqueueEmail } from "@/server/notify";
import { env } from "@/server/env";
import type { Locale } from "@/i18n/config";

const Body = z.object({ token: z.string().min(20).max(200), password: zPassword });

export const POST = route(async (req) => {
  await rateLimit(`reset:ip:${clientIp(req)}`, 10, 3600);
  const { token, password } = await readJson(req, Body);
  const hash = await hashPassword(password);
  const user = await asSystem(async (tx) => {
    const row = await tx.one<{ user_id: string }>(
      `UPDATE auth_tokens SET used_at = now() WHERE id = $1 AND purpose = 'password_reset' AND used_at IS NULL AND expires_at > now() RETURNING user_id`, [hashToken(token)]);
    if (!row) return null;
    await tx.query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [row.user_id, hash]);
    await tx.query(`INSERT INTO audit_log (actor_id, action) VALUES ($1, 'account.password_reset')`, [row.user_id]);
    return tx.one<{ id: string; email: string; name: string; locale: Locale }>(`SELECT id, email, name, locale FROM users WHERE id = $1`, [row.user_id]);
  });
  if (!user) throw new ApiError("validation", "reset_invalid");
  await deleteAllSessions(user.id); // a reset signs out every device
  await notify(user.id, "security", { what: "password" });
  await enqueueEmail({ userId: user.id, to: user.email, template: "password_changed", locale: user.locale, data: { name: user.name, link: `${env().APP_URL}/forgot` } });
  return json({ ok: true, redirect: "/signin" });
});
