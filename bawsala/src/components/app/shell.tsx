import Link from "next/link";
import { getT } from "@/i18n/server";
import { Rail, TabBar, SignOutButton } from "./nav";
import { LanguageSwitcher, ThemeToggle } from "../language-switcher";
import { IconBell, IconUser } from "../icons";
import { unreadCount } from "@/server/notify";
import type { SessionUser } from "@/server/auth/session";

export async function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const { t } = await getT();
  const unread = await unreadCount(user.id);
  return (
    <div className="shell">
      <Rail unread={unread} role={user.role} />
      <div>
        <header className="topbar">
          <Link href="/app" className="brand"><img src="/brand/bawsala-app-icon.svg" alt="" width={26} height={26} /><span>BAWSALA</span></Link>
          <span />
          <div className="row" style={{ gap: 4 }}>
            <LanguageSwitcher compact />
            <ThemeToggle />
            <Link href="/app/notifications" className="btn btn-ghost btn-icon" aria-label={`${t("nav.notifications")}${unread ? ` (${unread})` : ""}`}>
              <IconBell width={20} height={20} />{unread ? <span className="dot num" aria-hidden="true">{unread}</span> : null}
            </Link>
            <Link href="/app/profile" className="btn btn-ghost btn-icon" aria-label={t("nav.profile")}><IconUser width={20} height={20} /></Link>
            <SignOutButton compact />
          </div>
        </header>
        <main id="main" className="main"><div className="container">{children}</div></main>
      </div>
      <TabBar />
    </div>
  );
}
