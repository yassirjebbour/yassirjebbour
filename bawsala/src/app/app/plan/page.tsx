import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { getActivePlan } from "@/server/repo/plans";
import { PlanView } from "@/components/app/plan";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("plan.title") }; }

export default async function Page() {
  const user = await requireUser();
  const { t } = await getT();
  const plan = await getActivePlan(user.id);
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{plan ? plan.title : t("plan.title")}</h1><p>{t("plan.sub")}</p></div>
      <PlanView plan={plan ? JSON.parse(JSON.stringify(plan)) : null} today={new Date().toISOString().slice(0, 10)} />
    </div>
  );
}
