"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Empty, Field, Meter, Modal, useErrorMessage, useToast } from "../ui";
import { IconCheck, IconPath, IconExternal } from "../icons";

type Task = { id: string; position: number; kind: "learn" | "practice" | "prove" | "project" | "apply"; title: string; detail: string | null; resource_url: string | null; estimated_minutes: number | null; due_on: string; completed_at: string | null; proof_url: string | null; proof_note: string | null; skill_id: string | null };
type Plan = { id: string; title: string; starts_on: string; ends_on: string; tasks: Task[] };

export function PlanView({ plan, today }: { plan: Plan | null; today: string }) {
  const { t, fmtDate } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [proofFor, setProofFor] = useState<Task | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  if (!plan) return <Empty icon={<IconPath />} action={<Link className="btn btn-primary" href="/app/opportunities">{t("plan.choose_role")}</Link>}>{t("plan.empty")}</Empty>;
  const done = plan.tasks.filter((x) => x.completed_at).length;
  const startMs = new Date(plan.starts_on).getTime();
  const weekOf = (d: string) => Math.floor((new Date(d).getTime() - startMs) / (7 * 864e5)) + 1;
  const weeks = [...new Set(plan.tasks.map((x) => weekOf(x.due_on)))];

  async function complete(task: Task, proof?: { url?: string; note?: string }) {
    setBusy(task.id);
    try {
      const r = await api<{ evidenced: boolean }>(`/plan/tasks/${task.id}/complete`, { body: { url: proof?.url || null, note: proof?.note || null } });
      if (r.evidenced) toast(t("passport.evidence_added"));
      setProofFor(null); router.refresh();
    } catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  async function reopen(task: Task) {
    setBusy(task.id);
    try { await api(`/plan/tasks/${task.id}/reopen`, { body: {} }); router.refresh(); } catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  async function archive() {
    if (!confirm(t("plan.archive_confirm"))) return;
    try { await api("/plan", { method: "DELETE" }); router.refresh(); } catch (x) { toast(err(x)); }
  }
  return (
    <div className="stack-lg">
      <div className="panel stack-sm">
        <div className="row-between"><strong>{t("plan.progress", { done, total: plan.tasks.length })}</strong><span className="small muted">{fmtDate(plan.starts_on)} → {fmtDate(plan.ends_on)}</span></div>
        <Meter value={done} max={plan.tasks.length} label={t("plan.progress", { done, total: plan.tasks.length })} />
        {done === plan.tasks.length ? <p className="alert alert-ok">{t("plan.completed")}</p> : null}
      </div>
      {weeks.map((w) => (
        <section key={w} className="panel" aria-labelledby={`w${w}`}>
          <h2 id={`w${w}`}>{t("plan.week", { n: w })}</h2>
          <ul className="list" style={{ marginTop: 8 }}>
            {plan.tasks.filter((x) => weekOf(x.due_on) === w).map((task) => {
              const isDone = !!task.completed_at;
              const overdue = !isDone && task.due_on < today;
              return (
                <li key={task.id} className={`task ${isDone ? "done" : ""}`}>
                  <button type="button" className="task-check" aria-pressed={isDone} disabled={busy === task.id}
                    aria-label={`${isDone ? t("plan.reopen") : t("plan.mark_done")}: ${task.title}`}
                    onClick={() => (isDone ? reopen(task) : task.kind === "prove" || task.kind === "project" ? setProofFor(task) : complete(task))}>
                    {isDone ? <IconCheck /> : null}
                  </button>
                  <div className="stack-sm" style={{ gap: 4 }}>
                    <div className="row" style={{ gap: 8 }}><span className="kind">{t(`plan.kind.${task.kind}`)}</span><span className={`small ${overdue ? "" : "muted"}`} style={overdue ? { color: "var(--err)" } : undefined}>{overdue ? t("plan.overdue") : t("plan.due", { date: fmtDate(task.due_on) })}</span>{task.estimated_minutes ? <span className="small muted">{t("plan.min", { n: task.estimated_minutes })}</span> : null}</div>
                    <span className="task-title" style={{ fontWeight: 600 }}>{task.title}</span>
                    {task.detail ? <span className="small muted">{task.detail}</span> : null}
                    {task.resource_url ? <a className="small" href={task.resource_url} target="_blank" rel="noopener noreferrer">{t("plan.resource")} <IconExternal width={13} height={13} /></a> : null}
                    {task.proof_url || task.proof_note ? <span className="quote small">{task.proof_note}{task.proof_url ? ` — ${task.proof_url}` : ""}</span> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <div><Button variant="danger" size="sm" onClick={archive}>{t("plan.archive")}</Button></div>
      <Modal open={!!proofFor} onClose={() => setProofFor(null)} title={t("plan.proof_title")}>
        {proofFor ? (
          <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); complete(proofFor, { url: String(f.get("url") || ""), note: String(f.get("note") || "") }); }}>
            <p className="small muted">{proofFor.detail}</p>
            <Field id="p-url" label={t("plan.proof_url")}><input id="p-url" name="url" type="url" className="input" dir="ltr" placeholder="https://" /></Field>
            <Field id="p-note" label={t("plan.proof_note")} hint={t("plan.proof_hint")}><textarea id="p-note" name="note" className="textarea" maxLength={2000} /></Field>
            <div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setProofFor(null)}>{t("common.cancel")}</Button><Button type="submit" loading={busy === proofFor.id}>{t("plan.mark_done")}</Button></div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
