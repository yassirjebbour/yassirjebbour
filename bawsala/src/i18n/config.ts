export const LOCALES = ["ar", "ary", "fr", "en", "zgh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "bawsala_locale";

/** Content that is authored per language. Darija and Tamazight are optional and fall back. */
export type Localized = { en?: string; fr?: string; ar?: string; ary?: string; zgh?: string };

export const LOCALE_META: Record<Locale, { label: string; english: string; dir: "rtl" | "ltr"; htmlLang: string; intl: string; contentFallback: Array<keyof Localized> }> = {
  ar: { label: "العربية", english: "Arabic", dir: "rtl", htmlLang: "ar", intl: "ar-MA", contentFallback: ["ar", "fr", "en"] },
  ary: { label: "الدارجة", english: "Darija", dir: "rtl", htmlLang: "ary", intl: "ar-MA", contentFallback: ["ary", "ar", "fr", "en"] },
  fr: { label: "Français", english: "French", dir: "ltr", htmlLang: "fr", intl: "fr-MA", contentFallback: ["fr", "en", "ar"] },
  en: { label: "English", english: "English", dir: "ltr", htmlLang: "en", intl: "en-GB", contentFallback: ["en", "fr", "ar"] },
  // Tamazight (Standard Moroccan Tamazight) in Tifinagh is written left-to-right (IRCAM usage).
  zgh: { label: "ⵜⴰⵎⴰⵣⵉⵖⵜ", english: "Tamazight", dir: "ltr", htmlLang: "zgh-Tfng", intl: "fr-MA", contentFallback: ["zgh", "fr", "en", "ar"] },
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

/** Pick the best available text for a locale. */
export function pick(value: Localized | null | undefined, locale: Locale): string {
  if (!value) return "";
  for (const k of LOCALE_META[locale].contentFallback) {
    const s = value[k];
    if (s) return s;
  }
  return value.en ?? value.fr ?? value.ar ?? "";
}

/** True when the text shown is not in the requested language (so the UI can say so). */
export function isFallback(value: Localized | null | undefined, locale: Locale): boolean {
  return !!value && !value[locale];
}

/** Negotiate a locale from Accept-Language. Arabic speakers in Morocco default to Darija-friendly Arabic. */
export function negotiate(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  for (const part of acceptLanguage.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    if (tag.startsWith("zgh") || tag.startsWith("tzm") || tag.startsWith("ber")) return "zgh";
    if (tag === "ary" || tag === "ar-ma") return "ary";
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("fr")) return "fr";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
