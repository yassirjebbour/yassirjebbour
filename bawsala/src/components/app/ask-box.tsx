"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { IconSend } from "../icons";

/** Starts a new assistant conversation with the typed question. */
export function AskBox() {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form className="ask-box" onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/app/assistant?q=${encodeURIComponent(q.trim())}`); }}>
      <label htmlFor="ask" className="sr-only">{t("dashboard.assistant_title")}</label>
      <div className="ask-field">
        <input id="ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("dashboard.assistant_ph")} maxLength={500} autoComplete="off" />
        <button className="btn btn-primary btn-icon" aria-label={t("assistant.send")} disabled={!q.trim()}><IconSend width={18} height={18} className="flip-rtl" /></button>
      </div>
      <div className="ask-prompts">
        {(["skills", "match", "plan"] as const).map((k, i) => (
          <button key={k} type="button" className="ask-prompt" style={{ "--i": i } as React.CSSProperties} onClick={() => router.push(`/app/assistant?q=${encodeURIComponent(t(`assistant.prompts.${k}`))}`)}>
            <span aria-hidden="true" className="ask-spark">✦</span><span className="bidi">{t(`assistant.prompts.${k}`)}</span>
          </button>
        ))}
      </div>
    </form>
  );
}
