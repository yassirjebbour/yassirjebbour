"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Field, useErrorMessage } from "../ui";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { SuggestionList, type SuggestionItem } from "./suggestions";
import { Constellation, CompassRose, Ring, StarField, type SkyStar } from "../viz";
import { SKILL_CATEGORY, SKILL_NAMES } from "@/lib/skill-names";
import { IconCheck } from "../icons";
import { ICap, IScroll, ISearchPerson, IBriefcase, IDots, IBadge, IStore, IUsers, IHeart, IBulb, IBook, IArrow, ILock } from "./flow/icons";

type Init = { situation: string | null; field_of_study: string | null; education_level: string | null; school: string | null; city: string | null; languages: string[]; goal: string | null };
type Role = { id: string; title: Record<string, string>; organization: string; is_sample: boolean; fit: { requiredHave: number; requiredTotal: number } };
const TOTAL = 5;
const LANGS = ["ar", "fr", "en", "zgh", "es", "de"] as const;
const KINDS = ["job", "internship", "family", "club", "volunteer", "project", "course", "other"] as const;
const SITS = ["student", "graduate", "job_seeker", "employed", "other"] as const;
const STEP_KEYS = ["lang", "you", "exp", "skills", "target"] as const;
/** A greeting written in each language's own script: shows the choice before reading the label. */
const HELLO: Record<Locale, string> = { ary: "مرحبا بيك", ar: "أهلاً وسهلاً", fr: "Bonjour", en: "Hello", zgh: "ⴰⵣⵓⵍ" };
const SIT_ICON = { student: ICap, graduate: IScroll, job_seeker: ISearchPerson, employed: IBriefcase, other: IDots } as const;
const KIND_ICON = { job: IBriefcase, internship: IBadge, family: IStore, club: IUsers, volunteer: IHeart, project: IBulb, course: IBook, other: IDots } as const;

