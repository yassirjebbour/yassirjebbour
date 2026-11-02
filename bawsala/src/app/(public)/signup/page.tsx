import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { SignUpForm } from "@/components/public/auth-forms";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("auth.signup") }; }

export default async function Page() {
  const { t } = await getT();
  return (
    <div className="auth-wrap"><div className="auth-card panel stack">
      <div className="stack-sm"><h1>{t("auth.signup_title")}</h1><p className="muted">{t("auth.signup_sub")}</p></div>
      <SignUpForm />
    </div></div>
  );
}
