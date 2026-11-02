"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { useI18n } from "./i18n";
import { api } from "@/lib/api";
import { IconGlobe } from "./icons";

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function change(l: Locale) {
    setBusy(true);
    try { await api("/locale", { body: { locale: l } }); router.refresh(); } finally { setBusy(false); }
  }
  return (
    <label className="row" style={{ gap: 6 }}>
      <IconGlobe width={18} height={18} aria-hidden="true" />
      <span className="sr-only">{t("common.language")}</span>
      <select className="select" style={{ minHeight: 38, width: compact ? 120 : 150, paddingBlock: 4 }} value={locale} disabled={busy} onChange={(e) => change(e.target.value as Locale)} aria-label={t("common.language")}>
        {LOCALES.map((l) => <option key={l} value={l} lang={LOCALE_META[l].htmlLang}>{LOCALE_META[l].label}</option>)}
      </select>
    </label>
  );
}

export function ThemeToggle() {
  const { t } = useI18n();
  function cycle() {
    const el = document.documentElement;
    const cur = el.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    el.dataset.theme = next;
    try { localStorage.setItem("bawsala.theme", next); } catch { /* private mode */ }
  }
  return (
    <button type="button" className="btn btn-ghost btn-icon" onClick={cycle} aria-label={t("settings.title") + ": theme"} title="Theme">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}
