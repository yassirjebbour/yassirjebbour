import { cookies } from "next/headers";
import { z } from "zod";
import { route, readJson, json } from "@/server/http/api";
import { zLocale } from "@/server/http/schemas";
import { LOCALE_COOKIE } from "@/i18n/config";
import { SESSION_COOKIE, validateSession } from "@/server/auth/session";
import { setLocale } from "@/server/repo/account";

export const POST = route(async (req) => {
  const { locale } = await readJson(req, z.object({ locale: zLocale }));
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax", maxAge: 365 * 864e2 });
  const s = await validateSession(store.get(SESSION_COOKIE)?.value);
  if (s) await setLocale(s.user.id, locale);
  return json({ ok: true });
});
