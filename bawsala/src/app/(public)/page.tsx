import Link from "next/link";
import { getT } from "@/i18n/server";
import { pick } from "@/i18n/config";
import { getCurrentUser } from "@/server/auth/current";
import { analyzeTry, type TryResult } from "@/server/domain/try";
import { TRY_EXAMPLES, EXAMPLE_FOR_LOCALE, type TryExampleId } from "@/lib/try-examples";
import { SKILL_NAMES } from "@/lib/skill-names";
import { HeroStudio } from "@/components/public/hero-studio";
import { Story } from "@/components/public/story";
import { StatesDemo } from "@/components/public/states-demo";
import { LangBand } from "@/components/public/lang-band";
import { StarField, CompassRose } from "@/components/viz";

// The examples are deterministic, so they are analysed once per server process.
const PRE = Object.fromEntries(TRY_EXAMPLES.map((e) => [e.id, analyzeTry(e.text)])) as Record<TryExampleId, TryResult>;

const MARQUEE: Array<[string, string]> = [
  ["exp_shop", "customer_service"], ["exp_club", "event"], ["exp_summer", "sales"], ["exp_volunteer", "teamwork"], ["exp_instagram", "social_media"],
  ["exp_tourists", "multilingual"], ["exp_tutor", "presentation"], ["exp_captain", "leadership"], ["exp_class", "research"], ["exp_souk", "negotiation"],
];

const Arrow = () => <svg className="arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
const I = {
  clock: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  globe: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
  lock: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  quote: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" /></svg>,
  tag: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>,
};

export default async function Landing() {
  const { t, locale } = await getT();
  const user = await getCurrentUser();
  const initial = EXAMPLE_FOR_LOCALE[locale] ?? "ary";
  const sample = TRY_EXAMPLES.find((e) => e.id === initial)!;
  const home = user ? (user.role === "platform_admin" ? "/admin" : user.role === "institution_admin" ? "/institution" : "/app") : null;
  const pills = MARQUEE.map(([exp, skill]) => ({ exp: t(`home.${exp}` as never), skill: pick(SKILL_NAMES[skill], locale) || skill }));
  const row = (list: typeof pills, k: string) => list.map((p, i) => (
    <span key={`${k}${i}`} className="mq-item"><span className="mq-exp">{p.exp}</span><span className="mq-arrow flip-rtl" aria-hidden="true">→</span><span className="mq-skill">✓ {p.skill}</span></span>
  ));
  return (
    <>
      <section className="hero-night night" aria-labelledby="hero-h">
        <StarField count={70} seed="hero" />
        <div className="hero-aurora" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow enter" style={{ "--i": 0 } as React.CSSProperties}>{t("landing.kicker")}</p>
            <h1 id="hero-h" className="hero-title enter" style={{ "--i": 1 } as React.CSSProperties}>{t("home.h1_a")} <span className="text-gold">{t("home.h1_b")}</span></h1>
            <p className="hero-lead enter" style={{ "--i": 2 } as React.CSSProperties}>{t("landing.sub")}</p>
            <div className="hero-ctas enter" style={{ "--i": 3 } as React.CSSProperties}>
              {home ? <Link className="btn btn-gold btn-lg" href={home}>{t("nav.home")} <Arrow /></Link> : (
                <>
                  <Link className="btn btn-gold btn-lg" href="/signup">{t("landing.cta")} <Arrow /></Link>
                  <Link className="btn btn-glass btn-lg" href="/signin">{t("landing.cta_signin")}</Link>
                </>
              )}
            </div>
            <ul className="hero-facts enter" style={{ "--i": 4 } as React.CSSProperties}>
              <li>{I.clock}{t("landing.facts_time")}</li>
              <li>{I.globe}{t("landing.facts_lang")}</li>
              <li>{I.lock}{t("landing.facts_private")}</li>
            </ul>
          </div>
          <div className="hero-studio enter-scale" style={{ "--i": 3 } as React.CSSProperties}>
            <HeroStudio initial={initial} precomputed={PRE} />
          </div>
        </div>
      </section>

      <section className="marquee-sec" aria-label={t("home.marquee_label")}>
        <ul className="sr-only">{pills.map((p, i) => <li key={i}>{p.exp}: {p.skill}</li>)}</ul>
        <div className="marquee" aria-hidden="true"><div className="mq-track">{row(pills, "a")}{row(pills, "b")}</div></div>
        <div className="marquee rev" aria-hidden="true"><div className="mq-track">{row([...pills].reverse(), "c")}{row([...pills].reverse(), "d")}</div></div>
      </section>

      <section id="how" className="section story-sec" aria-labelledby="how-h">
        <div className="container">
          <div className="sec-head" data-reveal>
            <p className="eyebrow">{t("landing.how_title")}</p>
            <h2 id="how-h">{t("home.story_title")}</h2>
            <p>{t("home.story_sub")}</p>
          </div>
          <Story sentence={sample.text} sentenceDir={sample.dir} sample={PRE[initial]} />
        </div>
      </section>

      <section className="section trust-sec" aria-labelledby="trust-h">
        <div className="container trust-grid">
          <div className="stack-lg">
            <div className="sec-head" data-reveal>
              <p className="eyebrow">{t("home.trust_eyebrow")}</p>
              <h2 id="trust-h">{t("landing.trust_title")}</h2>
              <p>{t("landing.trust_sub")}</p>
            </div>
            <div className="honest" data-reveal>
              <h3>{t("landing.honest_title")}</h3>
              <ul>
                <li><span className="icon-tile">{I.quote}</span><span>{t("landing.honest_1")}</span></li>
                <li><span className="icon-tile gold">{I.tag}</span><span>{t("landing.honest_2")}</span></li>
                <li><span className="icon-tile">{I.shield}</span><span>{t("landing.honest_3")}</span></li>
              </ul>
            </div>
          </div>
          <div data-reveal="scale"><StatesDemo /></div>
        </div>
      </section>

      <section className="section lang-sec" aria-labelledby="lang-h">
        <div className="container">
          <div className="sec-head center" data-reveal>
            <p className="eyebrow">{t("home.lang_eyebrow")}</p>
            <h2 id="lang-h">{t("home.lang_title")}</h2>
            <p>{t("home.lang_sub")}</p>
          </div>
          <LangBand />
        </div>
      </section>

      <section className="final-cta night" aria-labelledby="final-h">
        <StarField count={40} seed="final" />
        <div className="container final-grid">
          <div className="final-rose" aria-hidden="true" data-reveal="scale"><CompassRose /></div>
          <div className="stack final-copy" data-reveal>
            <h2 id="final-h">{t("home.final_title")}</h2>
            <p>{t("home.final_sub")}</p>
            <div className="hero-ctas">
              {home ? <Link className="btn btn-gold btn-lg" href={home}>{t("nav.home")} <Arrow /></Link> : (
                <>
                  <Link className="btn btn-gold btn-lg" href="/signup">{t("landing.cta")} <Arrow /></Link>
                  <Link className="btn btn-glass btn-lg" href="/signin">{t("landing.cta_signin")}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
