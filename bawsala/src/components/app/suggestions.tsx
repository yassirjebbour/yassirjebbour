"use client";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, useErrorMessage, useToast } from "../ui";
import { SKILL_NAMES } from "@/lib/skill-names";
import { IconCheck, IconX, IconSpark } from "../icons";

export interface SuggestionItem { id: string; skill_id: string; quote: string; reason: string | null; source: string }

/**
 * Consent step: each suggestion shows the student's own sentence; nothing is added without "yes".
 * A decided card resolves in place (check or cross) and folds into a compact row, so the
 * student keeps a visible record of what they accepted.
 */
export function SuggestionList({ items, onChange, onDecide }: { items: SuggestionItem[]; onChange?: () => void; onDecide?: (id: string, accepted: boolean) => void }) {
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
      onDecide?.(id, accept);
      onChange?.();
    } catch (e) { toast(err(e)); } finally { setBusy(null); }
  }
  return (
    <ul className="sg-list" aria-live="polite">
      {items.map((s, i) => {
        const state = done[s.id];
        const name = pick(SKILL_NAMES[s.skill_id]) || s.skill_id;
        return (
          <li key={s.id} className={`sg-card ${state ? `is-${state}` : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <div className="sg-head">
              <span className="sg-mark" aria-hidden="true">{state === "accepted" ? <IconCheck /> : state === "rejected" ? <IconX /> : <IconSpark />}</span>
              <strong className="sg-name bidi">{name}</strong>
              {state ? (
                <span className={`badge ${state === "accepted" ? "b-inferred" : "b-unverified"}`}>{state === "accepted" ? t("flow.sg.added") : t("flow.sg.skipped")}</span>
              ) : <span className="badge b-suggested">{t("landing.state_suggested")}</span>}
            </div>
            <div className="sg-body" {...(state ? { "aria-hidden": true } : {})}>
              <div className="sg-body-inner">
                <figure className="sg-quote">
                  <figcaption className="small muted">{t("passport.from_words")}</figcaption>
                  <blockquote className="quote">{s.quote}</blockquote>
                </figure>
                {s.reason ? <p className="small muted bidi"><span className="sg-why">{t("passport.why")}</span> {s.reason}</p> : null}
                <p className="sg-source small">{s.source === "ai" ? t("flow.sg.ai") : t("flow.sg.rules")}</p>
                {!state ? (
                  <div className="row sg-actions">
                    <Button size="sm" onClick={() => decide(s.id, true)} loading={busy === s.id}><IconCheck width={16} height={16} />{t("passport.accept")}</Button>
                    <Button size="sm" variant="ghost" onClick={() => decide(s.id, false)} disabled={busy === s.id}>{t("passport.reject")}</Button>
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
