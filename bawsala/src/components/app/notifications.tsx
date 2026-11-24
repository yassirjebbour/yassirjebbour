"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Empty } from "../ui";
import { IconBell } from "../icons";

type N = { id: string; kind: string; data: Record<string, string | number>; read_at: string | null; created_at: string };
const LINK: Record<string, string> = { task_due: "/app/plan", plan_ready: "/app/plan", skill_suggestions: "/app/passport", security: "/app/settings", opportunity: "/app/opportunities" };

export function NotificationsView({ items }: { items: N[] }) {
  const { t, fmtDate } = useI18n();
  const router = useRouter();
  const text = (n: N) => {
    switch (n.kind) {
      case "task_due": return t("notifications.task_due", { task: String(n.data.task ?? "") });
      case "plan_ready": return t("notifications.plan_ready", { title: String(n.data.title ?? "") });
      case "skill_suggestions": return t("notifications.skill_suggestions", { n: Number(n.data.n ?? 1) });
      case "security": return t("notifications.security", { what: n.data.what === "password" ? t("notifications.security_password") : t("notifications.security_signin") });
      case "opportunity": return t("notifications.opportunity", { title: String(n.data.title ?? "") });
      default: return n.data.text === "verification_approved" ? t("passport.status_verified") : n.data.text === "verification_declined" ? t("institution.reject") : String(n.data.text ?? "");
    }
  };
  async function markAll() { await api("/notifications/read", { body: {} }); router.refresh(); }
  if (!items.length) return <Empty icon={<IconBell />}>{t("notifications.empty")}</Empty>;
  return (
    <div className="stack">
      {items.some((n) => !n.read_at) ? <div><Button size="sm" variant="secondary" onClick={markAll}>{t("notifications.mark_all")}</Button></div> : null}
      <ul className="list panel" style={{ padding: "4px 16px" }}>
        {items.map((n) => (
          <li key={n.id} className="row-between" style={{ fontWeight: n.read_at ? 400 : 600 }}>
            <Link href={LINK[n.kind] ?? "/app"} style={{ color: "inherit", textDecoration: "none" }}>{!n.read_at ? <span className="sr-only">●</span> : null}{text(n)}</Link>
            <span className="small muted">{fmtDate(n.created_at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
