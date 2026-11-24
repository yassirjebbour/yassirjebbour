import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { pick } from "@/i18n/config";
import { Rail, TabBar, type RailCompass } from "./nav";
import { CommandPalette } from "./command-palette";
import { LanguageSwitcher, ThemeToggle } from "../language-switcher";
import { IconBell } from "../icons";
import { unreadCount } from "@/server/notify";
import { getProfile } from "@/server/repo/profile";
import { getOpportunity } from "@/server/repo/opportunities";
import { ownedSkills } from "@/server/repo/skills";
import { computeFit } from "@/server/domain/matching";
import type { SessionUser } from "@/server/auth/session";

/** The compass card in the rail: the student's target role and how close they are. Never blocks the page. */
async function compassFor(userId: string, locale: Parameters<typeof pick>[1]): Promise<RailCompass> {
  try {
    const [profile, owned] = await Promise.all([getProfile(userId), ownedSkills(userId)]);
    if (profile.target_opportunity_id) {
      try {
        const opp = await getOpportunity(profile.target_opportunity_id);
        const fit = computeFit(opp.requirements, owned);
        return { kind: "target", title: pick(opp.title, locale), have: fit.requiredHave, total: fit.requiredTotal, href: `/app/opportunities/${opp.id}` };
      } catch { /* target no longer published: fall through */ }
    }
    return { kind: "none", skills: owned.length };
  } catch { return { kind: "none", skills: 0 }; }
}

export async function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const { t, locale } = await getT();
  const [unread, compass] = await Promise.all([unreadCount(user.id), compassFor(user.id, locale)]);
  const initial = Array.from(user.name.trim())[0]?.toLocaleUpperCase() ?? "•";
  return (
    <div className="shell">
      <Rail unread={unread} role={user.role} compass={compass} />
      <div>
        <header className="topbar">
          <Link href="/app" className="brand" aria-label="BAWSALA"><Image src="/brand/bawsala-app-icon.svg" alt="" width={28} height={28} unoptimized priority /><span className="hide-sm">BAWSALA</span></Link>
          <CommandPalette />
          <div className="topbar-actions">
            <span className="hide-sm topbar-actions"><LanguageSwitcher compact /><ThemeToggle /></span>
            <Link href="/app/notifications" className="btn btn-ghost btn-icon" aria-label={`${t("nav.notifications")}${unread ? ` (${unread})` : ""}`}>
              <IconBell width={20} height={20} />{unread ? <span className="dot num" aria-hidden="true">{unread > 9 ? "9+" : unread}</span> : null}
            </Link>
            <Link href="/app/profile" className="avatar" aria-label={`${t("nav.profile")}: ${user.name}`} title={user.name}>{initial}</Link>
          </div>
        </header>
        <main id="main" className="main"><div className="container">{children}</div></main>
      </div>
      <TabBar />
    </div>
  );
}
