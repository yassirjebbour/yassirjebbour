import "server-only";
import { asSystem } from "../db";
import { ApiError } from "../http/errors";

export const MIN_GROUP = 5;

/**
 * Aggregated statistics for one institution. Tenant boundary: every query is filtered by the
 * caller's own institution_id (taken from the session, never from the request), and only
 * students who turned on sharing are counted. Below MIN_GROUP students, nothing is returned.
 */
export async function institutionStats(institutionId: string) {
  return asSystem(async (tx) => {
    const inst = await tx.one<{ id: string; name: string; join_code: string; city: string | null }>(`SELECT id, name, join_code, city FROM institutions WHERE id = $1`, [institutionId]);
    if (!inst) throw new ApiError("not_found");
    const { n } = (await tx.one<{ n: number }>(
      `SELECT count(*)::int n FROM users u JOIN profiles p ON p.user_id = u.id WHERE u.institution_id = $1 AND u.role = 'student' AND p.share_with_institution`, [institutionId]))!;
    if (n < MIN_GROUP) return { institution: inst, sharing: n, minGroup: MIN_GROUP, stats: null };
    const scope = `FROM users u JOIN profiles p ON p.user_id = u.id WHERE u.institution_id = $1 AND u.role = 'student' AND p.share_with_institution`;
    const skills = await tx.query<{ skill_id: string; students: number; evidenced: number }>(
      `SELECT us.skill_id, count(*)::int students, count(*) FILTER (WHERE us.status IN ('evidenced','verified'))::int evidenced
         FROM user_skills us WHERE us.user_id IN (SELECT u.id ${scope}) GROUP BY us.skill_id HAVING count(*) >= ${MIN_GROUP} ORDER BY students DESC LIMIT 12`, [institutionId]);
    const totals = await tx.one<{ skills: number; evidenced: number }>(
      `SELECT count(*)::int skills, count(*) FILTER (WHERE status IN ('evidenced','verified'))::int evidenced FROM user_skills WHERE user_id IN (SELECT u.id ${scope})`, [institutionId]);
    const withPlan = await tx.one<{ n: number }>(`SELECT count(DISTINCT user_id)::int n FROM plans WHERE status = 'active' AND user_id IN (SELECT u.id ${scope})`, [institutionId]);
    const tasks30 = await tx.one<{ n: number }>(`SELECT count(*)::int n FROM plan_tasks WHERE completed_at > now() - interval '30 days' AND user_id IN (SELECT u.id ${scope})`, [institutionId]);
    return { institution: inst, sharing: n, minGroup: MIN_GROUP, stats: { skills, totals: totals!, withPlan: withPlan!.n, tasksDone30: tasks30!.n } };
  });
}

export async function verificationQueue(institutionId: string) {
  return asSystem((tx) =>
    tx.query<{ id: string; student: string; skill_id: string; note: string | null; created_at: Date; evidence: Array<{ text: string | null; url: string | null }> }>(
      `SELECT vr.id, u.name student, us.skill_id, vr.note, vr.created_at,
              coalesce((SELECT json_agg(json_build_object('text', e.text, 'url', e.url)) FROM skill_evidence e WHERE e.user_skill_id = us.id), '[]') evidence
         FROM verification_requests vr JOIN users u ON u.id = vr.user_id JOIN user_skills us ON us.id = vr.user_skill_id
         JOIN profiles p ON p.user_id = u.id
        WHERE vr.institution_id = $1 AND vr.status = 'pending' AND u.institution_id = $1 AND p.share_with_institution
        ORDER BY vr.created_at LIMIT 100`, [institutionId]),
  );
}

/** Human decision: only an institution admin of the same institution can verify; never the AI. */
export async function reviewVerification(reviewer: { id: string; institutionId: string }, requestId: string, decision: "approved" | "rejected", note: string | null) {
  return asSystem(async (tx) => {
    const vr = await tx.one<{ user_skill_id: string; user_id: string }>(
      `UPDATE verification_requests SET status = $3, reviewer_id = $4, review_note = $5, reviewed_at = now()
        WHERE id = $1 AND institution_id = $2 AND status = 'pending' RETURNING user_skill_id, user_id`,
      [requestId, reviewer.institutionId, decision, reviewer.id, note]);
    if (!vr) throw new ApiError("not_found");
    if (decision === "approved") await tx.query(`UPDATE user_skills SET status = 'verified' WHERE id = $1`, [vr.user_skill_id]);
    await tx.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES ($1,$2,$3,$4)`, [reviewer.id, `verification.${decision}`, requestId, JSON.stringify({ institution: reviewer.institutionId })]);
    return vr;
  });
}
