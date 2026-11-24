import { z } from "zod";
import { route, readJson, json, clientIp } from "@/server/http/api";
import { zEmail } from "@/server/http/schemas";
import { rateLimit } from "@/server/ratelimit";
import { asSystem } from "@/server/db";
import { newToken, hashToken } from "@/server/auth/tokens";
import { enqueueEmail, deliverOutbox } from "@/server/notify";
import { env } from "@/server/env";
import type { Locale } from "@/i18n/config";

const Body = z.object({ email: zEmail });

/** Always answers the same way, whether or not the account exists (no account enumeration). */
export const POST = route(async (req) => {
  await rateLimit(`forgot:ip:${clientIp(req)}`, 5, 3600);
  const { email } = await readJson(req, Body);
  await rateLimit(`forgot:email:${email}`, 3, 3600);
  const user = await asSystem((tx) => tx.one<{ id: string; name: string; locale: Locale }>(`SELECT id, name, locale FROM users WHERE email = $1`, [email]));
  if (user) {
    const token = newToken();
    await asSystem((tx) => tx.query(`INSERT INTO auth_tokens (id, user_id, purpose, expires_at) VALUES ($1,$2,'password_reset', now() + interval '1 hour')`, [hashToken(token), user.id]));
    await enqueueEmail({ userId: user.id, to: email, template: "reset", locale: user.locale, data: { name: user.name, link: `${env().APP_URL}/reset?token=${token}` } });
    deliverOutbox(5).catch(() => {});
  }
  return json({ ok: true });
});
