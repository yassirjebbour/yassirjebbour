"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api, track } from "@/lib/api";
import { Button, useErrorMessage, useToast } from "../ui";
import { IconExternal } from "../icons";

export function OpportunityActions({ id, isTarget, hasPlanForIt, applyUrl }: { id: string; isTarget: boolean; hasPlanForIt: boolean; applyUrl: string | null }) {
  const { t } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [busy, setBusy] = useState<string | null>(null);
  async function run(kind: "target" | "plan") {
    setBusy(kind);
    try {
      if (kind === "target") await api(`/opportunities/${id}/target`, { body: {} });
      else { await api("/plan", { body: { opportunityId: id, days: 30 } }); toast(t("opps.plan_created")); router.push("/app/plan"); }
      router.refresh();
    } catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  return (
    <div className="stack-sm">
      {isTarget ? <span className="badge b-inferred">{t("opps.is_target")}</span> : <Button variant="secondary" onClick={() => run("target")} loading={busy === "target"}>{t("opps.set_target")}</Button>}
      {hasPlanForIt ? <Link className="btn btn-secondary" href="/app/plan">{t("nav.plan")}</Link> : <Button onClick={() => run("plan")} loading={busy === "plan"}>{t("opps.make_plan")}</Button>}
      {applyUrl ? <a className="btn btn-ghost" href={applyUrl} target="_blank" rel="noopener noreferrer nofollow" onClick={() => track("opportunity.apply_clicked")}>{t("opps.apply")} <IconExternal width={16} height={16} /></a> : null}
    </div>
  );
}
