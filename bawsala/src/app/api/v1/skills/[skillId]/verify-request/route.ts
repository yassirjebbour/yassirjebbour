import { z } from "zod";
import { route, readJson, json, apiUser, ApiError } from "@/server/http/api";
import { asUser } from "@/server/db";

/** A student asks their institution to confirm that an experience happened (human review). */
export const POST = route<{ params: Promise<{ skillId: string }> }>(async (req, { params }) => {
  const user = await apiUser(["student"]);
  if (!user.institutionId) throw new ApiError("validation", "no_institution");
  const skillId = z.string().regex(/^[a-z0-9_]{2,40}$/).parse((await params).skillId);
  const { note } = await readJson(req, z.object({ note: z.string().trim().max(1000).optional() }));
  await asUser(user.id, async (tx) => {
    const us = await tx.one<{ id: string }>(`SELECT id FROM user_skills WHERE user_id = $1 AND skill_id = $2`, [user.id, skillId]);
    if (!us) throw new ApiError("not_found");
    await tx.query(`INSERT INTO verification_requests (user_id, user_skill_id, institution_id, note) VALUES ($1,$2,$3,$4)
                    ON CONFLICT (user_skill_id, institution_id) DO UPDATE SET status = 'pending', note = EXCLUDED.note, reviewed_at = NULL`,
      [user.id, us.id, user.institutionId, note ?? null]);
    await tx.query(`UPDATE profiles SET share_with_institution = true WHERE user_id = $1`, [user.id]);
  });
  return json({ ok: true }, { status: 201 });
});
