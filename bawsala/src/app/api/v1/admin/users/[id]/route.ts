import { z } from "zod";
import { route, readJson, json, apiUser, ApiError } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { asSystem } from "@/server/db";

const Body = z.object({ role: z.enum(["student", "institution_admin", "platform_admin"]).optional(), institutionId: zUuid.nullable().optional() });

export const PATCH = route<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const admin = await apiUser(["platform_admin"]);
  const id = zUuid.parse((await params).id);
  if (id === admin.id) throw new ApiError("forbidden", "cannot_change_own_role");
  const b = await readJson(req, Body);
  if (b.role === "institution_admin" && !b.institutionId) {
    const cur = await asSystem((tx) => tx.one<{ institution_id: string | null }>(`SELECT institution_id FROM users WHERE id = $1`, [id]));
    if (!cur?.institution_id) throw new ApiError("validation", "institution_required");
  }
  await asSystem(async (tx) => {
    const r = await tx.query(`UPDATE users SET role = coalesce($2, role), institution_id = CASE WHEN $3::boolean THEN $4 ELSE institution_id END WHERE id = $1 RETURNING id`,
      [id, b.role ?? null, b.institutionId !== undefined, b.institutionId ?? null]);
    if (!r.length) throw new ApiError("not_found");
    await tx.query(`DELETE FROM sessions WHERE user_id = $1`, [id]); // role change takes effect at next sign-in
    await tx.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES ($1,'user.updated',$2,$3)`, [admin.id, id, JSON.stringify(b)]);
  });
  return json({ ok: true });
});
