"use client";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Field, useErrorMessage, useToast } from "../ui";

type Flag = { key: string; enabled: boolean; rollout: number; description: string };
type User = { id: string; name: string; email: string; role: string; institution: string | null; institution_id: string | null; created_at: string; last_active_at: string | null };
type Inst = { id: string; name: string; join_code: string; members: number };
type Doc = { slug: string; title: string; kind: string; language: string; verification_status: string; version: number; status: string; chunks: number };
type Opp = { id: string; title: Record<string, string>; organization: string; status: string; is_sample: boolean; verification_status: string };
type Fb = { id: string; kind: string; message: string; status: string; created_at: string; email: string | null };
type Audit = { id: number; action: string; target: string | null; created_at: string; actor: string | null };

export function AdminConsole() {
  const { t, pick, fmtDate } = useI18n();
  const toast = useToast();
  const err = useErrorMessage();
  const [tab, setTab] = useState<"flags" | "users" | "institutions" | "opportunities" | "knowledge" | "feedback" | "audit">("flags");
  const [loaded, setLoaded] = useState<{ key: string; data: unknown[] } | null>(null);
  const [reload, setReload] = useState(0);
  const path = { flags: "/admin/flags", users: "/admin/users", institutions: "/admin/institutions", opportunities: "/admin/opportunities", knowledge: "/admin/knowledge", feedback: "/admin/feedback", audit: "/admin/audit" }[tab];
  const key = `${path}#${reload}`;
  const data = loaded?.key === key ? loaded.data : null;
  useEffect(() => {
    let live = true;
    api<unknown[]>(path).then((d) => { if (live) setLoaded({ key, data: d }); }).catch((x) => toast(err(x)));
    return () => { live = false; };
  }, [path, key]); // eslint-disable-line react-hooks/exhaustive-deps
  const act = async (fn: () => Promise<unknown>) => { try { await fn(); toast(t("common.saved")); setReload((n) => n + 1); } catch (x) { toast(err(x)); } };

  return (
    <section className="panel stack">
      <div className="chips" role="tablist">
        {(["flags", "users", "institutions", "opportunities", "knowledge", "feedback", "audit"] as const).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} className="chip" onClick={() => setTab(k)}>{t(`admin.${k}`)}</button>
        ))}
      </div>
      {data === null ? <div className="skeleton" style={{ height: 120 }} /> : null}

      {tab === "flags" && data ? (
        <table className="md"><thead><tr><th>key</th><th>on</th><th>{t("admin.flag_rollout")}</th><th /></tr></thead><tbody>
          {(data as Flag[]).map((f) => <tr key={f.key}><td><code>{f.key}</code><br /><span className="small muted">{f.description}</span></td>
            <td><input type="checkbox" aria-label={f.key} checked={f.enabled} onChange={(e) => act(() => api("/admin/flags", { method: "PATCH", body: { key: f.key, enabled: e.target.checked } }))} /></td>
            <td><input type="number" className="input" style={{ width: 90 }} min={0} max={100} defaultValue={f.rollout} onBlur={(e) => Number(e.target.value) !== f.rollout && act(() => api("/admin/flags", { method: "PATCH", body: { key: f.key, rollout: Number(e.target.value) } }))} aria-label={`${f.key} rollout`} /></td><td /></tr>)}
        </tbody></table>
      ) : null}

      {tab === "users" && data ? (
        <table className="md"><thead><tr><th>{t("auth.name")}</th><th>{t("admin.role")}</th><th>{t("admin.institutions")}</th><th>{t("admin.last_active")}</th></tr></thead><tbody>
          {(data as User[]).map((u) => <tr key={u.id}><td>{u.name}<br /><span className="small muted" dir="ltr">{u.email}</span></td>
            <td><select className="select" style={{ minHeight: 34 }} defaultValue={u.role} onChange={(e) => act(() => api(`/admin/users/${u.id}`, { method: "PATCH", body: { role: e.target.value } }))} aria-label={`${u.email} role`}>
              <option value="student">student</option><option value="institution_admin">institution_admin</option><option value="platform_admin">platform_admin</option></select></td>
            <td>{u.institution ?? "—"}</td><td className="small">{u.last_active_at ? fmtDate(u.last_active_at) : "—"}</td></tr>)}
        </tbody></table>
      ) : null}

      {tab === "institutions" && data ? (
        <div className="stack">
          <form className="row" style={{ alignItems: "flex-end" }} onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); act(() => api("/admin/institutions", { body: { name: f.get("name"), city: f.get("city") || null } })); }}>
            <Field id="i-name" label={t("auth.name")}><input id="i-name" name="name" className="input" required /></Field>
            <Field id="i-city" label={t("onboarding.city")}><input id="i-city" name="city" className="input" /></Field>
            <Button type="submit">{t("admin.create_institution")}</Button>
          </form>
          <table className="md"><tbody>{(data as Inst[]).map((i) => <tr key={i.id}><td>{i.name}</td><td dir="ltr"><code>{i.join_code}</code></td><td className="num">{i.members}</td></tr>)}</tbody></table>
        </div>
      ) : null}

      {tab === "opportunities" && data ? (
        <div className="stack">
          <OpportunityForm onSaved={() => setReload((n) => n + 1)} />
          <table className="md"><tbody>{(data as Opp[]).map((o) => <tr key={o.id}><td>{pick(o.title)}</td><td>{o.organization}</td><td>{o.is_sample ? t("common.demo") : o.verification_status}</td><td>{o.status}</td></tr>)}</tbody></table>
        </div>
      ) : null}

      {tab === "knowledge" && data ? (
        <div className="stack">
          <KnowledgeForm onSaved={() => setReload((n) => n + 1)} />
          <table className="md"><thead><tr><th>slug</th><th>kind</th><th>lang</th><th>status</th><th>{t("admin.chunks")}</th><th /></tr></thead><tbody>
            {(data as Doc[]).map((d) => <tr key={d.slug}><td><code>{d.slug}</code> {t("admin.version", { n: d.version })}<br /><span className="small muted">{d.title}</span></td><td>{d.kind}</td><td>{d.language}</td><td>{d.verification_status}{d.status === "archived" ? " · archived" : ""}</td><td className="num">{d.chunks}</td>
              <td>{d.status === "active" ? <Button size="sm" variant="ghost" onClick={() => act(() => api(`/admin/knowledge/${d.slug}`, { method: "DELETE" }))}>{t("admin.archive")}</Button> : null}</td></tr>)}
          </tbody></table>
        </div>
      ) : null}

      {tab === "feedback" && data ? (
        <ul className="list">{(data as Fb[]).map((f) => <li key={f.id} className="stack-sm"><div className="row-between"><strong>{f.kind}</strong><span className="small muted">{fmtDate(f.created_at)} · {f.email ?? "anonymous"}</span></div><p style={{ whiteSpace: "pre-wrap" }}>{f.message}</p>
          <select className="select" style={{ width: 160, minHeight: 34 }} defaultValue={f.status} onChange={(e) => act(() => api("/admin/feedback", { method: "PATCH", body: { id: f.id, status: e.target.value } }))} aria-label="status"><option value="open">open</option><option value="in_progress">in_progress</option><option value="closed">closed</option></select></li>)}</ul>
      ) : null}

      {tab === "audit" && data ? (
        <table className="md"><tbody>{(data as Audit[]).map((a) => <tr key={a.id}><td className="small">{fmtDate(a.created_at)}</td><td><code>{a.action}</code></td><td className="small" dir="ltr">{a.actor ?? "system"}</td><td className="small" dir="ltr">{a.target ?? ""}</td></tr>)}</tbody></table>
      ) : null}
    </section>
  );
}

