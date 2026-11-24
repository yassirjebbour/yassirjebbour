"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { SKILL_NAMES } from "@/lib/skill-names";
import { Ring } from "../viz";
import type { TryResult } from "@/server/domain/try";

type Props = { sentence: string; sentenceDir: "rtl" | "ltr"; sample: TryResult };

/**
 * "How it works" as a scroll story: on wide screens a sticky phone shows the step being read;
 * on phones each step carries its own illustration. Illustrations use example data and are
 * hidden from assistive technology (the step text carries the meaning).
 */
export function Story({ sentence, sentenceDir, sample }: Props) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const steps = [1, 2, 3, 4, 5] as const;
  return (
    <div className="story">
      <ol className="story-steps">
        {steps.map((n, i) => (
          <li key={n} data-step={i} ref={(el) => { refs.current[i] = el; }} className={`story-step ${active === i ? "is-active" : ""}`}>
            <span className="story-num" aria-hidden="true">{String(n).padStart(2, "0")}</span>
            <div className="story-text">
              <h3>{t(`landing.how_${n}_t`)}</h3>
              <p>{t(`landing.how_${n}_d`)}</p>
            </div>
            <div className="story-inline only-mobile" data-reveal="scale" aria-hidden="true"><Phone><Screen n={i} sentence={sentence} sentenceDir={sentenceDir} sample={sample} live /></Phone></div>
          </li>
        ))}
      </ol>
      <div className="story-stage hide-mobile" aria-hidden="true">
        <Phone>
          {steps.map((_, i) => <div key={i} className={`story-screen ${active === i ? "is-active" : ""}`}><Screen n={i} sentence={sentence} sentenceDir={sentenceDir} sample={sample} live={active === i} /></div>)}
        </Phone>
        <p className="story-caption">{t("home.illustration")}</p>
      </div>
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return <div className="phone"><div className="phone-notch" /><div className="phone-screen">{children}</div></div>;
}

function Screen({ n, sentence, sentenceDir, sample, live }: { n: number } & Props & { live: boolean }) {
  const { t, pick } = useI18n();
  const name = (id: string) => pick(SKILL_NAMES[id]) || id;
  const skills = sample.found.slice(0, 3);
  // Re-keying on `live` replays the CSS choreography each time the step becomes active.
  const k = live ? "on" : "off";
  if (n === 0) {
    const words = sentence.split(/\s+/);
    return (
      <div className="scr scr-tell" key={k}>
        <div className="scr-bar"><span className="dotm" />BAWSALA</div>
        <div className="scr-bubble" dir={sentenceDir}>{words.map((w, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{w} </span>)}</div>
        <div className="scr-keys">{Array.from({ length: 3 }, (_, r) => <div key={r}>{Array.from({ length: r === 2 ? 7 : 10 }, (_, c) => <i key={c} />)}</div>)}</div>
      </div>
    );
  }
  if (n === 1) {
    return (
      <div className="scr scr-confirm" key={k}>
        <div className="scr-title">{t("landing.state_suggested")}</div>
        {skills.map((s, i) => (
          <div key={s.skillId} className={`scr-card ${i === 0 ? "accepted" : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <strong>{name(s.skillId)}</strong>
            <span className="scr-quote" dir="auto">{s.quote.length > 64 ? `${s.quote.slice(0, 62)}…` : s.quote}</span>
            <span className="scr-actions"><b className="yes">✓</b><b className="no">✕</b></span>
          </div>
        ))}
      </div>
    );
  }
  if (n === 2) {
    const fits = [[2, 2], [2, 3], [1, 2]] as const;
    return (
      <div className="scr scr-match" key={k}>
        <div className="scr-title">{t("home.roles_title")}</div>
        {(sample.roles.length ? sample.roles : []).slice(0, 3).map((r, i) => (
          <div key={r.slug} className="scr-role" style={{ "--i": i } as React.CSSProperties}>
            <Ring value={r.have} max={Math.max(1, r.total)} size={40} stroke={4} label="" fs={11}><b className="num">{r.have}/{r.total}</b></Ring>
            <span className="bidi">{pick(r.title)}</span>
          </div>
        ))}
        {sample.roles.length === 0 ? fits.map(([h, tt], i) => <div key={i} className="scr-role"><Ring value={h} max={tt} size={40} stroke={4} label="" /></div>) : null}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="scr scr-grow" key={k}>
        <div className="scr-title">{t("home.story_day", { n: 12 })} / 30</div>
        <div className="scr-days">{Array.from({ length: 30 }, (_, i) => <i key={i} className={i < 12 ? "done" : i === 12 ? "today" : ""} style={{ "--i": i } as React.CSSProperties} />)}</div>
        {(["learn", "practice", "prove"] as const).map((kind, i) => (
          <div key={kind} className={`scr-task ${i === 0 ? "done" : ""}`} style={{ "--i": i } as React.CSSProperties}><span className="tick" />{t(`plan.kind.${kind}`)}</div>
        ))}
      </div>
    );
  }
  return (
    <div className="scr scr-apply" key={k}>
      <div className="scr-title"><span className="seal" />{t("home.story_ready")}</div>
      <div className="scr-msg bot">{t("home.story_interview_q")}</div>
      <div className="scr-msg me"><span className="typing"><i /><i /><i /></span></div>
      <div className="scr-feedback"><span className="stars">★★★★<em>★</em></span>{t("home.story_feedback")}</div>
    </div>
  );
}
