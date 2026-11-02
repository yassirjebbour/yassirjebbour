"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Field, Meter, useErrorMessage } from "../ui";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { SuggestionList, type SuggestionItem } from "./suggestions";

type Init = { situation: string | null; field_of_study: string | null; education_level: string | null; school: string | null; city: string | null; languages: string[]; goal: string | null };
const TOTAL = 5;
const LANGS = ["ar", "fr", "en", "zgh", "es", "de"] as const;
const KINDS = ["job", "internship", "family", "club", "volunteer", "project", "course", "other"] as const;

export function Onboarding({ initial }: { initial: Init }) {
  const { t, locale, pick } = useI18n();
  const err = useErrorMessage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [p, setP] = useState(initial);
  const [exp, setExp] = useState({ kind: "family", title: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[] | null>(null);
  const [engine, setEngine] = useState<string>("rules");
  const [roles, setRoles] = useState<Array<{ id: string; title: Record<string, string>; organization: string; is_sample: boolean; fit: { requiredHave: number; requiredTotal: number } }>>([]);
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => { document.getElementById("ob-title")?.focus(); }, [step]);

  async function changeLang(l: Locale) {
    await api("/locale", { body: { locale: l } }).catch(() => {});
    router.refresh();
  }
  async function saveProfile() {
    setBusy(true); setError(null);
    try { await api("/profile", { method: "PATCH", body: p }); setStep(3); }
    catch (e) { setError(err(e)); } finally { setBusy(false); }
  }
  async function analyze() {
    if (exp.description.trim().length < 10) return;
    setBusy(true); setError(null);
    try {
      const created = await api<{ id: string }>("/experiences", { body: { kind: exp.kind, title: exp.title.trim() || t(`kinds.${exp.kind}` as never), description: exp.description } });
      const r = await api<{ engine: string }>(`/experiences/${created.id}/analyze`, { body: {} });
      setEngine(r.engine);
      const pass = await api<{ suggestions: SuggestionItem[] }>("/passport");
      setSuggestions(pass.suggestions);
      setStep(4);
    } catch (e) { setError(err(e)); } finally { setBusy(false); }
  }
  async function loadRoles() {
    const r = await api<{ items: typeof roles }>("/opportunities");
    setRoles(r.items.slice(0, 6));
    setStep(5);
  }
  async function finish() {
    setBusy(true); setError(null);
    try {
      if (target) await api(`/opportunities/${target}/target`, { body: {} });
      await api("/profile", { method: "PATCH", body: { goal: p.goal || null, onboarded: true } });
      router.replace("/app"); router.refresh();
    } catch (e) { setError(err(e)); setBusy(false); }
  }
  const words = exp.description.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="stack-lg" style={{ maxWidth: 680, marginInline: "auto" }}>
      <div className="stack-sm">
        <p className="small muted">{t("onboarding.step", { n: step, total: TOTAL })}</p>
        <Meter value={step} max={TOTAL} label={t("onboarding.step", { n: step, total: TOTAL })} />
      </div>

      {step === 1 && (
        <section className="panel stack">
          <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s1_title")}</h1>
          <p className="muted">{t("onboarding.s1_sub")}</p>
          <div className="chips" role="group" aria-label={t("common.language")}>
            {LOCALES.map((l) => <button key={l} type="button" className="chip" aria-pressed={locale === l} lang={LOCALE_META[l].htmlLang} onClick={() => changeLang(l)}>{LOCALE_META[l].label}</button>)}
          </div>
          <div><Button onClick={() => setStep(2)}>{t("common.continue")}</Button></div>
        </section>
      )}

      {step === 2 && (
        <section className="panel stack">
          <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s2_title")}</h1>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="label">{t("onboarding.situation")}</legend>
            <div className="chips" style={{ marginTop: 6 }}>
              {(["student", "graduate", "job_seeker", "employed", "other"] as const).map((s) => <button key={s} type="button" className="chip" aria-pressed={p.situation === s} onClick={() => setP({ ...p, situation: s })}>{t(`onboarding.sit_${s}`)}</button>)}
            </div>
          </fieldset>
          <div className="grid-2">
            <Field id="field" label={t("onboarding.field")}><input id="field" className="input" value={p.field_of_study ?? ""} placeholder={t("onboarding.field_ph")} onChange={(e) => setP({ ...p, field_of_study: e.target.value })} maxLength={160} /></Field>
            <Field id="level" label={t("onboarding.level")}>
              <select id="level" className="select" value={p.education_level ?? ""} onChange={(e) => setP({ ...p, education_level: e.target.value || null })}>
                <option value="">—</option>
                {(["bac", "bac2", "licence", "master", "doctorate", "vocational", "other"] as const).map((l) => <option key={l} value={l}>{t(`onboarding.lvl_${l}`)}</option>)}
              </select>
            </Field>
            <Field id="school" label={<>{t("onboarding.school")} <span className="muted">({t("common.optional")})</span></>}><input id="school" className="input" value={p.school ?? ""} onChange={(e) => setP({ ...p, school: e.target.value })} maxLength={200} /></Field>
            <Field id="city" label={<>{t("onboarding.city")} <span className="muted">({t("common.optional")})</span></>}><input id="city" className="input" value={p.city ?? ""} onChange={(e) => setP({ ...p, city: e.target.value })} maxLength={120} /></Field>
          </div>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="label">{t("onboarding.languages")}</legend>
            <div className="chips" style={{ marginTop: 6 }}>
              {LANGS.map((l) => {
                const on = p.languages.includes(l);
                return <button key={l} type="button" className="chip" aria-pressed={on} onClick={() => setP({ ...p, languages: on ? p.languages.filter((x) => x !== l) : [...p.languages, l] })}>{t(`languages.${l}`)}</button>;
              })}
            </div>
          </fieldset>
          {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
          <div className="row"><Button onClick={saveProfile} loading={busy}>{t("common.continue")}</Button><Button variant="ghost" onClick={() => setStep(1)}>{t("common.back")}</Button></div>
        </section>
      )}

      {step === 3 && (
        <section className="panel stack">
          <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s3_title")}</h1>
          <p className="muted">{t("onboarding.s3_sub")}</p>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="label">{t("onboarding.s3_kind")}</legend>
            <div className="chips" style={{ marginTop: 6 }}>
              {KINDS.map((k) => <button key={k} type="button" className="chip" aria-pressed={exp.kind === k} onClick={() => setExp({ ...exp, kind: k })}>{t(`kinds.${k}`)}</button>)}
            </div>
          </fieldset>
          <Field id="exp-title" label={<>{t("onboarding.s3_titlefield")} <span className="muted">({t("common.optional")})</span></>}><input id="exp-title" className="input" value={exp.title} placeholder={t("onboarding.s3_title_ph")} onChange={(e) => setExp({ ...exp, title: e.target.value })} maxLength={200} /></Field>
          <Field id="exp-desc" label={t("onboarding.s3_desc")} hint={words < 15 ? t("onboarding.s3_meter_low") : t("onboarding.s3_meter_ok")}>
            <textarea id="exp-desc" className="textarea" style={{ minHeight: 160 }} value={exp.description} placeholder={t("onboarding.s3_desc_ph")} onChange={(e) => setExp({ ...exp, description: e.target.value })} maxLength={4000} />
          </Field>
          <Meter value={Math.min(words, 40)} max={40} label={t("onboarding.s3_desc")} tone="gold" />
          {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
          <div className="row">
            <Button onClick={analyze} loading={busy} disabled={exp.description.trim().length < 10}>{t("onboarding.s3_analyze")}</Button>
            <Button variant="ghost" onClick={loadRoles}>{t("common.skip")}</Button>
          </div>
        </section>
      )}

      {step === 4 && suggestions && (
        <section className="panel stack">
          <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s4_title")}</h1>
          <p className="muted">{t("onboarding.s4_sub")}</p>
          <p className="small muted">{engine === "ai+rules" ? t("onboarding.engine_ai") : t("onboarding.engine_rules")}</p>
          {suggestions.length ? <SuggestionList items={suggestions} /> : <p className="alert">{t("onboarding.s4_none")}</p>}
          <div className="row"><Button onClick={loadRoles}>{t("common.continue")}</Button><Button variant="ghost" onClick={() => setStep(3)}>{t("common.back")}</Button></div>
        </section>
      )}

      {step === 5 && (
        <section className="panel stack">
          <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s5_title")}</h1>
          <p className="muted">{t("onboarding.s5_sub")}</p>
          <div className="stack-sm" role="radiogroup" aria-label={t("onboarding.s5_title")}>
            {roles.map((r) => (
              <label key={r.id} className="opp check" style={{ alignItems: "center" }}>
                <input type="radio" name="target" checked={target === r.id} onChange={() => setTarget(r.id)} />
                <span className="stack-sm" style={{ gap: 2, flex: 1 }}>
                  <span className="row-between"><strong>{pick(r.title)}</strong>{r.is_sample ? <span className="badge b-demo">{t("common.demo")}</span> : null}</span>
                  <span className="small muted">{r.organization} · {t("opps.fit", { have: r.fit.requiredHave, total: r.fit.requiredTotal })}</span>
                </span>
              </label>
            ))}
          </div>
          <Field id="goal" label={t("onboarding.s5_goal")}><textarea id="goal" className="textarea" style={{ minHeight: 80 }} value={p.goal ?? ""} onChange={(e) => setP({ ...p, goal: e.target.value })} maxLength={600} /></Field>
          {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
          <div><Button onClick={finish} loading={busy} size="lg">{t("onboarding.finish")}</Button></div>
        </section>
      )}
    </div>
  );
}
