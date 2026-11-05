import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { listNotifications } from "@/server/notify";
import { NotificationsView } from "@/components/app/notifications";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("notifications.title") }; }

export default async function Page() {
  const user = await requireUser();
  const { t } = await getT();
  const items = await listNotifications(user.id);
  return (
    <div className="stack-lg" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>{t("notifications.title")}</h1></div>
      <NotificationsView items={JSON.parse(JSON.stringify(items))} />
    </div>
  );
}
