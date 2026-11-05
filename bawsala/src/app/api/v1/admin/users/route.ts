import { route, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";

export const GET = route(async (req) => {
  await apiUser(["platform_admin"]);
  const q = new URL(req.url).searchParams.get("q")?.slice(0, 100) ?? "";
  const rows = await asSystem((tx) => tx.query(
    `SELECT u.id, u.name, u.email, u.role, u.locale, u.institution_id, i.name institution, u.created_at, u.last_active_at
       FROM users u LEFT JOIN institutions i ON i.id = u.institution_id
      WHERE $1 = '' OR u.email ILIKE '%' || $1 || '%' OR u.name ILIKE '%' || $1 || '%'
      ORDER BY u.created_at DESC LIMIT 100`, [q.replace(/[%_\\]/g, "")]));
  return json(rows);
});
