"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { useI18n } from "./i18n";
import { api } from "@/lib/api";
import { IconGlobe } from "./icons";

export function LanguageSwitcher({ compact, tone }: { compact?: boolean; tone?: "night" }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function change(l: Locale) {
    setBusy(true);
    try { await api("/locale", { body: { locale: l } }); router.refresh(); } finally { setBusy(false); }
  }
  return (
    <label className={`lang-pick ${tone === "night" ? "on-night" : ""}`}>
      <IconGlobe width={17} height={17} aria-hidden="true" />
      <span className="sr-only">{t("common.language")}</span>
      <select value={locale} disabled={busy} onChange={(e) => change(e.target.value as Locale)} aria-label={t("common.language")} style={compact ? undefined : { minWidth: 130 }}>
        {LOCALES.map((l) => <option key={l} value={l} lang={LOCALE_META[l].htmlLang}>{LOCALE_META[l].label}</option>)}
      </select>
    </label>
  );
}

/** Flips light/dark and remembers the choice (a non-sensitive UI preference). */
export function toggleTheme() {
  const el = document.documentElement;
  const cur = el.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  const apply = () => { el.dataset.theme = next; };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("theme-vt"); const vt = doc.startViewTransition(apply) as { finished?: Promise<unknown> }; vt.finished?.finally(() => el.classList.remove("theme-vt")); }
  else apply();
  try { localStorage.setItem("bawsala.theme", next); } catch { /* private mode */ }
}

export function ThemeToggle({ tone }: { tone?: "night" }) {
  const { t } = useI18n();
  return (
    <button type="button" className={`btn btn-ghost btn-icon theme-btn ${tone === "night" ? "on-night" : ""}`} onClick={toggleTheme} aria-label={t("shell.theme")} title={t("shell.theme")}>
      <svg className="i-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      <svg className="i-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
    </button>
  );
}
