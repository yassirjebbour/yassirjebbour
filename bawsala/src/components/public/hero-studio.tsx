"use client";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { useErrorMessage } from "../ui";
import { SKILL_NAMES, SKILL_CATEGORY } from "@/lib/skill-names";
import { Constellation, Ring, type SkyStar } from "../viz";
import { TRY_EXAMPLES, type TryExampleId } from "@/lib/try-examples";
import type { TryResult } from "@/server/domain/try";

/**
 * The landing-page studio: a visitor writes one sentence and watches their skills appear as a
 * constellation, with the closest example roles. Examples are pre-computed on the server, so the
 * first paint already shows a real result (no request, no layout shift).
 */
export function HeroStudio({ initial, precomputed }: { initial: TryExampleId; precomputed: Record<TryExampleId, TryResult> }) {
  const { t, pick } = useI18n();
  const err = useErrorMessage();
  const startText = TRY_EXAMPLES.find((e) => e.id === initial)?.text ?? "";
  const [ex, setEx] = useState<TryExampleId | null>(initial);
  const [text, setText] = useState<string>(startText);
  const [result, setResult] = useState<TryResult>(precomputed[initial]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const ctrl = useRef<AbortController | null>(null);
  const ids = useId();

  const name = (id: string) => pick(SKILL_NAMES[id]) || id;
  const stars: SkyStar[] = result.found.map((f) => ({ id: f.skillId, label: name(f.skillId), category: SKILL_CATEGORY[f.skillId] ?? "other", status: "suggested" }));

  function show(r: TryResult) {
    setResult(r);
    setAnnounce(t("landing.try_found", { n: r.found.length }));
  }
  function choose(id: TryExampleId) {
    const e = TRY_EXAMPLES.find((x) => x.id === id);
    if (!e) return;
    ctrl.current?.abort();
    setEx(id); setText(e.text); setError(null); setBusy(false);
    show(precomputed[id]);
  }
  async function analyze(e?: React.FormEvent) {
    e?.preventDefault();
    const v = text.trim();
    if (v.length < 3) return;
    const same = TRY_EXAMPLES.find((x) => x.text === v);
    if (same) { choose(same.id); return; }
    ctrl.current?.abort();
    const c = new AbortController(); ctrl.current = c;
    setBusy(true); setError(null); setEx(null);
    try { show(await api<TryResult>("/try", { body: { text: v }, signal: c.signal })); }
    catch (x) { if (!c.signal.aborted) setError(err(x)); }
    finally { if (ctrl.current === c) setBusy(false); }
  }

  return (
    <div className={`studio ${busy ? "is-busy" : ""}`}>
      <div className="studio-sky">
        <Constellation stars={stars} seed="hero-sky" ariaLabel={t("home.sky_label", { n: stars.length })} />
        {result.found.length === 0 && !busy ? <p className="studio-empty">{t("landing.try_none")}</p> : null}
        {busy ? <p className="studio-thinking" aria-hidden="true"><span className="spin" />{t("home.thinking")}</p> : null}
      </div>

      <form className="studio-bar" onSubmit={analyze}>
        <label htmlFor={`${ids}-t`} className="sr-only">{t("home.studio_label")}</label>
        <textarea id={`${ids}-t`} dir="auto" rows={2} value={text} maxLength={1500} placeholder={t("landing.try_placeholder")}
          onChange={(e) => { setText(e.target.value); setEx(null); }}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze(); }} />
        <button type="submit" className="btn btn-gold" disabled={busy || text.trim().length < 3} aria-busy={busy || undefined}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z" /></svg>
          {t("landing.try_button")}
        </button>
      </form>

      <div className="studio-examples" role="group" aria-label={t("home.examples")}>
        <span className="studio-examples-label" aria-hidden="true">{t("home.examples")}</span>
        {TRY_EXAMPLES.map((e) => (
          <button key={e.id} type="button" className="ex-chip" aria-pressed={ex === e.id} onClick={() => choose(e.id)} lang={e.id === "arabizi" ? "ary-Latn" : e.id}>{e.label}</button>
        ))}
      </div>

      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      <p className="sr-only" aria-live="polite">{announce}</p>

      {result.roles.length ? (
        <div className="studio-roles" key={`r-${result.roles.map((r) => r.slug).join()}`}>
          <p className="studio-sub">{t("home.roles_title")}</p>
          <ul>
            {result.roles.map((r, i) => (
              <li key={r.slug} className="role-chip enter-scale" style={{ "--i": i } as React.CSSProperties}>
                <Ring value={r.have} max={Math.max(1, r.total)} size={38} stroke={4} label={t("opps.fit", { have: r.have, total: r.total })} fs={11}><b className="num">{r.have}/{r.total}</b></Ring>
                <span className="role-meta"><span className="bidi">{pick(r.title)}</span><small>{t("home.example_badge")}</small></span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.found.length ? (
        <details className="studio-why">
          <summary>{t("home.why_title")} <span className="num">({result.found.length})</span></summary>
          <ul>
            {result.found.map((f) => (
              <li key={f.skillId}><strong>{name(f.skillId)}</strong><span className="bidi" dir="auto">{f.quote}</span></li>
            ))}
          </ul>
        </details>
      ) : null}

      <div className="studio-foot">
        <p>{t("home.engine_note")}</p>
        {result.found.length ? <Link href="/signup" className="studio-save">{t("landing.try_cta")} <span aria-hidden="true" className="flip-rtl">→</span></Link> : null}
      </div>
    </div>
  );
}
