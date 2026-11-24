import { route, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  return json(await asSystem((tx) => tx.query(`SELECT a.id, a.action, a.target, a.meta, a.created_at, u.email actor FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id ORDER BY a.id DESC LIMIT 200`)));
});
