import { Suspense } from "react";
import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { AuthShell } from "@/components/public/auth-shell";
import { ResetForm } from "@/components/public/auth-forms";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("auth.reset_title"), robots: { index: false } }; }

export default async function Page() {
  const { t } = await getT();
  return (
    <AuthShell title={t("auth.reset_title")}>
      <Suspense><ResetForm /></Suspense>
    </AuthShell>
  );
}
