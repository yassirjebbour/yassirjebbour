import { Suspense } from "react";
import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { SignInForm } from "@/components/public/auth-forms";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("auth.signin"), robots: { index: false } }; }

export default async function Page() {
  const { t } = await getT();
  return (
    <div className="auth-wrap"><div className="auth-card panel stack">
      <div className="stack-sm"><h1>{t("auth.signin_title")}</h1><p className="muted">{t("auth.signin_sub")}</p></div>
      <Suspense><SignInForm /></Suspense>
    </div></div>
  );
}
