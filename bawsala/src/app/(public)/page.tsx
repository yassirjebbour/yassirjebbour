import Link from "next/link";
import { getT } from "@/i18n/server";
import { TryIt } from "@/components/public/try-it";

export default async function Landing() {
  const { t } = await getT();
  const states = [
    ["b-suggested", "landing.state_suggested", "landing.state_suggested_d"],
    ["b-inferred", "landing.state_confirmed", "landing.state_confirmed_d"],
    ["b-evidenced", "landing.state_evidenced", "landing.state_evidenced_d"],
    ["b-verified", "landing.state_verified", "landing.state_verified_d"],
  ] as const;
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">{t("landing.kicker")}</p>
          <h1 style={{ marginTop: 16 }}>{t("landing.h1")}</h1>
          <p className="lead">{t("landing.sub")}</p>
          <div className="row" style={{ marginTop: 28 }}>
            <Link href="/signup" className="btn btn-primary btn-lg">{t("landing.cta")}</Link>
            <Link href="/signin" className="btn btn-secondary btn-lg">{t("landing.cta_signin")}</Link>
          </div>
          <ul className="facts">
            <li>{t("landing.facts_time")}</li>
            <li>{t("landing.facts_lang")}</li>
            <li>{t("landing.facts_private")}</li>
          </ul>
        </div>
      </section>

      <section className="section section-sunk" aria-labelledby="try-h">
        <div className="container">
          <div className="stack" style={{ maxWidth: 720 }}>
            <h2 id="try-h">{t("landing.try_title")}</h2>
            <p className="muted">{t("landing.try_sub")}</p>
            <TryIt />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-h">
        <div className="container">
          <h2 id="how-h">{t("landing.how_title")}</h2>
          <ol className="steps">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <li key={n}><h3>{t(`landing.how_${n}_t`)}</h3><p className="muted small" style={{ marginTop: 6 }}>{t(`landing.how_${n}_d`)}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-sunk" aria-labelledby="trust-h">
        <div className="container grid-2">
          <div className="stack">
            <h2 id="trust-h">{t("landing.trust_title")}</h2>
            <p className="muted">{t("landing.trust_sub")}</p>
            <ul className="list">
              {states.map(([cls, k, d]) => (
                <li key={k} className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                  <span className={`badge ${cls}`} style={{ minWidth: 92, justifyContent: "center" }}>{t(k)}</span>
                  <span className="small">{t(d)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="stack">
            <h2>{t("landing.honest_title")}</h2>
            <ul className="stack-sm" style={{ paddingInlineStart: 20, margin: 0 }}>
              <li>{t("landing.honest_1")}</li>
              <li>{t("landing.honest_2")}</li>
              <li>{t("landing.honest_3")}</li>
            </ul>
            <div><Link href="/signup" className="btn btn-primary">{t("landing.cta")}</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