function OpportunityForm({ onSaved }: { onSaved: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const err = useErrorMessage();
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    const reqs = s("required").split(",").map((x) => x.trim()).filter(Boolean).map((skillId) => ({ skillId, required: true }));
    const nice = s("nice").split(",").map((x) => x.trim()).filter(Boolean).map((skillId) => ({ skillId, required: false }));
    setBusy(true);
    try {
      await api("/admin/opportunities", { body: {
        title: { fr: s("title_fr") || undefined, en: s("title_en") || undefined, ar: s("title_ar") || undefined }, organization: s("organization"), city: s("city") || null, remote: f.get("remote") === "on",
        kind: s("kind"), description: { fr: s("desc") || "—" }, apply_url: s("apply_url") || null, source_name: s("source_name"), source_url: s("source_url"),
        verification_status: s("verification"), status: s("status"), deadline: s("deadline") || null, requirements: [...reqs, ...nice],
      } });
      toast(t("common.saved")); e.currentTarget.reset(); onSaved();
    } catch (x) { toast(err(x)); } finally { setBusy(false); }
  }
  return (
    <details className="panel-flat"><summary style={{ cursor: "pointer", fontWeight: 600 }}>{t("admin.new_opportunity")}</summary>
      <form onSubmit={submit} className="stack" style={{ marginTop: 12 }}>
        <div className="grid-2">
          <Field id="o-tf" label="Titre (fr)"><input id="o-tf" name="title_fr" className="input" /></Field>
          <Field id="o-te" label="Title (en)"><input id="o-te" name="title_en" className="input" /></Field>
          <Field id="o-ta" label="العنوان (ar)"><input id="o-ta" name="title_ar" className="input" dir="rtl" /></Field>
          <Field id="o-org" label="Organisation"><input id="o-org" name="organization" className="input" required /></Field>
          <Field id="o-city" label={t("onboarding.city")}><input id="o-city" name="city" className="input" /></Field>
          <Field id="o-kind" label={t("opps.filter_kind")}><select id="o-kind" name="kind" className="select">{["job", "internship", "training", "volunteer", "program"].map((k) => <option key={k}>{k}</option>)}</select></Field>
          <Field id="o-src" label="Source (name)"><input id="o-src" name="source_name" className="input" required /></Field>
          <Field id="o-srcu" label="Source URL (required)"><input id="o-srcu" name="source_url" type="url" className="input" dir="ltr" required /></Field>
          <Field id="o-apply" label="Apply URL"><input id="o-apply" name="apply_url" type="url" className="input" dir="ltr" /></Field>
          <Field id="o-dl" label="Deadline"><input id="o-dl" name="deadline" type="date" className="input" /></Field>
          <Field id="o-ver" label={t("admin.verification")}><select id="o-ver" name="verification" className="select"><option value="unverified">unverified</option><option value="verified">verified (checked at source today)</option></select></Field>
          <Field id="o-st" label={t("admin.status")}><select id="o-st" name="status" className="select"><option value="draft">draft</option><option value="published">published</option></select></Field>
          <Field id="o-req" label="Required skill ids (comma)"><input id="o-req" name="required" className="input" dir="ltr" placeholder="sales,excel" /></Field>
          <Field id="o-nice" label="Nice-to-have skill ids"><input id="o-nice" name="nice" className="input" dir="ltr" /></Field>
        </div>
        <Field id="o-desc" label="Description (fr)"><textarea id="o-desc" name="desc" className="textarea" /></Field>
        <label className="check"><input type="checkbox" name="remote" /><span>Remote</span></label>
        <div><Button type="submit" loading={busy}>{t("admin.save")}</Button></div>
      </form>
    </details>
  );
}

