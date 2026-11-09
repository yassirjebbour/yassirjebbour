import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { getPassport, pendingSuggestions, skillCatalog } from "@/server/repo/skills";
import { asUser } from "@/server/db";
import { PassportView } from "@/components/app/passport";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("passport.title") }; }

export default async function Page() {
  const user = await requireUser();
  const { t } = await getT();
  const [skills, suggestions, catalog, vr] = await Promise.all([
    getPassport(user.id), pendingSuggestions(user.id), skillCatalog(),
    asUser(user.id, (tx) => tx.query<{ user_skill_id: string; status: string }>(`SELECT user_skill_id, status FROM verification_requests WHERE user_id = $1`, [user.id])),
  ]);
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{t("passport.title")}</h1><p>{t("passport.sub")}</p></div>
      <PassportView
        skills={JSON.parse(JSON.stringify(skills))}
        suggestions={JSON.parse(JSON.stringify(suggestions))}
        catalog={catalog.map((c) => ({ id: c.id, category: c.category }))}
        verifications={Object.fromEntries(vr.map((v) => [v.user_skill_id, v.status]))}
        hasInstitution={!!user.institutionId}
      />
    </div>
  );
}
