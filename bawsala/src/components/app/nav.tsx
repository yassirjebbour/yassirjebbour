"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { api, track } from "@/lib/api";
import { Ring } from "../viz";
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

export type RailCompass = { kind: "target"; title: string; have: number; total: number; href: string } | { kind: "none"; skills: number };

function active(path: string, href: string) {
  return href === "/app" ? path === "/app" : path === href || path.startsWith(href + "/");
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Rail({ unread, role, compass }: { unread: number; role: string; compass: RailCompass }) {
  const { t } = useI18n();
  const path = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ y: number; h: number } | null>(null);
  useEffect(() => { track("page.viewed", { page: path.replace(/[0-9a-f-]{36}/g, ":id").slice(0, 60) }); }, [path]);
  // Sliding indicator: measured from the active link so it works in every language and font size.
  useIsoLayoutEffect(() => {
    const nav = navRef.current;
    const measure = () => {
      const a = nav?.querySelector<HTMLElement>('a[aria-current="page"]');
      setInd(a ? { y: a.offsetTop, h: a.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (nav) ro.observe(nav);
    return () => ro.disconnect();
  }, [path]);
  const link = (i: Item) => (
    <Link key={i.href} href={i.href} className="nav-link" aria-current={active(path, i.href) ? "page" : undefined}>
      <i.icon />{t(i.key)}{i.href === "/app/notifications" && unread > 0 ? <span className="dot num count-badge" aria-label={String(unread)}>{unread > 9 ? "9+" : unread}</span> : null}
    </Link>
  );
  return (
    <nav className="rail" aria-label={t("nav.menu")}>
      <Link href="/app" className="brand"><Image src="/brand/bawsala-mark-white.svg" alt="" width={30} height={30} unoptimized priority /><span>BAWSALA</span></Link>
      <div className="rail-nav" ref={navRef}>
        <span className="rail-ind" aria-hidden="true" style={ind ? { transform: `translateY(${ind.y}px)`, height: ind.h } : { opacity: 0 }} />
        {MAIN.map(link)}
        <div className="nav-sep" />
        {SECONDARY.map(link)}
        {role === "institution_admin" ? <Link href="/institution" className="nav-link"><IconBuilding />{t("nav.institution")}</Link> : null}
        {role === "platform_admin" ? <Link href="/admin" className="nav-link"><IconShield />{t("nav.admin")}</Link> : null}
      </div>
      <div className="rail-foot">
        {compass.kind === "target" ? (
          <Link href={compass.href} className="rail-compass">
            <Ring value={compass.have} max={Math.max(1, compass.total)} size={46} stroke={5} label={t("shell.readiness", { have: compass.have, total: compass.total })} fs={12}>
              <b className="num">{compass.have}/{compass.total}</b>
            </Ring>
            <span className="meta"><small>{t("shell.target")}</small><span className="bidi">{compass.title}</span></span>
          </Link>
        ) : (
          <Link href="/app/opportunities" className="rail-compass">
            <span className="icon-tile gold" aria-hidden="true"><IconCompass /></span>
            <span className="meta"><small>{t("shell.no_target")}</small><span>{t("shell.choose_target")}</span></span>
          </Link>
        )}
        <SignOutButton />
      </div>
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
