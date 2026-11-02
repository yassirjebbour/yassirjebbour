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
    <form className="stack-sm" style={{ marginTop: 12 }} onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/app/assistant?q=${encodeURIComponent(q.trim())}`); }}>
      <label htmlFor="ask" className="sr-only">{t("dashboard.assistant_title")}</label>
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <input id="ask" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("dashboard.assistant_ph")} maxLength={500} />
        <button className="btn btn-primary btn-icon" aria-label={t("assistant.send")}><IconSend width={18} height={18} /></button>
      </div>
      <div className="chips">
        {(["skills", "match", "plan"] as const).map((k) => (
          <button key={k} type="button" className="chip" onClick={() => router.push(`/app/assistant?q=${encodeURIComponent(t(`assistant.prompts.${k}`))}`)}>{t(`assistant.prompts.${k}`)}</button>
        ))}
      </div>
    </form>
  );
}
