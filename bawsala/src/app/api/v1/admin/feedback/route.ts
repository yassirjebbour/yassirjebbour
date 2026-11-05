import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  return json(await asSystem((tx) => tx.query(`SELECT f.id, f.kind, f.message, f.page, f.status, f.created_at, u.email FROM feedback f LEFT JOIN users u ON u.id = f.user_id ORDER BY f.created_at DESC LIMIT 200`)));
});
export const PATCH = route(async (req) => {
  const admin = await apiUser(["platform_admin"]);
  const b = await readJson(req, z.object({ id: z.string().uuid(), status: z.enum(["open", "in_progress", "closed"]) }));
  await asSystem(async (tx) => {
    await tx.query(`UPDATE feedback SET status = $2 WHERE id = $1`, [b.id, b.status]);
    await tx.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES ($1,'feedback.updated',$2,$3)`, [admin.id, b.id, JSON.stringify({ status: b.status })]);
  });
  return json({ ok: true });
});
