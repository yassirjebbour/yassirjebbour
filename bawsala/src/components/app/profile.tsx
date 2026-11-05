"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Empty, Field, Modal, useErrorMessage, useToast } from "../ui";
import { IconFile, IconPlus } from "../icons";

type Profile = { situation: string | null; field_of_study: string | null; education_level: string | null; school: string | null; graduation_year: number | null; city: string | null; languages: string[]; goal: string | null; share_with_institution: boolean };
type Exp = { id: string; kind: string; title: string; organization: string | null; description: string; started_on: string | null; ended_on: string | null; analyzed_at: string | null };
type FileRow = { id: string; filename: string; created_at: string; extract_error: string | null; purpose: string };
const KINDS = ["job", "internship", "family", "club", "volunteer", "project", "education", "course", "other"] as const;
const LANGS = ["ar", "fr", "en", "zgh", "es", "de"] as const;

export function ProfileView({ profile, experiences, files, hasInstitution }: { profile: Profile; experiences: Exp[]; files: FileRow[]; hasInstitution: boolean }) {
  const { t, fmtDate } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [p, setP] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState<Partial<Exp> | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await api("/profile", { method: "PATCH", body: { situation: p.situation, field_of_study: p.field_of_study || null, education_level: p.education_level, school: p.school || null, city: p.city || null, languages: p.languages, goal: p.goal || null, share_with_institution: p.share_with_institution } }); toast(t("profile.saved")); router.refresh(); }
    catch (x) { toast(err(x)); } finally { setSaving(false); }
  }
  async function saveExp(e: React.FormEvent) {
    e.preventDefault(); if (!edit) return; setBusy("save");
    const body = { kind: edit.kind ?? "other", title: edit.title ?? "", organization: edit.organization || null, description: edit.description ?? "", started_on: edit.started_on || null, ended_on: edit.ended_on || null };
    try {
      const saved = edit.id ? await api<Exp>(`/experiences/${edit.id}`, { method: "PATCH", body }) : await api<Exp>("/experiences", { body });
      setEdit(null);
      const r = await api<{ created: number }>(`/experiences/${saved.id}/analyze`, { body: {} });
      if (r.created) toast(t("assistant.suggestions_saved", { n: r.created }));
      router.refresh();
    } catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  async function analyze(id: string) {
    setBusy(id);
    try { const r = await api<{ created: number }>(`/experiences/${id}/analyze`, { body: {} }); toast(r.created ? t("assistant.suggestions_saved", { n: r.created }) : t("chat.skills.none")); router.refresh(); }
    catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  async function remove(id: string) {
    if (!confirm(t("profile.delete_confirm"))) return;
    try { await api(`/experiences/${id}`, { method: "DELETE" }); router.refresh(); } catch (x) { toast(err(x)); }
  }
  async function upload(f: File) {
    const fd = new FormData(); fd.append("file", f); fd.append("purpose", "cv");
    setBusy("upload");
    try { const r = await api<{ extract_error: string | null }>("/files", { body: fd }); if (r.extract_error) toast(t("profile.cv_error")); router.refresh(); }
    catch (x) { toast(err(x)); } finally { setBusy(null); if (fileRef.current) fileRef.current.value = ""; }
  }
  async function deleteFile(id: string) {
    try { await api(`/files/${id}`, { method: "DELETE" }); router.refresh(); } catch (x) { toast(err(x)); }
  }

  return (
    <div className="stack-lg">
      <form className="panel stack" onSubmit={saveProfile} aria-labelledby="about-h">
        <h2 id="about-h">{t("profile.about")}</h2>
        <div className="grid-2">
          <Field id="sit" label={t("onboarding.situation")}>
            <select id="sit" className="select" value={p.situation ?? ""} onChange={(e) => setP({ ...p, situation: e.target.value || null })}>
              <option value="">—</option>
              {(["student", "graduate", "job_seeker", "employed", "other"] as const).map((s) => <option key={s} value={s}>{t(`onboarding.sit_${s}`)}</option>)}
            </select>
          </Field>
          <Field id="lvl" label={t("onboarding.level")}>
            <select id="lvl" className="select" value={p.education_level ?? ""} onChange={(e) => setP({ ...p, education_level: e.target.value || null })}>
              <option value="">—</option>
              {(["bac", "bac2", "licence", "master", "doctorate", "vocational", "other"] as const).map((l) => <option key={l} value={l}>{t(`onboarding.lvl_${l}`)}</option>)}
            </select>
          </Field>
          <Field id="fos" label={t("onboarding.field")}><input id="fos" className="input" value={p.field_of_study ?? ""} onChange={(e) => setP({ ...p, field_of_study: e.target.value })} maxLength={160} /></Field>
          <Field id="sch" label={t("onboarding.school")}><input id="sch" className="input" value={p.school ?? ""} onChange={(e) => setP({ ...p, school: e.target.value })} maxLength={200} /></Field>
          <Field id="cty" label={t("onboarding.city")}><input id="cty" className="input" value={p.city ?? ""} onChange={(e) => setP({ ...p, city: e.target.value })} maxLength={120} /></Field>
        </div>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="label">{t("onboarding.languages")}</legend>
          <div className="chips" style={{ marginTop: 6 }}>
            {LANGS.map((l) => { const on = p.languages.includes(l); return <button key={l} type="button" className="chip" aria-pressed={on} onClick={() => setP({ ...p, languages: on ? p.languages.filter((x) => x !== l) : [...p.languages, l] })}>{t(`languages.${l}`)}</button>; })}
          </div>
        </fieldset>
        <Field id="goal" label={t("profile.goal")}><textarea id="goal" className="textarea" style={{ minHeight: 80 }} value={p.goal ?? ""} onChange={(e) => setP({ ...p, goal: e.target.value })} maxLength={600} /></Field>
        {hasInstitution ? (
          <label className="check"><input type="checkbox" checked={p.share_with_institution} onChange={(e) => setP({ ...p, share_with_institution: e.target.checked })} /><span><strong>{t("profile.share_title")}</strong><br /><span className="small muted">{t("profile.share_d")}</span></span></label>
        ) : null}
        <div><Button type="submit" loading={saving}>{t("common.save")}</Button></div>
      </form>

      <section className="panel stack" id="experiences" aria-labelledby="exp-h">
        <div className="row-between"><div><h2 id="exp-h">{t("profile.experiences")}</h2><p className="small muted">{t("profile.experiences_sub")}</p></div>
          <Button variant="secondary" onClick={() => setEdit({ kind: "job", title: "", description: "" })}><IconPlus width={18} height={18} />{t("profile.add_experience")}</Button></div>
        {experiences.length === 0 ? <Empty>{t("profile.no_experiences")}</Empty> : (
          <ul className="list">
            {experiences.map((e) => (
              <li key={e.id} className="stack-sm">
                <div className="row-between"><strong>{e.title}</strong><span className="badge badge-plain b-unverified">{t(`kinds.${e.kind}` as never)}</span></div>
                {e.organization ? <span className="small muted">{e.organization}</span> : null}
                <p className="small" style={{ whiteSpace: "pre-wrap" }}>{e.description}</p>
                <div className="row">
                  <Button size="sm" variant="secondary" onClick={() => analyze(e.id)} loading={busy === e.id}>{t("profile.analyze")}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEdit(e)}>{t("common.edit")}</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(e.id)}>{t("common.delete")}</Button>
                  {e.analyzed_at ? <span className="small muted">{t("profile.analyzed")} · {fmtDate(e.analyzed_at)}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel stack" aria-labelledby="cv-h">
        <h2 id="cv-h">{t("profile.cv_title")}</h2>
        <p className="small muted">{t("profile.cv_sub")}</p>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="sr-only" id="cv-file" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <div><Button variant="secondary" loading={busy === "upload"} onClick={() => fileRef.current?.click()}><IconFile width={18} height={18} />{t("profile.cv_upload")}</Button></div>
        {files.filter((f) => f.purpose === "cv").length ? (
          <ul className="list">
            {files.filter((f) => f.purpose === "cv").map((f) => (
              <li key={f.id} className="row-between">
                <span className="stack-sm" style={{ gap: 0 }}><a href={`/api/v1/files/${f.id}`}>{f.filename}</a><span className="small muted">{t("profile.cv_uploaded", { date: fmtDate(f.created_at) })}{f.extract_error ? ` · ${t("profile.cv_error")}` : ""}</span></span>
                <span className="row">
                  {!f.extract_error ? <Link className="btn btn-secondary btn-sm" href={`/app/assistant?q=${encodeURIComponent(t("assistant.prompts.cv"))}&file=${f.id}`}>{t("profile.cv_analyze")}</Link> : null}
                  <Button size="sm" variant="ghost" onClick={() => deleteFile(f.id)}>{t("common.delete")}</Button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? t("profile.edit_experience") : t("profile.add_experience")}>
        {edit ? (
          <form onSubmit={saveExp} className="stack">
            <Field id="e-kind" label={t("onboarding.s3_kind")}>
              <select id="e-kind" className="select" value={edit.kind} onChange={(e) => setEdit({ ...edit, kind: e.target.value })}>{KINDS.map((k) => <option key={k} value={k}>{t(`kinds.${k}`)}</option>)}</select>
            </Field>
            <Field id="e-title" label={t("onboarding.s3_titlefield")}><input id="e-title" className="input" required value={edit.title ?? ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} maxLength={200} /></Field>
            <Field id="e-org" label={<>{t("profile.organization")} <span className="muted">({t("common.optional")})</span></>}><input id="e-org" className="input" value={edit.organization ?? ""} onChange={(e) => setEdit({ ...edit, organization: e.target.value })} maxLength={200} /></Field>
            <Field id="e-desc" label={t("onboarding.s3_desc")} hint={t("onboarding.s3_desc_ph")}><textarea id="e-desc" className="textarea" required minLength={10} value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} maxLength={4000} /></Field>
            <div className="grid-2">
              <Field id="e-start" label={t("profile.started")}><input id="e-start" type="month" className="input" value={(edit.started_on ?? "").slice(0, 7)} onChange={(e) => setEdit({ ...edit, started_on: e.target.value })} /></Field>
              <Field id="e-end" label={t("profile.ended")}><input id="e-end" type="month" className="input" value={(edit.ended_on ?? "").slice(0, 7)} onChange={(e) => setEdit({ ...edit, ended_on: e.target.value })} /></Field>
            </div>
            <div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setEdit(null)}>{t("common.cancel")}</Button><Button type="submit" loading={busy === "save"}>{t("common.save")}</Button></div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
