"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { SKILL_NAMES } from "@/lib/skill-names";
import { prefersReducedMotion } from "../motion";

const STATES = [
  { key: "suggested", badge: "b-suggested", label: "landing.state_suggested", desc: "landing.state_suggested_d" },
  { key: "confirmed", badge: "b-inferred", label: "landing.state_confirmed", desc: "landing.state_confirmed_d" },
  { key: "evidenced", badge: "b-evidenced", label: "landing.state_evidenced", desc: "landing.state_evidenced_d" },
  { key: "verified", badge: "b-verified", label: "landing.state_verified", desc: "landing.state_verified_d" },
] as const;

/** One skill moving through the four trust states. Auto-plays while visible until the visitor takes over. */
export function StatesDemo() {
  const { t, pick } = useI18n();
  const [s, setS] = useState(0);
  const [auto, setAuto] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!auto || prefersReducedMotion()) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 });
    if (box.current) io.observe(box.current);
    const id = setInterval(() => { if (visible && !document.hidden) setS((x) => (x + 1) % STATES.length); }, 2600);
    return () => { clearInterval(id); io.disconnect(); };
  }, [auto]);
  const st = STATES[s];
  return (
    <div className="states" ref={box}>
      <div className="seg states-seg" role="group" aria-label={t("home.states_label")}>
        {STATES.map((x, i) => (
          <button key={x.key} type="button" aria-pressed={i === s} onClick={() => { setAuto(false); setS(i); }}>{t(x.label)}</button>
        ))}
      </div>
      <div className={`skill-card lvl-${s}`} aria-live="polite">
        <div className="skill-card-head">
          <strong>{pick(SKILL_NAMES.customer_service)}</strong>
          <span className={`badge ${st.badge}`} key={st.key}>{t(st.label)}</span>
        </div>
        <p className="skill-card-quote">{t("home.trust_quote")}</p>
        <ul className="skill-card-rows">
          <li className={s >= 1 ? "on" : ""}><span className="mark">✓</span>{t("landing.state_confirmed_d")}</li>
          <li className={s >= 2 ? "on" : ""}><span className="mark">⎘</span>{t("home.trust_proof")}</li>
          <li className={s >= 3 ? "on" : ""}><span className="mark">✦</span>{t("home.trust_by")}</li>
        </ul>
        {s === 3 ? <span className="stamp" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2l2.4 2.1 3.2-.3.8 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.8 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.8-3.1L2.8 15.5l1.2-3-1.2-3 2.8-1.6.8-3.1 3.2.3z" /><path d="m8.5 12.2 2.4 2.4 4.6-4.8" /></svg></span> : null}
        <p className="skill-card-desc" key={`d-${st.key}`}>{t(st.desc)}</p>
      </div>
    </div>
  );
}
