import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { getProfile } from "@/server/repo/profile";
import { listExperiences } from "@/server/repo/experiences";
import { getPassport, pendingSuggestions } from "@/server/repo/skills";
import { rankedForUser } from "@/server/repo/opportunities";
import { getActivePlan, progressStats } from "@/server/repo/plans";
import { pick } from "@/i18n/config";
import { SKILL_NAMES, SKILL_CATEGORY } from "@/lib/skill-names";
import { AskBox } from "@/components/app/ask-box";
import { Count, Ring, StarField, type SkyStar } from "@/components/viz";
import { SkyWithLabels } from "@/components/app/screens/sky";
import { IconPassport, IconPath, IconChat } from "@/components/icons";
import { IconArrow, IconFlame, IconProof } from "@/components/app/screens/icons";

export default async function Dashboard() {
  const user = await requireUser();
  if (user.role === "platform_admin") redirect("/admin");
  const { t, locale } = await getT();
  const [profile, exps, passport, pending, ranked, plan, stats] = await Promise.all([
    getProfile(user.id), listExperiences(user.id), getPassport(user.id), pendingSuggestions(user.id), rankedForUser(user.id), getActivePlan(user.id), progressStats(user.id),
  ]);

  // One next step, computed from real state (progressive disclosure: never a wall of options).
  let next: { label: string; href: string };
  const nextTask = plan?.tasks.find((x) => !x.completed_at);
  if (!profile.onboarded_at) next = { label: t("dashboard.next_onboarding"), href: "/app/onboarding" };
  else if (!exps.length) next = { label: t("dashboard.next_experience"), href: "/app/profile#experiences" };
  else if (pending.length) next = { label: t("dashboard.next_suggestions", { n: pending.length }), href: "/app/passport" };
  else if (!profile.target_opportunity_id) next = { label: t("dashboard.next_target"), href: "/app/opportunities" };
  else if (!plan) next = { label: t("dashboard.next_plan"), href: `/app/opportunities/${profile.target_opportunity_id}` };
  else if (nextTask) next = { label: t("dashboard.next_task", { task: nextTask.title }), href: "/app/plan" };
  else next = { label: t("dashboard.next_done"), href: "/app/opportunities" };

  const name = (id: string) => pick(SKILL_NAMES[id], locale) || id;
  const evidenced = passport.filter((s) => s.status === "evidenced" || s.status === "verified").length;
  const target = profile.target_opportunity_id ? ranked.find((r) => r.item.id === profile.target_opportunity_id) : undefined;
  const owned = new Set(passport.map((s) => s.skill_id));
  const stars: SkyStar[] = [
    ...passport.map((s) => ({ id: s.skill_id, label: name(s.skill_id), category: SKILL_CATEGORY[s.skill_id] ?? "other", status: s.status })),
    ...[...new Set(pending.map((p) => p.skill_id))].filter((id) => !owned.has(id)).map((id) => ({ id, label: name(id), category: SKILL_CATEGORY[id] ?? "other", status: "suggested" as const })),
  ];
  const tiles = [
    { icon: <IconPassport />, value: passport.length, label: t("screens.dash.tile_skills"), tone: "" },
    { icon: <IconProof />, value: evidenced, label: t("screens.dash.tile_proven"), tone: "gold" },
    stats.plan ? { icon: <IconPath />, value: stats.plan.done, total: stats.plan.total, label: t("screens.dash.tile_steps"), tone: "" } : null,
    { icon: <IconFlame />, value: stats.streakDays, label: t("screens.dash.tile_streak"), tone: "gold" },
  ].filter(Boolean) as Array<{ icon: React.ReactNode; value: number; total?: number; label: string; tone: string }>;

  return (
    <div className="app-page dash">
      <header className="page-head enter">
        <h1>{t("dashboard.hello", { name: user.name.split(/\s+/)[0] })}</h1>
        <p>{t("screens.dash.sub")}</p>
      </header>

      <section className="dash-hero night glow enter" style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="next-h">
        <StarField count={36} seed={`hero-${user.id}`} />
        <div className="dash-hero-main">
          <h2 id="next-h" className="eyebrow">{t("dashboard.next_title")}</h2>
          <p className="dash-next bidi">{next.label}</p>
          <div><Link className="btn btn-gold btn-lg" href={next.href}>{t("dashboard.go")}<IconArrow className="arrow" width={18} height={18} /></Link></div>
        </div>
        <div className="dash-hero-ring">
          {target ? (
            <>
              <Ring value={target.fit.requiredHave} max={Math.max(1, target.fit.requiredTotal)} size={156} stroke={10} fs={30}
                label={t("screens.dash.ring_aria_target", { have: target.fit.requiredHave, total: target.fit.requiredTotal, role: pick(target.item.title, locale) })}>
                <b className="num">{target.fit.requiredHave}/{target.fit.requiredTotal}</b><small>{t("screens.dash.ring_required")}</small>
              </Ring>
              <Link href={`/app/opportunities/${target.item.id}`} className="ring-cap"><small>{t("shell.target")}</small><span className="bidi">{pick(target.item.title, locale)}</span></Link>
            </>
          ) : (
            <>
              <Ring value={evidenced} max={Math.max(1, passport.length)} size={156} stroke={10} fs={30} label={t("dashboard.stat_evidenced", { n: evidenced })}>
                <b className="num">{evidenced}/{passport.length}</b><small>{t("screens.dash.ring_skills")}</small>
              </Ring>
              <span className="ring-cap"><small>{t("screens.dash.tile_proven")}</small></span>
            </>
          )}
        </div>
      </section>

      <section className="dash-tiles" aria-label={t("dashboard.progress_title")}>
        {tiles.map((x, i) => (
          <div key={x.label} className="panel tile lift enter" style={{ "--i": i + 2 } as React.CSSProperties}>
            <span className={`icon-tile ${x.tone}`} aria-hidden="true">{x.icon}</span>
            <div className="tile-num num"><Count value={x.value} />{x.total !== undefined ? <span className="tile-of">/{x.total}</span> : null}</div>
            <span className="tile-label">{x.label}</span>
          </div>
        ))}
      </section>

      <div className="dash-grid">
        <section className="dash-sky night" aria-labelledby="sky-h" data-reveal>
          <div className="dash-sky-head">
            <div className="stack-sm">
              <h2 id="sky-h">{t("screens.dash.sky_title")}</h2>
              <p className="small">{stars.length ? t("screens.dash.sky_sub") : t("screens.dash.sky_empty")}</p>
            </div>
            <Link href={stars.length ? "/app/passport" : "/app/profile#experiences"} className="btn btn-glass btn-sm">{stars.length ? t("screens.dash.sky_cta") : t("profile.add_experience")}<IconArrow className="arrow" width={16} height={16} /></Link>
          </div>
          <div className="dash-sky-body">
            <SkyWithLabels stars={stars} seed={`sky-${user.id}`} className="dash-sky-chart" ariaLabel={t("screens.dash.sky_aria", { n: stars.length })} />
            <ul className="sky-legend" aria-label={t("screens.pass.by_status")}>
              <li><i className="lg-suggested" aria-hidden="true" />{t("landing.state_suggested")}</li>
              <li><i className="lg-confirmed" aria-hidden="true" />{t("passport.status_inferred")}</li>
              <li><i className="lg-proven" aria-hidden="true" />{t("passport.status_evidenced")}</li>
              <li><i className="lg-verified" aria-hidden="true" />{t("passport.status_verified")}</li>
            </ul>
          </div>
        </section>

        <section className="panel dash-ask" aria-labelledby="ask-h" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <div className="panel-head">
            <div className="row" style={{ gap: 12, flexWrap: "nowrap" }}>
              <span className="icon-tile" aria-hidden="true"><IconChat /></span>
              <h2 id="ask-h">{t("dashboard.assistant_title")}</h2>
            </div>
          </div>
          <AskBox />
        </section>
      </div>

      <section className="stack" aria-labelledby="match-h" data-reveal>
        <div className="row-between">
          <div className="stack-sm" style={{ gap: 2 }}>
            <h2 id="match-h">{t("dashboard.matches_title")}</h2>
            <p className="small muted">{t("screens.dash.matches_sub")}</p>
          </div>
          <Link href="/app/opportunities" className="btn btn-ghost btn-sm">{t("dashboard.see_all")}<IconArrow className="arrow" width={16} height={16} /></Link>
        </div>
        {passport.length === 0 ? <p className="empty">{t("dashboard.matches_empty")}</p> : (
          <div className="role-grid">
            {ranked.slice(0, 3).map(({ item, fit }, i) => (
              <Link key={item.id} href={`/app/opportunities/${item.id}`} className="role-card lift glow" style={{ "--i": i } as React.CSSProperties} data-reveal>
                <div className="role-top">
                  <span className="logo-tile" aria-hidden="true">{item.organization.slice(0, 2).toUpperCase()}</span>
                  <Ring value={fit.score} max={100} size={58} stroke={5} fs={14} label={t("opps.fit_score", { score: fit.score })} tone={fit.missingRequired.length === 0 ? "gold" : undefined}>
                    <b className="num">{fit.score}%</b>
                  </Ring>
                </div>
                <div className="stack-sm" style={{ gap: 2 }}>
                  <span className="role-title bidi">{pick(item.title, locale)}</span>
                  <span className="small muted bidi">{item.organization}{item.city ? ` · ${item.city}` : ""}</span>
                </div>
                <div className="role-meta">
                  <span className="small">{t("opps.fit", { have: fit.requiredHave, total: fit.requiredTotal })}</span>
                  {item.is_sample ? <span className="badge b-demo">{t("common.demo")}</span> : null}
                </div>
                {fit.missingRequired.length ? (
                  <div className="role-missing"><span className="small muted">{t("opps.missing")}:</span>{fit.missingRequired.slice(0, 3).map((s) => <span key={s} className="mini-chip">{name(s)}</span>)}</div>
                ) : <div className="role-missing"><span className="mini-chip ok">{t("screens.dash.all_required")}</span></div>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
