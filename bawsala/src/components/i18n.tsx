"use client";
import { createContext, useContext, useMemo } from "react";
import { render, resolve, formatNumber } from "@/i18n/format";
import { LOCALE_META, type Locale, type Localized, pick } from "@/i18n/config";
import type { Messages, MessageKey } from "@/i18n/messages";

interface Ctx { locale: Locale; messages: Messages }
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ locale, messages, children }: Ctx & { children: React.ReactNode }) {
  const v = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <I18nCtx.Provider value={v}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  const { locale, messages } = ctx;
  const t = (key: MessageKey, vars?: Record<string, string | number>) => render(resolve(messages, key), locale, vars, key);
  const fmtDate = (d: string | Date) => new Intl.DateTimeFormat(LOCALE_META[locale].intl, { day: "numeric", month: "short", year: "numeric", numberingSystem: "latn" }).format(new Date(d));
  return { t, locale, dir: LOCALE_META[locale].dir, pick: (v: Localized | null | undefined) => pick(v, locale), fmtNum: (n: number) => formatNumber(n, locale), fmtDate };
}