export function Onboarding({ initial }: { initial: Init }) {
  const { t, locale, pick } = useI18n();
  const err = useErrorMessage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [p, setP] = useState(initial);
  const [exp, setExp] = useState({ kind: "family", title: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[] | null>(null);
  const [decided, setDecided] = useState<Record<string, boolean>>({});
  const [engine, setEngine] = useState<string>("rules");
  const [roles, setRoles] = useState<Role[]>([]);
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => { document.getElementById("ob-title")?.focus({ preventScroll: true }); }, [step]);

  function go(n: number) { setDir(n >= step ? "fwd" : "back"); setError(null); setStep(n); }
  async function changeLang(l: Locale) {
    await api("/locale", { body: { locale: l } }).catch(() => {});
    router.refresh();
  }
  async function saveProfile() {
    setBusy(true); setError(null);
    try { await api("/profile", { method: "PATCH", body: p }); go(3); }
    catch (e) { setError(err(e)); } finally { setBusy(false); }
  }
  async function analyze() {
    if (exp.description.trim().length < 10) return;
    setBusy(true); setError(null); setPhase(0);
    try {
      const created = await api<{ id: string }>("/experiences", { body: { kind: exp.kind, title: exp.title.trim() || t(`kinds.${exp.kind}` as never), description: exp.description } });
      setPhase(1);
      const r = await api<{ engine: string }>(`/experiences/${created.id}/analyze`, { body: {} });
      setEngine(r.engine);
      setPhase(2);
      const pass = await api<{ suggestions: SuggestionItem[] }>("/passport");
      setSuggestions(pass.suggestions);
      setDecided({});
      go(4);
    } catch (e) { setError(err(e)); } finally { setBusy(false); setPhase(-1); }
  }
  async function loadRoles() {
    setBusy(true); setError(null);
    try {
      const r = await api<{ items: Role[] }>("/opportunities");
      setRoles(r.items.slice(0, 6));
      go(5);
    } catch (e) { setError(err(e)); } finally { setBusy(false); }
  }
  async function finish() {
    setBusy(true); setError(null);
    try {
      if (target) await api(`/opportunities/${target}/target`, { body: {} });
      await api("/profile", { method: "PATCH", body: { goal: p.goal || null, onboarded: true } });
      router.replace("/app"); router.refresh();
    } catch (e) { setError(err(e)); setBusy(false); }
  }

  const text = exp.description.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const checks = [
    { ok: words >= 15, label: t("flow.ob.rich_words") },
    { ok: /\d/.test(text), label: t("flow.ob.rich_number") },
    { ok: text.split(/[.!?،,;؛\n]|\s(?:w|و|et|and)\s/i).filter((s) => s.trim().split(/\s+/).length >= 2).length >= 2, label: t("flow.ob.rich_tasks") },
  ];
  const richness = checks.filter((c) => c.ok).length;
  const sky: SkyStar[] = (suggestions ?? []).filter((s) => decided[s.id] !== false).map((s) => ({
    id: s.skill_id, label: pick(SKILL_NAMES[s.skill_id]) || s.skill_id, category: SKILL_CATEGORY[s.skill_id] ?? "other", status: decided[s.id] ? "inferred" : "suggested",
  }));
  const confirmedN = Object.values(decided).filter(Boolean).length;
  const errorBox = error ? <p className="alert alert-err" role="alert">{error}</p> : null;

  return (
    <div className="ob">
      <div className="ob-progress">
        <p className="small muted">{t("onboarding.step", { n: step, total: TOTAL })}</p>
        <ol className="ob-steps" aria-label={t("flow.ob.progress")} style={{ "--p": (step - 1) / (TOTAL - 1) } as React.CSSProperties}>
          {STEP_KEYS.map((k, i) => {
            const n = i + 1;
            const state = n < step ? "done" : n === step ? "now" : "todo";
            return (
              <li key={k} className={`ob-step ${state}`} aria-current={n === step ? "step" : undefined}>
                <span className="ob-dot" aria-hidden="true">{n < step ? <IconCheck /> : n}</span>
                <span className="ob-step-label">{t(`flow.ob.steps.${k}`)}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <section key={step} className={`ob-card panel ${dir}`} aria-labelledby="ob-title">
        {step === 1 && (
          <div className="stack">
            <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s1_title")}</h1>
            <p className="muted">{t("onboarding.s1_sub")}</p>
            <div className="ob-langs" role="group" aria-label={t("common.language")}>
              {LOCALES.map((l, i) => (
                <button key={l} type="button" className="ob-lang" aria-pressed={locale === l} lang={LOCALE_META[l].htmlLang} dir={LOCALE_META[l].dir} onClick={() => changeLang(l)} style={{ "--i": i } as React.CSSProperties}>
                  <span className="ob-hello">{HELLO[l]}</span>
                  <span className="ob-lang-name">{LOCALE_META[l].label}</span>
                  <span className="ob-tick" aria-hidden="true"><IconCheck /></span>
                </button>
              ))}
            </div>
            <p className="ob-note small"><ILock width={16} height={16} />{t("landing.facts_private")}</p>
            <div className="ob-actions"><Button size="lg" onClick={() => go(2)}>{t("common.continue")}<IArrow className="arrow" width={18} height={18} /></Button></div>
          </div>
        )}

        {step === 2 && (
          <div className="stack">
            <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s2_title")}</h1>
            <fieldset className="ob-fieldset">
              <legend className="label">{t("onboarding.situation")}</legend>
              <div className="ob-tiles">
                {SITS.map((s, i) => {
                  const Icon = SIT_ICON[s];
                  return (
                    <button key={s} type="button" className="ob-tile" aria-pressed={p.situation === s} onClick={() => setP({ ...p, situation: s })} style={{ "--i": i } as React.CSSProperties}>
                      <span className="ob-tile-icon" aria-hidden="true"><Icon /></span>{t(`onboarding.sit_${s}`)}
                    </button>
                  );
                })}
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
            <fieldset className="ob-fieldset">
              <legend className="label">{t("onboarding.languages")}</legend>
              <div className="chips">
                {LANGS.map((l) => {
                  const on = p.languages.includes(l);
                  return <button key={l} type="button" className="chip" aria-pressed={on} onClick={() => setP({ ...p, languages: on ? p.languages.filter((x) => x !== l) : [...p.languages, l] })}>{on ? <IconCheck width={15} height={15} aria-hidden="true" /> : null}{t(`languages.${l}`)}</button>;
                })}
              </div>
            </fieldset>
            {errorBox}
            <div className="ob-actions"><Button size="lg" onClick={saveProfile} loading={busy}>{t("common.continue")}<IArrow className="arrow" width={18} height={18} /></Button><Button variant="ghost" onClick={() => go(1)}>{t("common.back")}</Button></div>
          </div>
        )}

        {step === 3 && (
          <div className="stack">
            <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s3_title")}</h1>
            <p className="muted">{t("onboarding.s3_sub")}</p>
            <fieldset className="ob-fieldset">
              <legend className="label">{t("onboarding.s3_kind")}</legend>
              <div className="ob-tiles ob-tiles-sm">
                {KINDS.map((k, i) => {
                  const Icon = KIND_ICON[k];
                  return (
                    <button key={k} type="button" className="ob-tile" aria-pressed={exp.kind === k} onClick={() => setExp({ ...exp, kind: k })} style={{ "--i": i } as React.CSSProperties}>
                      <span className="ob-tile-icon" aria-hidden="true"><Icon /></span>{t(`kinds.${k}`)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <Field id="exp-title" label={<>{t("onboarding.s3_titlefield")} <span className="muted">({t("common.optional")})</span></>}><input id="exp-title" className="input" value={exp.title} placeholder={t("onboarding.s3_title_ph")} onChange={(e) => setExp({ ...exp, title: e.target.value })} maxLength={200} /></Field>
            <div className="ob-write">
              <Field id="exp-desc" label={t("onboarding.s3_desc")} hint={words < 15 ? t("onboarding.s3_meter_low") : t("onboarding.s3_meter_ok")}>
                <textarea id="exp-desc" className="textarea" style={{ minHeight: 170 }} value={exp.description} placeholder={t("onboarding.s3_desc_ph")} onChange={(e) => setExp({ ...exp, description: e.target.value })} maxLength={4000} />
              </Field>
              <aside className="ob-rich" aria-label={t("flow.ob.rich_title")}>
                <p className="small"><strong>{t("flow.ob.rich_title")}</strong></p>
                <div className="ob-rich-bar" role="meter" aria-valuemin={0} aria-valuemax={3} aria-valuenow={richness} aria-label={words < 15 ? t("onboarding.s3_meter_low") : t("onboarding.s3_meter_ok")}>
                  {[0, 1, 2].map((i) => <span key={i} className={i < richness ? "on" : ""} />)}
                </div>
                <ul className="ob-checks">
                  {checks.map((c) => <li key={c.label} className={c.ok ? "ok" : ""}><span className="ob-check-ic" aria-hidden="true">{c.ok ? <IconCheck /> : null}</span>{c.label}<span className="sr-only">{c.ok ? " ✓" : ""}</span></li>)}
                </ul>
              </aside>
            </div>
            {errorBox}
            <div className="ob-actions">
              <Button size="lg" onClick={analyze} loading={busy && phase >= 0} disabled={exp.description.trim().length < 10 || busy}>{t("onboarding.s3_analyze")}</Button>
              <Button variant="ghost" onClick={loadRoles} disabled={busy}>{t("common.skip")}</Button>
            </div>
            {busy && phase >= 0 ? (
              <div className="ob-analyzing night" role="status" aria-live="polite">
                <StarField count={22} seed="ob-analyze" />
                <div className="ob-an-rose" aria-hidden="true"><CompassRose /></div>
                <div className="stack-sm">
                  <p className="ob-an-title">{t("flow.ob.an_title")}</p>
                  <ol className="ob-an-steps">
                    {(["an_save", "an_find", "an_prepare"] as const).map((k, i) => (
                      <li key={k} className={i < phase ? "done" : i === phase ? "now" : ""}>
                        <span className="ob-an-ic" aria-hidden="true">{i < phase ? <IconCheck /> : i === phase ? <span className="spin" /> : null}</span>{t(`flow.ob.${k}`)}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {step === 4 && suggestions && (
          <div className="stack">
            <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s4_title")}</h1>
            <p className="muted">{t("onboarding.s4_sub")}</p>
            {suggestions.length ? (
              <div className="ob-found">
                <div className="ob-sky night">
                  <StarField count={18} seed="ob-sky" />
                  <Constellation stars={sky} seed="onboarding" labels={false} ariaLabel={t("flow.ob.confirmed", { n: confirmedN })} />
                  <div className="ob-sky-meta">
                    <p className="ob-sky-count"><span className="num">{confirmedN}</span> / <span className="num">{suggestions.length}</span></p>
                    <p className="small">{t("flow.ob.confirmed", { n: confirmedN })}</p>
                    <p className="small muted">{t("flow.ob.sky_caption")}</p>
                  </div>
                </div>
                <div className="stack-sm">
                  <p className="small muted">{engine === "ai+rules" ? t("onboarding.engine_ai") : t("onboarding.engine_rules")}</p>
                  <SuggestionList items={suggestions} onDecide={(id, ok) => setDecided((d) => ({ ...d, [id]: ok }))} />
                </div>
              </div>
            ) : <p className="alert">{t("onboarding.s4_none")}</p>}
            {errorBox}
            <div className="ob-actions"><Button size="lg" onClick={loadRoles} loading={busy}>{t("common.continue")}<IArrow className="arrow" width={18} height={18} /></Button><Button variant="ghost" onClick={() => go(3)}>{t("common.back")}</Button></div>
          </div>
        )}

        {step === 5 && (
          <div className="stack">
            <h1 id="ob-title" tabIndex={-1}>{t("onboarding.s5_title")}</h1>
            <p className="muted">{t("onboarding.s5_sub")}</p>
            <div className="ob-roles" role="radiogroup" aria-label={t("onboarding.s5_title")}>
              {roles.map((r, i) => (
                <label key={r.id} className="ob-role" style={{ "--i": i } as React.CSSProperties}>
                  <input type="radio" name="target" checked={target === r.id} onChange={() => setTarget(r.id)} />
                  <Ring value={r.fit.requiredHave} max={Math.max(1, r.fit.requiredTotal)} size={54} stroke={5} fs={13} label={t("opps.fit", { have: r.fit.requiredHave, total: r.fit.requiredTotal })}>
                    <b className="num">{r.fit.requiredHave}/{r.fit.requiredTotal}</b>
                  </Ring>
                  <span className="ob-role-text">
                    <strong className="bidi">{pick(r.title)}</strong>
                    <span className="small muted">{r.organization} · {t("opps.fit", { have: r.fit.requiredHave, total: r.fit.requiredTotal })}</span>
                  </span>
                  {r.is_sample ? <span className="badge b-demo">{t("common.demo")}</span> : null}
                </label>
              ))}
            </div>
            <p className="small muted">{t("flow.ob.pick_hint")}</p>
            <Field id="goal" label={t("onboarding.s5_goal")}><textarea id="goal" className="textarea" style={{ minHeight: 90 }} value={p.goal ?? ""} onChange={(e) => setP({ ...p, goal: e.target.value })} maxLength={600} /></Field>
            {errorBox}
            <div className="ob-actions"><Button onClick={finish} loading={busy} size="lg">{t("onboarding.finish")}<IArrow className="arrow" width={18} height={18} /></Button></div>
          </div>
        )}
      </section>
    </div>
  );
}
