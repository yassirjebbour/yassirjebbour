import { requireRole } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { institutionStats, verificationQueue } from "@/server/repo/institution";
import { pick } from "@/i18n/config";
import { SKILLS } from "@/server/domain/catalog";
import { VerificationQueue } from "@/components/institution/queue";
import { CopyCode } from "@/components/institution/copy-code";
import { Count, Ring } from "@/components/viz";
import { IconPath, IconShield, IconUser } from "@/components/icons";

export default async function Page() {
  const user = await requireRole("institution_admin");
  const { t, locale } = await getT();
  if (!user.institutionId) return <p className="alert">{t("institution.no_institution")}</p>;
  const [s, queue] = await Promise.all([institutionStats(user.institutionId), verificationQueue(user.institutionId)]);
  const name = (id: string) => pick(SKILLS.find((x) => x.id === id)?.names, locale) || id;
  const evidencePct = s.stats ? Math.round((s.stats.totals.evidenced / Math.max(1, s.stats.totals.skills)) * 100) : 0;
  return (
    <div className="app-page portal">
      <div className="page-head">
        <p className="eyebrow">{t("flow.inst.kicker")}</p>
        <h1 className="bidi">{s.institution.name}</h1>
        <p>{t("institution.sub", { name: s.institution.name, min: s.minGroup })}</p>
      </div>

      <div className="tile-grid">
        <div className="panel tile enter" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="icon-tile" aria-hidden="true"><IconUser /></span>
          <b className="tile-num"><Count value={s.sharing} /></b>
          <span className="small muted">{t("institution.students_sharing", { n: s.sharing })}</span>
        </div>
        <div className="panel tile enter" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="icon-tile gold" aria-hidden="true"><IconShield /></span>
          <CopyCode code={s.institution.join_code} />
          <span className="small muted">{t("institution.join_code")}</span>
        </div>
        {s.stats ? (
          <div className="panel tile enter" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="icon-tile" aria-hidden="true"><IconPath /></span>
            <b className="tile-num"><Count value={s.stats.withPlan} /></b>
            <span className="small muted">{t("institution.with_plan")}</span>
          </div>
        ) : null}
      </div>

      <aside className="portal-note" data-reveal>
        <span className="icon-tile" aria-hidden="true"><IconShield /></span>
        <span className="stack-sm" style={{ gap: 2 }}><strong>{t("flow.inst.privacy_title")}</strong><span className="small">{t("flow.inst.privacy_body", { min: s.minGroup })}</span></span>
      </aside>

      {!s.stats ? <p className="alert">{t("institution.too_few", { min: s.minGroup })}</p> : (
        <div className="portal-split">
          <section className="panel" aria-labelledby="dist-h" data-reveal>
            <h2 id="dist-h">{t("institution.skills_dist")}</h2>
            <ul className="dist">
              {s.stats.skills.map((k, i) => {
                const share = Math.round((k.students / Math.max(1, s.sharing)) * 100);
                const ev = Math.round((k.evidenced / Math.max(1, k.students)) * 100);
                return (
                  <li key={k.skill_id} style={{ "--i": i } as React.CSSProperties}>
                    <span className="dist-name bidi">{name(k.skill_id)}</span>
                    <span className="dist-bar" role="img" aria-label={`${t("flow.inst.share")}: ${share}%`}><span style={{ width: `${share}%` }} /></span>
                    <span className="dist-n num">{k.students}</span>
                    <span className="dist-ev small muted num" title={t("institution.evidence_rate")}>{ev}%</span>
                  </li>
                );
              })}
            </ul>
            {s.stats.skills.length === 0 ? <p className="small muted">{t("admin.no_data")}</p> : null}
          </section>
          <section className="panel portal-rings" data-reveal>
            <Ring value={evidencePct} max={100} size={132} stroke={11} tone="gold" fs={26} label={`${t("institution.evidence_rate")}: ${evidencePct}%`}>
              <b className="num">{evidencePct}%</b><small>{t("institution.evidence_rate")}</small>
            </Ring>
            <div className="stat"><b className="num"><Count value={s.stats.tasksDone30} /></b><span className="small muted">{t("institution.tasks_done_30")}</span></div>
          </section>
        </div>
      )}

      <section className="panel stack" aria-labelledby="vq" data-reveal>
        <div className="panel-head">
          <h2 id="vq">{t("institution.verifications")}</h2>
          <span className={`badge ${queue.length ? "b-evidenced" : "b-unverified"}`}>{t("flow.inst.pending", { n: queue.length })}</span>
        </div>
        <p className="small muted">{t("institution.verify_rule")}</p>
        <VerificationQueue items={JSON.parse(JSON.stringify(queue.map((q) => ({ ...q, skill: name(q.skill_id) }))))} />
      </section>
    </div>
  );
}
