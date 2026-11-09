import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { asSystem, asUser } from "@/server/db";
import { rateLimitCount } from "@/server/ratelimit";
import { env } from "@/server/env";
import { SettingsView } from "@/components/app/settings";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("settings.title") }; }

export default async function Page() {
  const user = await requireUser();
  const { t } = await getT();
  const [inst, prefs, used] = await Promise.all([
    user.institutionId ? asSystem((tx) => tx.one<{ name: string }>(`SELECT name FROM institutions WHERE id = $1`, [user.institutionId])) : null,
    asUser(user.id, async (tx) => { await tx.query(`INSERT INTO notification_prefs (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [user.id]); return tx.one<{ in_app: boolean; email_reminders: boolean; email_security: boolean }>(`SELECT in_app, email_reminders, email_security FROM notification_prefs WHERE user_id = $1`, [user.id]); }),
    rateLimitCount(`chat:day:${user.id}`, 86_400),
  ]);
  return (
    <div className="stack-lg" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>{t("settings.title")}</h1></div>
      <SettingsView name={user.name} email={user.email} role={user.role} institution={inst?.name ?? null} prefs={prefs!} aiUsed={used} aiMax={env().AI_DAILY_MESSAGES_PER_USER} />
    </div>
  );
}
