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
import { AskBox } from "@/components/app/ask-box";

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

  const evidenced = passport.filter((s) => s.status === "evidenced" || s.status === "verified").length;
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{t("dashboard.hello", { name: user.name.split(/\s+/)[0] })}</h1></div>

      <section className="next-card" aria-labelledby="next-h">
        <div className="stack-sm"><h2 id="next-h" style={{ color: "inherit", fontSize: 14, fontWeight: 600, opacity: .85 }}>{t("dashboard.next_title")}</h2><p style={{ fontSize: 18, fontWeight: 600 }}>{next.label}</p></div>
        <Link className="btn" href={next.href}>{t("dashboard.go")}</Link>
      </section>

      <div className="grid-2">
        <section className="panel" aria-labelledby="prog-h">
          <h2 id="prog-h">{t("dashboard.progress_title")}</h2>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="stat"><b className="num">{passport.length}</b><span className="muted small">{t("dashboard.stat_skills", { n: passport.length })}</span></div>
            <div className="stat"><b className="num">{evidenced}</b><span className="muted small">{t("dashboard.stat_evidenced", { n: evidenced })}</span></div>
            {stats.plan ? <div className="stat"><b className="num">{stats.plan.done}/{stats.plan.total}</b><span className="muted small">{t("dashboard.stat_tasks", { done: stats.plan.done, total: stats.plan.total })}</span></div> : null}
            <div className="stat"><b className="num">{stats.streakDays}</b><span className="muted small">{t("dashboard.stat_streak", { n: stats.streakDays })}</span></div>
          </div>
        </section>
        <section className="panel" aria-labelledby="ask-h">
          <h2 id="ask-h">{t("dashboard.assistant_title")}</h2>
          <AskBox />
        </section>
      </div>

      <section className="stack" aria-labelledby="match-h">
        <div className="row-between"><h2 id="match-h">{t("dashboard.matches_title")}</h2><Link href="/app/opportunities">{t("dashboard.see_all")}</Link></div>
        {passport.length === 0 ? <p className="muted">{t("dashboard.matches_empty")}</p> : (
          <div className="grid-3">
            {ranked.slice(0, 3).map(({ item, fit }) => (
              <Link key={item.id} href={`/app/opportunities/${item.id}`} className="opp" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="row-between"><span className="opp-title">{pick(item.title, locale)}</span>{item.is_sample ? <span className="badge b-demo">{t("common.demo")}</span> : null}</div>
                <span className="muted small">{item.organization}{item.city ? ` · ${item.city}` : ""}</span>
                <span className="small">{t("opps.fit", { have: fit.requiredHave, total: fit.requiredTotal })}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
