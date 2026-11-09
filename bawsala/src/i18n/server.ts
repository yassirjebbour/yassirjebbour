import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { isLocale, negotiate, LOCALE_COOKIE, LOCALE_META, type Locale } from "./config";
import { messagesFor, translator } from "./messages";
import { getCurrentUser } from "@/server/auth/current";

/** Locale priority: signed-in user's saved language → cookie → Accept-Language → Arabic. */
export const getLocale = cache(async (): Promise<Locale> => {
  const user = await getCurrentUser().catch(() => null);
  if (user && isLocale(user.locale)) return user.locale;
  const c = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(c)) return c;
  return negotiate((await headers()).get("accept-language"));
});

export async function getT() {
  const locale = await getLocale();
  return { t: translator(locale), locale, dir: LOCALE_META[locale].dir, messages: messagesFor(locale) };
}
