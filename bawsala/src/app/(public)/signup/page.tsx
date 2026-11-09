import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { AuthShell } from "@/components/public/auth-shell";
import { SignUpForm } from "@/components/public/auth-forms";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("auth.signup") }; }

export default async function Page() {
  const { t } = await getT();
  return (
    <AuthShell title={t("auth.signup_title")} sub={t("auth.signup_sub")}>
      <SignUpForm />
    </AuthShell>
  );
}
