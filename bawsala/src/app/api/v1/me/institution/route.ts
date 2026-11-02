import { z } from "zod";
import { route, readJson, json, apiUser, ApiError } from "@/server/http/api";
import { asSystem } from "@/server/db";
import { rateLimit } from "@/server/ratelimit";

const Body = z.object({ joinCode: z.string().trim().min(4).max(20) });
export const POST = route(async (req) => {
  const user = await apiUser(["student"]);
  await rateLimit(`join:${user.id}`, 10, 3600);
  const { joinCode } = await readJson(req, Body);
  const inst = await asSystem((tx) => tx.one<{ id: string; name: string }>(`SELECT id, name FROM institutions WHERE join_code = upper($1)`, [joinCode]));
  if (!inst) throw new ApiError("validation", "join_code_invalid");
  await asSystem(async (tx) => {
    await tx.query(`UPDATE users SET institution_id = $2 WHERE id = $1`, [user.id, inst.id]);
    await tx.query(`INSERT INTO audit_log (actor_id, action, target) VALUES ($1,'institution.joined',$2)`, [user.id, inst.id]);
  });
  return json({ ok: true, institution: inst });
});
export const DELETE = route(async () => {
  const user = await apiUser(["student"]);
  await asSystem(async (tx) => {
    await tx.query(`UPDATE users SET institution_id = NULL WHERE id = $1`, [user.id]);
    await tx.query(`UPDATE profiles SET share_with_institution = false WHERE user_id = $1`, [user.id]);
  });
  return json({ ok: true });
});
