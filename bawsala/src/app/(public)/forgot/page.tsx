import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { AuthShell } from "@/components/public/auth-shell";
import { ForgotForm } from "@/components/public/auth-forms";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("auth.forgot_title"), robots: { index: false } }; }

export default async function Page() {
  const { t } = await getT();
  return (
    <AuthShell title={t("auth.forgot_title")} sub={t("auth.forgot_sub")}>
      <ForgotForm />
    </AuthShell>
  );
}
