import { z } from "zod";
import { cookies } from "next/headers";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { zLocale, zName } from "@/server/http/schemas";
import { deleteAccount, setLocale, updateName } from "@/server/repo/account";
import { SESSION_COOKIE } from "@/server/auth/session";
import { rateLimitCount } from "@/server/ratelimit";
import { env } from "@/server/env";
import { LOCALE_COOKIE } from "@/i18n/config";
import { track } from "@/server/events";

export const GET = route(async () => {
  const user = await apiUser();
  return json({ user, ai: { messagesToday: await rateLimitCount(`chat:day:${user.id}`, 86_400), dailyLimit: env().AI_DAILY_MESSAGES_PER_USER } });
});

const Patch = z.object({ name: zName.optional(), locale: zLocale.optional() });
export const PATCH = route(async (req) => {
  const user = await apiUser();
  const body = await readJson(req, Patch);
  if (body.name) await updateName(user.id, body.name);
  if (body.locale) {
    await setLocale(user.id, body.locale);
    (await cookies()).set(LOCALE_COOKIE, body.locale, { path: "/", sameSite: "lax", maxAge: 365 * 864e2 });
  }
  return json({ ok: true });
});

const Del = z.object({ password: z.string().min(1).max(200) });
export const DELETE = route(async (req) => {
  const user = await apiUser();
  const { password } = await readJson(req, Del);
  await deleteAccount(user.id, password);
  track(null, "account.deleted");
  (await cookies()).delete(SESSION_COOKIE);
  return json({ ok: true, redirect: "/?deleted=1" });
});
