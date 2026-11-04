"use client";
import { usePathname } from "next/navigation";

/** Public pages get the app header and footer; the homepage brings the original design's own header and footer. */
export function PublicFrame({ header, footer, children }: { header: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
  if (usePathname() === "/") return <>{children}</>;
  return <>{header}<main id="main">{children}</main>{footer}</>;
}
