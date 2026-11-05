"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, DataBadge, Empty, Meter, useErrorMessage, useToast } from "../ui";
import { SKILL_NAMES } from "@/lib/skill-names";
import { IconCompass } from "../icons";
import type { Localized } from "@/i18n/config";

type Fit = { score: number; requiredHave: number; requiredTotal: number; missingRequired: string[] };
type Opp = { id: string; title: Localized; organization: string; city: string | null; kind: string; is_sample: boolean; verification_status: string; source_name: string; source_updated_at: string; deadline: string | null; fit: Fit };

export function OpportunityList({ items, saved, target, cities, filter }: { items: Opp[]; saved: string[]; target: string | null; cities: string[]; filter: { city: string; kind: string } }) {
  const { t, pick, fmtDate } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [savedSet, setSaved] = useState(new Set(saved));
  function setFilter(k: "city" | "kind", v: string) {
    const sp = new URLSearchParams({ ...filter, [k]: v });
    [...sp.keys()].forEach((key) => !sp.get(key) && sp.delete(key));
    router.push(`/app/opportunities${sp.toString() ? `?${sp}` : ""}`);
  }
  async function toggleSave(id: string) {
    const on = savedSet.has(id);
    try { await api(`/opportunities/${id}/save`, { method: on ? "DELETE" : "POST", body: on ? undefined : {} }); const s = new Set(savedSet); if (on) s.delete(id); else s.add(id); setSaved(s); }
    catch (x) { toast(err(x)); }
  }
  const hasDemo = items.some((i) => i.is_sample);
  return (
    <div className="stack">
      <div className="row">
        <label className="row" style={{ gap: 6 }}><span className="label">{t("opps.filter_city")}</span>
          <select className="select" style={{ width: "auto" }} value={filter.city} onChange={(e) => setFilter("city", e.target.value)}><option value="">{t("opps.all")}</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label className="row" style={{ gap: 6 }}><span className="label">{t("opps.filter_kind")}</span>
          <select className="select" style={{ width: "auto" }} value={filter.kind} onChange={(e) => setFilter("kind", e.target.value)}><option value="">{t("opps.all")}</option>{(["job", "internship", "training", "volunteer", "program"] as const).map((k) => <option key={k} value={k}>{t(`kinds.${k}`)}</option>)}</select></label>
      </div>
      {hasDemo ? <p className="alert alert-warn" role="note">{t("opps.demo_banner")}</p> : null}
      {items.length === 0 ? <Empty icon={<IconCompass />}>{t("opps.none")}</Empty> : (
        <div className="stack-sm">
          {items.map((o) => (
            <article key={o.id} className="opp">
              <div className="row-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                  <span className="logo-tile" aria-hidden="true">{o.organization.slice(0, 2).toUpperCase()}</span>
                  <div className="stack-sm" style={{ gap: 2 }}>
                    <Link className="opp-title" href={`/app/opportunities/${o.id}`}>{pick(o.title)}</Link>
                    <span className="small muted">{o.organization}{o.city ? ` · ${o.city}` : ""} · {t(`kinds.${o.kind}` as never)}</span>
                  </div>
                </div>
                <div className="row" style={{ flexWrap: "nowrap" }}>
                  {o.id === target ? <span className="badge b-inferred">{t("opps.is_target")}</span> : null}
                  <DataBadge status={o.is_sample ? "demo" : (o.verification_status as "verified" | "unverified")} />
                </div>
              </div>
              <div className="fit"><Meter value={o.fit.requiredHave} max={Math.max(1, o.fit.requiredTotal)} label={t("opps.fit", { have: o.fit.requiredHave, total: o.fit.requiredTotal })} /><span>{t("opps.fit", { have: o.fit.requiredHave, total: o.fit.requiredTotal })}</span></div>
              {o.fit.missingRequired.length ? <p className="small"><span className="muted">{t("opps.missing")}: </span>{o.fit.missingRequired.map((s) => pick(SKILL_NAMES[s]) || s).join(" · ")}</p> : null}
              <div className="row-between">
                <span className="small muted">{t("common.source")}: {o.source_name} · {t("common.updated", { date: fmtDate(o.source_updated_at) })}{o.deadline ? ` · ${t("opps.deadline", { date: fmtDate(o.deadline) })}` : ""}</span>
                <Button size="sm" variant={savedSet.has(o.id) ? "secondary" : "ghost"} aria-pressed={savedSet.has(o.id)} onClick={() => toggleSave(o.id)}>{savedSet.has(o.id) ? t("opps.saved") : t("opps.save")}</Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
