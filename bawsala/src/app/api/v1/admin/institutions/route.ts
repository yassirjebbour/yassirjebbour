import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  return json(await asSystem((tx) => tx.query(`SELECT i.id, i.name, i.city, i.join_code, i.created_at, (SELECT count(*)::int FROM users u WHERE u.institution_id = i.id) members FROM institutions i ORDER BY i.name`)));
});
export const POST = route(async (req) => {
  const admin = await apiUser(["platform_admin"]);
  const b = await readJson(req, z.object({ name: z.string().trim().min(2).max(200), city: z.string().trim().max(120).nullable().optional() }));
  const row = await asSystem(async (tx) => {
    const r = await tx.one(`INSERT INTO institutions (name, city) VALUES ($1,$2) RETURNING id, name, join_code`, [b.name, b.city ?? null]);
    await tx.query(`INSERT INTO audit_log (actor_id, action, target) VALUES ($1,'institution.created',$2)`, [admin.id, (r as { id: string }).id]);
    return r;
  });
  return json(row, { status: 201 });
});
