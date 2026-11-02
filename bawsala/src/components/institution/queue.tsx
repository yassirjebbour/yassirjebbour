"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Empty, useErrorMessage, useToast } from "../ui";

type Item = { id: string; student: string; skill: string; note: string | null; created_at: string; evidence: Array<{ text: string | null; url: string | null }> };

export function VerificationQueue({ items }: { items: Item[] }) {
  const { t, fmtDate } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [busy, setBusy] = useState<string | null>(null);
  async function decide(id: string, decision: "approved" | "rejected") {
    const note = decision === "rejected" ? prompt(t("institution.review_note")) ?? undefined : undefined;
    setBusy(id);
    try { await api(`/institution/verifications/${id}`, { body: { decision, note } }); router.refresh(); } catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  if (!items.length) return <Empty>{t("institution.verify_empty")}</Empty>;
  return (
    <ul className="list">
      {items.map((i) => (
        <li key={i.id} className="stack-sm">
          <div className="row-between"><strong>{i.student} — {i.skill}</strong><span className="small muted">{fmtDate(i.created_at)}</span></div>
          {i.note ? <p className="small">{i.note}</p> : null}
          {i.evidence.map((e, k) => <p key={k} className="quote small">{e.text}{e.url ? <> — <a href={e.url} target="_blank" rel="noopener noreferrer nofollow">{e.url}</a></> : null}</p>)}
          <div className="row"><Button size="sm" onClick={() => decide(i.id, "approved")} loading={busy === i.id}>{t("institution.approve")}</Button><Button size="sm" variant="ghost" onClick={() => decide(i.id, "rejected")} disabled={busy === i.id}>{t("institution.reject")}</Button></div>
        </li>
      ))}
    </ul>
  );
}
