import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { getProfile } from "@/server/repo/profile";
import { listExperiences } from "@/server/repo/experiences";
import { listFiles } from "@/server/repo/files";
import { ProfileView } from "@/components/app/profile";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("profile.title") }; }

export default async function Page() {
  const user = await requireUser();
  const { t } = await getT();
  const [profile, exps, files] = await Promise.all([getProfile(user.id), listExperiences(user.id), listFiles(user.id)]);
  return (
    <div className="stack-lg">
      <div className="page-head"><h1>{t("profile.title")}</h1><p>{t("profile.sub")}</p></div>
      <ProfileView profile={JSON.parse(JSON.stringify(profile))} experiences={JSON.parse(JSON.stringify(exps))} files={JSON.parse(JSON.stringify(files))} hasInstitution={!!user.institutionId} />
    </div>
  );
}
