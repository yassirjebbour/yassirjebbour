import { requireRole } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { adminOverview } from "@/server/repo/admin";
import { AdminConsole } from "@/components/admin/console";
import { Count } from "@/components/viz";
import { IconUser, IconSpark, IconChat, IconSettings, IconThumbUp, IconThumbDown } from "@/components/icons";
import { ISignal, IMail, IBook } from "@/components/app/flow/icons";

export default async function Page() {
  await requireRole("platform_admin");
  const { t } = await getT();
  const o = await adminOverview();
  const f = o.funnel;
  const steps = [["funnel_signup", f.signup], ["funnel_onboarded", f.onboarded], ["funnel_skill", f.skill], ["funnel_target", f.target], ["funnel_plan", f.plan], ["funnel_task", f.task]] as const;
  const tiles = [
    { icon: IconUser, n: o.users.students, label: t("admin.users") },
    { icon: ISignal, n: o.wau, label: t("admin.wau") },
    { icon: IconSpark, n: o.northStar, label: t("admin.north_star"), gold: true },
  ];
  return (
    <div className="app-page portal">
      <div className="page-head"><p className="eyebrow">{t("flow.ad.kicker")}</p><h1>{t("admin.title")}</h1></div>
      <div className="tile-grid">
        {tiles.map((x, i) => (
          <div key={x.label} className="panel tile enter" style={{ "--i": i } as React.CSSProperties}>
            <span className={`icon-tile ${x.gold ? "gold" : ""}`} aria-hidden="true"><x.icon /></span>
            <b className="tile-num"><Count value={x.n} /></b>
            <span className="small muted">{x.label}</span>
          </div>
        ))}
      </div>

      <section className="panel" aria-labelledby="funnel-h" data-reveal>
        <h2 id="funnel-h">{t("admin.funnel")}</h2>
        {f.signup === 0 ? <p className="muted">{t("admin.no_data")}</p> : (
          <ol className="funnel">
            {steps.map(([k, v], i) => {
              const pct = Math.round((v / Math.max(1, f.signup)) * 100);
              return (
                <li key={k} style={{ "--i": i } as React.CSSProperties}>
                  <span className="funnel-label">{t(`admin.${k}`)}</span>
                  <span className="funnel-bar" role="img" aria-label={t("flow.ad.of_signup", { pct })}><span style={{ width: `${Math.max(pct, 1)}%` }} /></span>
                  <span className="funnel-n num">{v}</span>
                  <span className="funnel-pct small muted num">{pct}%</span>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="panel stack" aria-labelledby="ai-h" data-reveal>
        <h2 id="ai-h">{t("admin.ai")}</h2>
        {o.ai.length === 0 ? <p className="muted">{t("admin.no_data")}</p> : (
          <div className="tbl-wrap">
            <table className="dt">
              <thead><tr><th>{t("flow.ad.feature")}</th><th>{t("flow.ad.engine")}</th><th className="n">{t("admin.ai_calls")}</th><th className="n">{t("admin.ai_errors")}</th><th className="n">{t("admin.ai_latency")}</th><th className="n">{t("flow.ad.tokens")}</th><th className="n">{t("admin.ai_cost")}</th></tr></thead>
              <tbody>{o.ai.map((r) => (
                <tr key={r.feature + r.engine}>
                  <td><code>{r.feature}</code></td><td><code>{r.engine}</code></td><td className="n num">{r.calls}</td>
                  <td className={`n num ${r.errors ? "is-bad" : ""}`}>{r.errors}</td><td className="n num" dir="ltr">{r.p50 ?? "—"} ms</td>
                  <td className="n num" dir="ltr">{r.tokens_in} / {r.tokens_out}</td><td className="n num" dir="ltr">${Number(r.cost).toFixed(4)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <h3>{t("flow.ad.signals")}</h3>
        <div className="signals">
          <div className="signal">
            <span className="icon-tile" aria-hidden="true"><IconSettings /></span>
            <span className="stack-sm" style={{ gap: 2, minWidth: 0 }}><strong>{t("flow.ad.tools")}</strong>
              <span className="small muted signal-v" dir="ltr">{o.tools.length ? o.tools.map((x) => `${x.tool} ${x.runs}${x.failures ? ` (${x.failures} ✗)` : ""}`).join(" · ") : "—"}</span></span>
          </div>
          <div className="signal">
            <span className="icon-tile" aria-hidden="true"><IBook /></span>
            <span className="stack-sm" style={{ gap: 2 }}><strong>{t("flow.ad.retrieval")}</strong>
              <span className="small muted">{t("flow.ad.retrieval_d", { n: o.retrieval.n, ms: o.retrieval.p50 ?? "—", empty: o.retrieval.empty })}</span></span>
          </div>
          <div className="signal">
            <span className="icon-tile" aria-hidden="true"><IconChat /></span>
            <span className="stack-sm" style={{ gap: 2 }}><strong>{t("flow.ad.feedback")}</strong>
              <span className="small muted signal-fb"><span><IconThumbUp width={14} height={14} aria-label={t("assistant.good")} /> <span className="num">{o.feedback.up}</span></span><span><IconThumbDown width={14} height={14} aria-label={t("assistant.bad")} /> <span className="num">{o.feedback.down}</span></span></span></span>
          </div>
          <div className="signal">
            <span className="icon-tile" aria-hidden="true"><IMail /></span>
            <span className="stack-sm" style={{ gap: 2 }}><strong>{t("flow.ad.email")}</strong>
              <span className="small muted" dir="ltr">{o.outbox.map((x) => `${x.status} ${x.n}`).join(" · ") || "—"}</span></span>
          </div>
        </div>
      </section>
      <AdminConsole />
    </div>
  );
}
