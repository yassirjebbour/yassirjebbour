"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useI18n } from "../i18n";
import { api, track } from "@/lib/api";
import { IconHome, IconPassport, IconCompass, IconPath, IconChat, IconUser, IconBell, IconSettings, IconHelp, IconBuilding, IconShield, IconLogout } from "../icons";

type Item = { href: string; key: Parameters<ReturnType<typeof useI18n>["t"]>[0]; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };
const MAIN: Item[] = [
  { href: "/app", key: "nav.home", icon: IconHome },
  { href: "/app/passport", key: "nav.passport", icon: IconPassport },
  { href: "/app/opportunities", key: "nav.opportunities", icon: IconCompass },
  { href: "/app/plan", key: "nav.plan", icon: IconPath },
  { href: "/app/assistant", key: "nav.assistant", icon: IconChat },
];
const SECONDARY: Item[] = [
  { href: "/app/profile", key: "nav.profile", icon: IconUser },
  { href: "/app/notifications", key: "nav.notifications", icon: IconBell },
  { href: "/app/settings", key: "nav.settings", icon: IconSettings },
  { href: "/help", key: "nav.help", icon: IconHelp },
];

function active(path: string, href: string) {
  return href === "/app" ? path === "/app" : path === href || path.startsWith(href + "/");
}

export function Rail({ unread, role }: { unread: number; role: string }) {
  const { t } = useI18n();
  const path = usePathname();
  useEffect(() => { track("page.viewed", { page: path.replace(/[0-9a-f-]{36}/g, ":id").slice(0, 60) }); }, [path]);
  return (
    <nav className="rail" aria-label={t("nav.menu")}>
      <Link href="/app" className="brand"><Image src="/brand/bawsala-app-icon.svg" alt="" width={28} height={28} unoptimized priority /><span>BAWSALA</span></Link>
      {MAIN.map((i) => <Link key={i.href} href={i.href} className="nav-link" aria-current={active(path, i.href) ? "page" : undefined}><i.icon />{t(i.key)}</Link>)}
      <div className="nav-sep" />
      {SECONDARY.map((i) => (
        <Link key={i.href} href={i.href} className="nav-link" aria-current={active(path, i.href) ? "page" : undefined}>
          <i.icon />{t(i.key)}{i.href === "/app/notifications" && unread > 0 ? <span className="dot num" aria-label={String(unread)}>{unread}</span> : null}
        </Link>
      ))}
      {role === "institution_admin" ? <Link href="/institution" className="nav-link"><IconBuilding />{t("nav.institution")}</Link> : null}
      {role === "platform_admin" ? <Link href="/admin" className="nav-link"><IconShield />{t("nav.admin")}</Link> : null}
      <div className="rail-foot"><SignOutButton /></div>
    </nav>
  );
}

export function TabBar() {
  const { t } = useI18n();
  const path = usePathname();
  return (
    <nav className="tabbar" aria-label={t("nav.menu")}>
      {MAIN.map((i) => <Link key={i.href} href={i.href} aria-current={active(path, i.href) ? "page" : undefined}><i.icon /><span>{t(i.key)}</span></Link>)}
    </nav>
  );
}

export function SignOutButton({ compact }: { compact?: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  async function out() {
    await api("/auth/signout", { body: {} }).catch(() => {});
    router.replace("/"); router.refresh();
  }
  return <button type="button" className={compact ? "btn btn-ghost btn-icon" : "nav-link"} onClick={out} style={compact ? undefined : { border: 0, background: "none", font: "inherit", cursor: "pointer", width: "100%" }} aria-label={t("nav.signout")}><IconLogout />{compact ? null : t("nav.signout")}</button>;
}
