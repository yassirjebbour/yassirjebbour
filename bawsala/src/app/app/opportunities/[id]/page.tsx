import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { getOpportunity, fitFor } from "@/server/repo/opportunities";
import { getProfile } from "@/server/repo/profile";
import { getActivePlan } from "@/server/repo/plans";
import { ownedSkills } from "@/server/repo/skills";
import { readiness } from "@/server/domain/matching";
import { pick } from "@/i18n/config";
import { SKILLS } from "@/server/domain/catalog";
import { OpportunityActions } from "@/components/app/opportunity-actions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { locale } = await getT();
  try { const o = await getOpportunity((await params).id); return { title: pick(o.title, locale) }; } catch { return {}; }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { t, locale } = await getT();
  let opp;
  try { opp = await getOpportunity((await params).id); } catch { notFound(); }
  const [fit, profile, plan, owned] = await Promise.all([fitFor(user.id, opp), getProfile(user.id), getActivePlan(user.id), ownedSkills(user.id)]);
  const rd = readiness(opp.requirements, owned);
  const name = (id: string) => pick(SKILLS.find((s) => s.id === id)?.names, locale) || id;
  const status = opp.is_sample ? "demo" : opp.verification_status;
  const fmt = (d: string | Date) => new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-MA", { dateStyle: "medium" }).format(new Date(d));
  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="row"><span className={`badge ${status === "demo" ? "b-demo" : status === "verified" ? "b-verified-src" : "b-unverified"}`}>{status === "demo" ? t("common.demo") : status === "verified" ? t("common.verified_source") : t("common.unverified_source")}</span></div>
        <h1>{pick(opp.title, locale)}</h1>
        <p>{opp.organization}{opp.city ? ` · ${opp.city}` : ""} · {t(`kinds.${opp.kind}` as never)}</p>
      </div>
      {opp.is_sample ? <p className="alert alert-warn" role="note">{t("opps.demo_banner")}</p> : null}
      <div className="grid-2">
        <section className="panel stack" aria-labelledby="gap-h">
          <h2 id="gap-h">{t("opps.gap_title")}</h2>
          <p className="small">{t("opps.fit", { have: fit.requiredHave, total: fit.requiredTotal })} · {t("opps.readiness", { evidenced: rd.evidenced, required: rd.required })}</p>
          {fit.have.length ? <div className="stack-sm"><span className="label">{t("opps.have")}</span><div className="chips">{fit.have.map((s) => <span key={s} className="badge b-inferred">{name(s)}</span>)}</div></div> : null}
          {fit.missingRequired.length || fit.missingNice.length ? (
            <ul className="list">
              {[...fit.missingRequired.map((s) => [s, true] as const), ...fit.missingNice.map((s) => [s, false] as const)].map(([s, req]) => {
                const def = SKILLS.find((x) => x.id === s);
                return (
                  <li key={s} className="row-between">
                    <span><strong>{name(s)}</strong>{req ? "" : <span className="muted small"> · {t("opps.nice")}</span>}</span>
                    {def?.learn?.url ? <a className="small" href={def.learn.url} target="_blank" rel="noopener noreferrer">{t("opps.learn")}: {pick(def.learn.title, locale)}{def.learn.hours ? ` · ~${def.learn.hours} h` : ""}</a> : null}
                  </li>
                );
              })}
            </ul>
          ) : <p className="alert alert-ok">{t("opps.gap_none")}</p>}
        </section>
        <section className="panel stack">
          <OpportunityActions id={opp.id} isTarget={profile.target_opportunity_id === opp.id} hasPlanForIt={plan?.opportunity_id === opp.id} applyUrl={opp.is_sample ? null : opp.apply_url} />
          {opp.project_brief ? <div className="stack-sm"><h3>{t("opps.project")}</h3><p className="small">{pick(opp.project_brief, locale)}</p></div> : null}
          {pick(opp.description, locale) ? <p className="small muted">{pick(opp.description, locale)}</p> : null}
          {opp.eligibility ? <div className="stack-sm"><h3>{t("opps.eligibility")}</h3><p className="small">{pick(opp.eligibility, locale)}</p></div> : null}
          <p className="small muted">{t("common.source")}: {opp.source_url ? <a href={opp.source_url} target="_blank" rel="noopener noreferrer nofollow">{opp.source_name}</a> : opp.source_name} · {t("common.updated", { date: fmt(opp.source_updated_at) })}{opp.deadline ? ` · ${t("opps.deadline", { date: fmt(opp.deadline) })}` : ""}</p>
        </section>
      </div>
    </div>
  );
}
