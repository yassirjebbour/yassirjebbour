"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Empty, Field, Modal, StateBadge, useErrorMessage, useToast } from "../ui";
import { SuggestionList, type SuggestionItem } from "./suggestions";
import { SKILL_NAMES } from "@/lib/skill-names";
import { IconPassport, IconLink, IconPlus } from "../icons";

type Evidence = { id: string; kind: string; text: string | null; url: string | null; created_at: string };
type Skill = { id: string; skill_id: string; status: "declared" | "inferred" | "evidenced" | "verified"; evidence: Evidence[]; created_at: string };

export function PassportView({ skills, suggestions, catalog, verifications, hasInstitution }: { skills: Skill[]; suggestions: SuggestionItem[]; catalog: Array<{ id: string; category: string }>; verifications: Record<string, string>; hasInstitution: boolean }) {
  const { t, pick, fmtDate } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [evFor, setEvFor] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const name = (id: string) => pick(SKILL_NAMES[id]) || id;
  const owned = new Set(skills.map((s) => s.skill_id));
  const categories = [...new Set(catalog.map((c) => c.category))];
  const catOf = (id: string) => catalog.find((c) => c.id === id)?.category ?? "other";

  async function addEvidence(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await api(`/skills/${evFor}/evidence`, { body: { url: String(f.get("url") || "") || null, text: String(f.get("text") || "") || null, kind: f.get("url") ? "link" : "project" } });
      toast(t("passport.evidence_added")); setEvFor(null); router.refresh();
    } catch (x) { toast(err(x)); } finally { setBusy(false); }
  }
  async function declare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = String(new FormData(e.currentTarget).get("skill") ?? "");
    if (!id) return;
    setBusy(true);
    try { await api("/skills", { body: { skillId: id } }); setAdding(false); router.refresh(); } catch (x) { toast(err(x)); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm(t("passport.remove_confirm"))) return;
    try { await api(`/skills/${id}`, { method: "DELETE" }); router.refresh(); } catch (x) { toast(err(x)); }
  }
  async function requestVerify(id: string) {
    try { await api(`/skills/${id}/verify-request`, { body: {} }); toast(t("passport.verify_requested")); router.refresh(); } catch (x) { toast(err(x)); }
  }

  return (
    <div className="stack-lg">
      {suggestions.length ? (
        <section className="panel stack" aria-labelledby="sugg-h">
          <h2 id="sugg-h">{t("passport.suggestions_title", { n: suggestions.length })}</h2>
          <p className="muted small">{t("passport.suggestions_sub")}</p>
          <SuggestionList items={suggestions} onChange={() => router.refresh()} />
        </section>
      ) : null}

      <div className="row-between no-print">
        <Button variant="secondary" onClick={() => setAdding(true)}><IconPlus width={18} height={18} />{t("passport.add_skill")}</Button>
        <div className="row">
          <Link className="btn btn-ghost btn-sm" href="/app/passport/print">{t("passport.print")}</Link>
          <a className="btn btn-ghost btn-sm" href="/api/v1/me/export">{t("passport.export_json")}</a>
        </div>
      </div>

      {skills.length === 0 ? (
        <Empty icon={<IconPassport />} action={<Link className="btn btn-primary" href="/app/profile#experiences">{t("profile.add_experience")}</Link>}>{t("passport.empty")}</Empty>
      ) : (
        categories.filter((c) => skills.some((s) => catOf(s.skill_id) === c)).map((c) => (
          <section key={c} className="panel" aria-labelledby={`cat-${c}`}>
            <h2 id={`cat-${c}`}>{t(`passport.category.${c}` as never)}</h2>
            <ul className="list">
              {skills.filter((s) => catOf(s.skill_id) === c).map((s) => (
                <li key={s.id} className="skill-row">
                  <div className="row-between">
                    <strong>{name(s.skill_id)}</strong>
                    <StateBadge status={s.status} />
                  </div>
                  {s.evidence.length ? (
                    <ul className="stack-sm" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {s.evidence.map((e) => (
                        <li key={e.id} className="quote">
                          {e.text}{e.url ? <> {e.text ? "— " : ""}<a href={e.url} target="_blank" rel="noopener noreferrer nofollow"><IconLink width={14} height={14} /> {new URL(e.url).hostname}</a></> : null}
                          <span className="muted small"> · {fmtDate(e.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="small muted">{t("passport.evidence_count", { n: 0 })}</p>}
                  <div className="row no-print">
                    <Button size="sm" variant="secondary" onClick={() => setEvFor(s.skill_id)}>{t("passport.add_evidence")}</Button>
                    {s.status !== "verified" ? (
                      verifications[s.id] === "pending" ? <span className="small muted">{t("passport.verify_requested")}</span>
                        : hasInstitution ? <Button size="sm" variant="ghost" onClick={() => requestVerify(s.skill_id)}>{t("passport.request_verify")}</Button> : null
                    ) : null}
                    <Button size="sm" variant="ghost" onClick={() => remove(s.skill_id)}>{t("common.remove")}</Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
      {!hasInstitution && skills.length ? <p className="small muted">{t("passport.verify_need_institution")}</p> : null}

      <Modal open={!!evFor} onClose={() => setEvFor(null)} title={`${t("passport.add_evidence")} — ${evFor ? name(evFor) : ""}`}>
        <form onSubmit={addEvidence} className="stack">
          <Field id="ev-url" label={t("passport.evidence_link")}><input id="ev-url" name="url" type="url" className="input" dir="ltr" placeholder="https://" /></Field>
          <Field id="ev-text" label={t("passport.evidence_text")}><textarea id="ev-text" name="text" className="textarea" maxLength={2000} /></Field>
          <div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setEvFor(null)}>{t("common.cancel")}</Button><Button type="submit" loading={busy}>{t("common.save")}</Button></div>
        </form>
      </Modal>
      <Modal open={adding} onClose={() => setAdding(false)} title={t("passport.add_skill")}>
        <form onSubmit={declare} className="stack">
          <Field id="skill" label={t("passport.add_skill_ph")}>
            <select id="skill" name="skill" className="select" required defaultValue="">
              <option value="" disabled>—</option>
              {catalog.filter((c) => !owned.has(c.id)).map((c) => <option key={c.id} value={c.id}>{name(c.id)}</option>)}
            </select>
          </Field>
          <div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setAdding(false)}>{t("common.cancel")}</Button><Button type="submit" loading={busy}>{t("common.add")}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
