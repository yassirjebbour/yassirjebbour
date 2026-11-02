"use client";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, useErrorMessage } from "../ui";
import { SKILL_NAMES } from "@/lib/skill-names";

export function TryIt() {
  const { t, locale, pick } = useI18n();
  const err = useErrorMessage();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Array<{ skillId: string; quote: string }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) return;
    setBusy(true); setError(null);
    try { setResult((await api<{ found: Array<{ skillId: string; quote: string }> }>("/try", { body: { text } })).found); }
    catch (x) { setError(err(x)); }
    finally { setBusy(false); }
  }
  return (
    <form onSubmit={run} className="stack">
      <label htmlFor="try-text" className="sr-only">{t("landing.try_title")}</label>
      <textarea id="try-text" className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("landing.try_placeholder")} maxLength={1500} lang={locale === "zgh" ? "zgh" : undefined} />
      <div><Button type="submit" loading={busy}>{t("landing.try_button")}</Button></div>
      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      {result ? (
        <div className="panel stack-sm" aria-live="polite">
          {result.length === 0 ? <p className="muted">{t("landing.try_none")}</p> : (
            <>
              <p><strong>{t("landing.try_found", { n: result.length })}</strong></p>
              <ul className="list">
                {result.map((r) => (
                  <li key={r.skillId} className="stack-sm">
                    <span className="badge b-suggested">{pick(SKILL_NAMES[r.skillId]) || r.skillId}</span>
                    <span className="quote">{r.quote}</span>
                  </li>
                ))}
              </ul>
              <div><Link className="btn btn-primary" href="/signup">{t("landing.try_cta")}</Link></div>
            </>
          )}
        </div>
      ) : null}
    </form>
  );
}
