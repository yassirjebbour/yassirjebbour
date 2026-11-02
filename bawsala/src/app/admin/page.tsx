import { requireRole } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { adminOverview } from "@/server/repo/admin";
import { AdminConsole } from "@/components/admin/console";

export default async function Page() {
  await requireRole("platform_admin");
  const { t } = await getT();
  const o = await adminOverview();
  const f = o.funnel;
  const steps = [["funnel_signup", f.signup], ["funnel_onboarded", f.onboarded], ["funnel_skill", f.skill], ["funnel_target", f.target], ["funnel_plan", f.plan], ["funnel_task", f.task]] as const;
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{t("admin.title")}</h1></div>
      <div className="grid-3">
        <div className="panel stat"><b className="num">{o.users.students}</b><span className="small muted">{t("admin.users")}</span></div>
        <div className="panel stat"><b className="num">{o.wau}</b><span className="small muted">{t("admin.wau")}</span></div>
        <div className="panel stat"><b className="num">{o.northStar}</b><span className="small muted">{t("admin.north_star")}</span></div>
      </div>
      <section className="panel stack-sm">
        <h2>{t("admin.funnel")}</h2>
        {f.signup === 0 ? <p className="muted">{t("admin.no_data")}</p> : (
          <table className="md"><tbody>{steps.map(([k, v]) => <tr key={k}><td>{t(`admin.${k}`)}</td><td className="num">{v}</td><td className="num">{Math.round((v / Math.max(1, f.signup)) * 100)}%</td></tr>)}</tbody></table>
        )}
      </section>
      <section className="panel stack-sm">
        <h2>{t("admin.ai")}</h2>
        {o.ai.length === 0 ? <p className="muted">{t("admin.no_data")}</p> : (
          <table className="md"><thead><tr><th>feature</th><th>engine</th><th>{t("admin.ai_calls")}</th><th>{t("admin.ai_errors")}</th><th>{t("admin.ai_latency")}</th><th>tokens in/out</th><th>{t("admin.ai_cost")}</th></tr></thead>
            <tbody>{o.ai.map((r) => <tr key={r.feature + r.engine}><td>{r.feature}</td><td>{r.engine}</td><td className="num">{r.calls}</td><td className="num">{r.errors}</td><td className="num">{r.p50 ?? "—"} ms</td><td className="num">{r.tokens_in}/{r.tokens_out}</td><td className="num">${Number(r.cost).toFixed(4)}</td></tr>)}</tbody></table>
        )}
        <p className="small muted">tools: {o.tools.map((x) => `${x.tool} ${x.runs}${x.failures ? ` (${x.failures} ✗)` : ""}`).join(" · ") || "—"} · retrieval: {o.retrieval.n} (p50 {o.retrieval.p50 ?? "—"} ms, empty {o.retrieval.empty}) · feedback 👍 {o.feedback.up} 👎 {o.feedback.down} · email: {o.outbox.map((x) => `${x.status} ${x.n}`).join(", ") || "—"}</p>
      </section>
      <AdminConsole />
    </div>
  );
}
