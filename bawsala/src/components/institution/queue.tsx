"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Empty, useErrorMessage, useToast } from "../ui";
import { IconCheck, IconLink, IconShield } from "../icons";

type Item = { id: string; student: string; skill: string; note: string | null; created_at: string; evidence: Array<{ text: string | null; url: string | null }> };

function host(u: string) { try { return new URL(u).hostname; } catch { return u; } }

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
  if (!items.length) return <Empty icon={<IconShield />}>{t("institution.verify_empty")}</Empty>;
  return (
    <ul className="vq-list">
      {items.map((i, k) => {
        const initial = Array.from(i.student.trim())[0]?.toLocaleUpperCase() ?? "•";
        const proofs = i.evidence.filter((e) => e.text || e.url);
        return (
          <li key={i.id} className="vq-card" style={{ "--i": k } as React.CSSProperties}>
            <div className="vq-head">
              <span className="vq-avatar" aria-hidden="true">{initial}</span>
              <span className="vq-who"><strong className="bidi">{i.student}</strong><span className="small muted">{t("flow.inst.requested", { date: fmtDate(i.created_at) })}</span></span>
              <span className="badge b-evidenced bidi">{i.skill}</span>
            </div>
            {i.note ? <p className="small bidi">{i.note}</p> : null}
            <div className="vq-proof">
              <p className="small"><strong>{proofs.length ? t("flow.inst.proof") : t("flow.inst.no_proof")}</strong></p>
              {proofs.map((e, n) => (
                <p key={n} className="quote small">
                  {e.text ? <span className="bidi">{e.text}</span> : null}
                  {e.url ? <> {e.text ? "· " : ""}<a href={e.url} target="_blank" rel="noopener noreferrer nofollow"><IconLink width={13} height={13} aria-hidden="true" /> {host(e.url)}</a></> : null}
                </p>
              ))}
            </div>
            <div className="row">
              <Button size="sm" onClick={() => decide(i.id, "approved")} loading={busy === i.id}><IconCheck width={16} height={16} />{t("institution.approve")}</Button>
              <Button size="sm" variant="ghost" onClick={() => decide(i.id, "rejected")} disabled={busy === i.id}>{t("institution.reject")}</Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
