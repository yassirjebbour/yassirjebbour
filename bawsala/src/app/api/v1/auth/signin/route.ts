import { cookies } from "next/headers";
import { z } from "zod";
import { route, readJson, json, clientIp, ApiError } from "@/server/http/api";
import { zEmail } from "@/server/http/schemas";
import { checkCredentials } from "@/server/repo/account";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/server/auth/session";
import { rateLimit, rateLimitPeek, pruneRateLimits } from "@/server/ratelimit";
import { asSystem } from "@/server/db";
import { track } from "@/server/events";
import { LOCALE_COOKIE } from "@/i18n/config";

const Body = z.object({ email: zEmail, password: z.string().min(1).max(200) });

export const POST = route(async (req) => {
  const ip = clientIp(req);
  const body = await readJson(req, Body);
  // Two limits: per IP (credential stuffing) and per account (targeted guessing). The per-account
  // limit counts only FAILED attempts, so successful sign-ins never lock the owner out.
  // Failures are counted per (account, IP) — a single attacker cannot lock the owner out from another
  // network — with a higher per-account ceiling against distributed guessing.
  await rateLimit(`signin:ip:${ip}`, 20, 900);
  await rateLimitPeek(`signin:fail:${body.email}:${ip}`, 8, 900);
  await rateLimitPeek(`signin:fail:${body.email}`, 50, 900);
  const userId = await checkCredentials(body.email, body.password);
  if (!userId) {
    await rateLimit(`signin:fail:${body.email}:${ip}`, 1_000_000, 900);
    await rateLimit(`signin:fail:${body.email}`, 1_000_000, 900);
    throw new ApiError("unauthorized", "invalid_credentials");
  }
  const { token, expires } = await createSession(userId, { userAgent: req.headers.get("user-agent"), ip });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  const u = await asSystem((tx) => tx.one<{ locale: string; role: string }>(`SELECT locale, role FROM users WHERE id = $1`, [userId]));
  if (u) store.set(LOCALE_COOKIE, u.locale, { path: "/", sameSite: "lax", maxAge: 365 * 864e2 });
  track(userId, "account.signed_in");
  if (Math.random() < 0.05) pruneRateLimits().catch(() => {});
  return json({ ok: true, redirect: u?.role === "platform_admin" ? "/admin" : u?.role === "institution_admin" ? "/institution" : "/app" });
});
