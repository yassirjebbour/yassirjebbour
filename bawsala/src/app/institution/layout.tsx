import type { Metadata } from "next";
import { requireRole } from "@/server/auth/current";
import { AppShell } from "@/components/app/shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("institution_admin");
  return <AppShell user={user}>{children}</AppShell>;
}
