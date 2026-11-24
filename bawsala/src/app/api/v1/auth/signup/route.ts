import { cookies } from "next/headers";
import { z } from "zod";
import { route, readJson, json, clientIp, ApiError } from "@/server/http/api";
import { zEmail, zLocale, zName, zPassword } from "@/server/http/schemas";
import { signUp } from "@/server/repo/account";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/server/auth/session";
import { rateLimit } from "@/server/ratelimit";
import { isEnabled } from "@/server/flags";
import { track } from "@/server/events";
import { LOCALE_COOKIE } from "@/i18n/config";

const Body = z.object({ name: zName, email: zEmail, password: zPassword, locale: zLocale, joinCode: z.string().trim().max(20).optional().nullable(), consent: z.literal(true), website: z.string().max(0).optional() });

export const POST = route(async (req) => {
  await rateLimit(`signup:ip:${clientIp(req)}`, 5, 3600);
  if (!(await isEnabled("signup.open"))) throw new ApiError("forbidden", "signup_closed");
  const body = await readJson(req, Body); // `website` is a honeypot: bots fill it, schema rejects it
  const userId = await signUp({ ...body, joinCode: body.joinCode || null });
  const { token, expires } = await createSession(userId, { userAgent: req.headers.get("user-agent"), ip: clientIp(req) });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  store.set(LOCALE_COOKIE, body.locale, { path: "/", sameSite: "lax", maxAge: 365 * 864e2 });
  track(userId, "account.signed_up", { locale: body.locale, with_institution: !!body.joinCode });
  return json({ ok: true, redirect: "/app/onboarding" }, { status: 201 });
});
