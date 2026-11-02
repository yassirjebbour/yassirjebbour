import { requireRole } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { institutionStats, verificationQueue } from "@/server/repo/institution";
import { pick } from "@/i18n/config";
import { SKILLS } from "@/server/domain/catalog";
import { VerificationQueue } from "@/components/institution/queue";

export default async function Page() {
  const user = await requireRole("institution_admin");
  const { t, locale } = await getT();
  if (!user.institutionId) return <p className="alert">{t("institution.no_institution")}</p>;
  const [s, queue] = await Promise.all([institutionStats(user.institutionId), verificationQueue(user.institutionId)]);
  const name = (id: string) => pick(SKILLS.find((x) => x.id === id)?.names, locale) || id;
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{s.institution.name}</h1><p>{t("institution.sub", { name: s.institution.name, min: s.minGroup })}</p></div>
      <div className="grid-3">
        <div className="panel stat"><b className="num">{s.sharing}</b><span className="small muted">{t("institution.students_sharing", { n: s.sharing })}</span></div>
        <div className="panel stat"><b className="num" dir="ltr">{s.institution.join_code}</b><span className="small muted">{t("institution.join_code")}</span></div>
        {s.stats ? <div className="panel stat"><b className="num">{s.stats.withPlan}</b><span className="small muted">{t("institution.with_plan")}</span></div> : null}
      </div>
      {!s.stats ? <p className="alert">{t("institution.too_few", { min: s.minGroup })}</p> : (
        <div className="grid-2">
          <section className="panel">
            <h2>{t("institution.skills_dist")}</h2>
            <table className="md" style={{ marginTop: 12, width: "100%" }}>
              <thead><tr><th>{t("nav.passport")}</th><th className="num">#</th><th>{t("institution.evidence_rate")}</th></tr></thead>
              <tbody>{s.stats.skills.map((k) => <tr key={k.skill_id}><td>{name(k.skill_id)}</td><td className="num">{k.students}</td><td className="num">{Math.round((k.evidenced / Math.max(1, k.students)) * 100)}%</td></tr>)}</tbody>
            </table>
          </section>
          <section className="panel stack-sm">
            <div className="stat"><b className="num">{Math.round((s.stats.totals.evidenced / Math.max(1, s.stats.totals.skills)) * 100)}%</b><span className="small muted">{t("institution.evidence_rate")}</span></div>
            <div className="stat"><b className="num">{s.stats.tasksDone30}</b><span className="small muted">{t("institution.tasks_done_30")}</span></div>
          </section>
        </div>
      )}
      <section className="panel stack" aria-labelledby="vq">
        <h2 id="vq">{t("institution.verifications")}</h2>
        <p className="small muted">{t("institution.verify_rule")}</p>
        <VerificationQueue items={JSON.parse(JSON.stringify(queue.map((q) => ({ ...q, skill: name(q.skill_id) }))))} />
      </section>
    </div>
  );
}
