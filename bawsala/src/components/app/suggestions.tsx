"use client";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, useErrorMessage, useToast } from "../ui";
import { SKILL_NAMES } from "@/lib/skill-names";

export interface SuggestionItem { id: string; skill_id: string; quote: string; reason: string | null; source: string }

/** Consent step: each suggestion shows the student's own sentence; nothing is added without "yes". */
export function SuggestionList({ items, onChange }: { items: SuggestionItem[]; onChange?: () => void }) {
  const { t, pick } = useI18n();
  const err = useErrorMessage();
  const toast = useToast();
  const [done, setDone] = useState<Record<string, "accepted" | "rejected">>({});
  const [busy, setBusy] = useState<string | null>(null);
  async function decide(id: string, accept: boolean) {
    setBusy(id);
    try {
      await api(`/suggestions/${id}/${accept ? "accept" : "reject"}`, { body: {} });
      setDone((d) => ({ ...d, [id]: accept ? "accepted" : "rejected" }));
      onChange?.();
    } catch (e) { toast(err(e)); } finally { setBusy(null); }
  }
  return (
    <ul className="list" aria-live="polite">
      {items.map((s) => {
        const state = done[s.id];
        return (
          <li key={s.id} className="skill-row">
            <div className="row-between">
              <strong>{pick(SKILL_NAMES[s.skill_id]) || s.skill_id}</strong>
              {state ? <span className={`badge ${state === "accepted" ? "b-inferred" : "b-unverified"}`}>{state === "accepted" ? t("passport.status_inferred") : t("passport.reject")}</span> : <span className="badge b-suggested">{t("landing.state_suggested")}</span>}
            </div>
            <p className="small muted">{t("passport.from_words")}</p>
            <p className="quote">{s.quote}</p>
            {s.reason ? <p className="small muted">{t("passport.why")} {s.reason}</p> : null}
            {!state ? (
              <div className="row">
                <Button size="sm" onClick={() => decide(s.id, true)} loading={busy === s.id}>{t("passport.accept")}</Button>
                <Button size="sm" variant="ghost" onClick={() => decide(s.id, false)} disabled={busy === s.id}>{t("passport.reject")}</Button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
