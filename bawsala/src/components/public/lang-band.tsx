"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import type { Locale } from "@/i18n/config";

/** Native names and one native question per language: content shown as-is in every UI language. */
const LANGS: Array<{ l: Locale; name: string; q: string; dir: "rtl" | "ltr" }> = [
  { l: "ary", name: "الدارجة", q: "شنو كتعرف دير؟", dir: "rtl" },
  { l: "ar", name: "العربية", q: "ماذا تستطيع أن تفعل؟", dir: "rtl" },
  { l: "fr", name: "Français", q: "Que savez-vous faire ?", dir: "ltr" },
  { l: "en", name: "English", q: "What can you do?", dir: "ltr" },
  { l: "zgh", name: "ⵜⴰⵎⴰⵣⵉⵖⵜ", q: "ⵎⴰ ⵜⵣⵎⵔⵜ ⴰⴷ ⵜⵙⴽⵔⵜ?", dir: "ltr" },
];

export function LangBand() {
  const { locale } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState<Locale | null>(null);
  async function pickLang(l: Locale) {
    if (l === locale) return;
    setBusy(l);
    try { await api("/locale", { body: { locale: l } }); router.refresh(); } finally { setBusy(null); }
  }
  return (
    <ul className="lang-band">
      {LANGS.map((x, i) => (
        <li key={x.l} data-reveal style={{ "--i": i } as React.CSSProperties}>
          <button type="button" className="lang-card" aria-pressed={x.l === locale} aria-busy={busy === x.l || undefined} onClick={() => pickLang(x.l)} lang={x.l}>
            <span className="lang-q" dir={x.dir}>{x.q}</span>
            <span className="lang-name">{x.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
