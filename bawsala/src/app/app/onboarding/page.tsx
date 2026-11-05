import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getProfile } from "@/server/repo/profile";
import { getT } from "@/i18n/server";
import { Onboarding } from "@/components/app/onboarding";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("onboarding.title") }; }

export default async function Page() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  return <Onboarding initial={{ situation: profile.situation, field_of_study: profile.field_of_study, education_level: profile.education_level, school: profile.school, city: profile.city, languages: profile.languages, goal: profile.goal }} />;
}
