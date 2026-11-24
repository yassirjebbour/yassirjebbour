import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { rankedForUser, savedOpportunities } from "@/server/repo/opportunities";
import { getProfile } from "@/server/repo/profile";
import { OpportunityList } from "@/components/app/opportunities";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("opps.title") }; }

export default async function Page({ searchParams }: { searchParams: Promise<{ city?: string; kind?: string }> }) {
  const user = await requireUser();
  const { t } = await getT();
  const sp = await searchParams;
  const [all, ranked, saved, profile] = await Promise.all([rankedForUser(user.id), rankedForUser(user.id, { city: sp.city, kind: sp.kind }), savedOpportunities(user.id), getProfile(user.id)]);
  const cities = [...new Set(all.map((r) => r.item.city).filter(Boolean))] as string[];
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{t("opps.title")}</h1><p>{t("opps.sub")}</p></div>
      <OpportunityList
        items={JSON.parse(JSON.stringify(ranked.map(({ item, fit }) => ({ ...item, fit }))))}
        saved={saved.map((s) => s.opportunity_id)} target={profile.target_opportunity_id}
        cities={cities.sort()} filter={{ city: sp.city ?? "", kind: sp.kind ?? "" }}
      />
    </div>
  );
}