function KnowledgeForm({ onSaved }: { onSaved: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const err = useErrorMessage();
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true);
    try {
      const r = await api<{ changed: boolean; chunks: number }>("/admin/knowledge", { body: {
        slug: s("slug"), title: s("title"), kind: s("kind"), language: s("language"), geography: s("geography") || "MA", source_name: s("source_name"), source_url: s("source_url") || null,
        verification_status: s("verification_status"), verified_at: s("verified_at") || null, published_at: s("published_at") || null, confidence: "medium", body: s("body"),
      } });
      toast(`${r.changed ? "✓" : "="} ${r.chunks} ${t("admin.chunks")}`); onSaved();
    } catch (x) { toast(err(x)); } finally { setBusy(false); }
  }
  return (
    <details className="panel-flat"><summary style={{ cursor: "pointer", fontWeight: 600 }}>{t("admin.ingest")}</summary>
      <form onSubmit={submit} className="stack" style={{ marginTop: 12 }}>
        <div className="grid-2">
          <Field id="k-slug" label="slug"><input id="k-slug" name="slug" className="input" dir="ltr" required pattern="[a-z0-9][a-z0-9\-]{1,120}" /></Field>
          <Field id="k-title" label="title"><input id="k-title" name="title" className="input" required /></Field>
          <Field id="k-kind" label="kind"><select id="k-kind" name="kind" className="select">{["guide", "institution", "program", "labor_market", "resource", "occupation", "pathway", "skill", "policy"].map((k) => <option key={k}>{k}</option>)}</select></Field>
          <Field id="k-lang" label="language"><select id="k-lang" name="language" className="select">{["fr", "ar", "ary", "en", "zgh", "multi"].map((k) => <option key={k}>{k}</option>)}</select></Field>
          <Field id="k-src" label="source_name"><input id="k-src" name="source_name" className="input" required /></Field>
          <Field id="k-srcu" label="source_url"><input id="k-srcu" name="source_url" type="url" className="input" dir="ltr" /></Field>
          <Field id="k-ver" label="verification_status"><select id="k-ver" name="verification_status" className="select"><option>unverified</option><option>editorial</option><option>verified</option></select></Field>
          <Field id="k-va" label="verified_at"><input id="k-va" name="verified_at" type="date" className="input" /></Field>
        </div>
        <Field id="k-body" label="Markdown"><textarea id="k-body" name="body" className="textarea" style={{ minHeight: 200 }} required /></Field>
        <div><Button type="submit" loading={busy}>{t("admin.save")}</Button></div>
      </form>
    </details>
  );
}
