import { Suspense } from "react";
import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { ResetForm } from "@/components/public/auth-forms";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("auth.reset_title"), robots: { index: false } }; }

export default async function Page() {
  const { t } = await getT();
  return (
    <div className="auth-wrap"><div className="auth-card panel stack">
      <h1>{t("auth.reset_title")}</h1>
      <Suspense><ResetForm /></Suspense>
    </div></div>
  );
}
