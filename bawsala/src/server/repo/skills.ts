import "server-only";
import { asPublic, asUser, type Tx } from "../db";
import { ApiError } from "../http/errors";
import type { Localized } from "@/i18n/config";
import type { StatusWeight } from "../domain/matching";

export interface CatalogSkill { id: string; category: string; names: Localized; learn_url: string | null; learn_title: Localized | null; learn_hours: number | null }

let catalogCache: { at: number; rows: CatalogSkill[] } | null = null;
export async function skillCatalog(): Promise<CatalogSkill[]> {
  if (catalogCache && Date.now() - catalogCache.at < 5 * 60_000) return catalogCache.rows;
  const rows = await asPublic((tx) => tx.query<CatalogSkill>(`SELECT id, category, names, learn_url, learn_title, learn_hours FROM skills ORDER BY category, id`));
  catalogCache = { at: Date.now(), rows };
  return rows;
}
export async function skillIdSet() {
  return new Set((await skillCatalog()).map((s) => s.id));
}

export interface Evidence { id: string; kind: string; text: string | null; url: string | null; experience_id: string | null; created_at: Date }
export interface PassportSkill { id: string; skill_id: string; status: StatusWeight; level: number; source: string; created_at: Date; evidence: Evidence[] }

export async function getPassport(userId: string): Promise<PassportSkill[]> {
  return asUser(userId, (tx) =>
    tx.query<PassportSkill>(
      `SELECT us.id, us.skill_id, us.status, us.level, us.source, us.created_at,
              coalesce(json_agg(json_build_object('id', e.id, 'kind', e.kind, 'text', e.text, 'url', e.url, 'experience_id', e.experience_id, 'created_at', e.created_at)
                       ORDER BY e.created_at) FILTER (WHERE e.id IS NOT NULL), '[]') AS evidence
         FROM user_skills us LEFT JOIN skill_evidence e ON e.user_skill_id = us.id
        WHERE us.user_id = $1
        GROUP BY us.id
        ORDER BY CASE us.status WHEN 'verified' THEN 0 WHEN 'evidenced' THEN 1 WHEN 'inferred' THEN 2 ELSE 3 END, us.created_at`,
      [userId],
    ),
  );
}

export async function ownedSkills(userId: string) {
  return asUser(userId, (tx) => tx.query<{ skillId: string; status: StatusWeight }>(`SELECT skill_id AS "skillId", status FROM user_skills WHERE user_id = $1`, [userId]));
}

export interface Suggestion { id: string; skill_id: string; experience_id: string | null; quote: string; reason: string | null; source: string; created_at: Date }

export const pendingSuggestions = (userId: string) =>
  asUser(userId, (tx) =>
    tx.query<Suggestion>(
      `SELECT id, skill_id, experience_id, quote, reason, source, created_at FROM skill_suggestions
        WHERE user_id = $1 AND status = 'pending'
          AND skill_id NOT IN (SELECT skill_id FROM user_skills WHERE user_id = $1)
        ORDER BY created_at DESC`,
      [userId],
    ),
  );

/** Store suggestions; duplicates for the same experience are ignored. Returns the number inserted. */
export async function addSuggestions(
  userId: string,
  items: Array<{ skillId: string; quote: string; reason?: string | null; experienceId: string | null; source: "ai" | "rules" }>,
) {
  const valid = await skillIdSet();
  let n = 0;
  await asUser(userId, async (tx) => {
    for (const it of items) {
      if (!valid.has(it.skillId)) continue;
      const r = await tx.query(
        `INSERT INTO skill_suggestions (user_id, skill_id, experience_id, quote, reason, source)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (user_id, skill_id, experience_id) DO NOTHING RETURNING id`,
        [userId, it.skillId, it.experienceId, it.quote.slice(0, 1000), it.reason?.slice(0, 600) ?? null, it.source],
      );
      n += r.length;
    }
  });
  return n;
}

async function upsertSkill(tx: Tx, userId: string, skillId: string, status: StatusWeight, source: string) {
  const row = await tx.one<{ id: string }>(
    `INSERT INTO user_skills (user_id, skill_id, status, source) VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id, skill_id) DO UPDATE SET
       status = CASE WHEN array_position(ARRAY['declared','inferred','evidenced','verified']::skill_status[], EXCLUDED.status)
                       > array_position(ARRAY['declared','inferred','evidenced','verified']::skill_status[], user_skills.status)
                     THEN EXCLUDED.status ELSE user_skills.status END
     RETURNING id`,
    [userId, skillId, status, source],
  );
  return row!.id;
}

/** The student says yes: the skill enters the passport as "inferred", with the quote as evidence. */
export async function acceptSuggestion(userId: string, suggestionId: string) {
  return asUser(userId, async (tx) => {
    const s = await tx.one<{ skill_id: string; quote: string; experience_id: string | null; source: string }>(
      `UPDATE skill_suggestions SET status = 'accepted' WHERE id = $1 AND status = 'pending' RETURNING skill_id, quote, experience_id, source`,
      [suggestionId],
    );
    if (!s) throw new ApiError("not_found");
    const usId = await upsertSkill(tx, userId, s.skill_id, "inferred", s.source);
    await tx.query(`INSERT INTO skill_evidence (user_id, user_skill_id, kind, experience_id, text) VALUES ($1,$2,'quote',$3,$4)`, [userId, usId, s.experience_id, s.quote]);
    return s.skill_id;
  });
}

export async function rejectSuggestion(userId: string, suggestionId: string) {
  const rows = await asUser(userId, (tx) => tx.query(`UPDATE skill_suggestions SET status = 'rejected' WHERE id = $1 AND status = 'pending' RETURNING id`, [suggestionId]));
  if (!rows.length) throw new ApiError("not_found");
}

/** The student adds a skill themself (no evidence yet): "declared". */
export async function declareSkill(userId: string, skillId: string) {
  if (!(await skillIdSet()).has(skillId)) throw new ApiError("validation", "unknown_skill");
  return asUser(userId, (tx) => upsertSkill(tx, userId, skillId, "declared", "user"));
}

/** Attaching a project/link/certificate upgrades the skill to "evidenced". */
export async function addEvidence(userId: string, skillId: string, ev: { kind: "project" | "link" | "certificate" | "task"; text?: string | null; url?: string | null; planTaskId?: string | null }) {
  if (!(await skillIdSet()).has(skillId)) throw new ApiError("validation", "unknown_skill");
  if (!ev.text && !ev.url) throw new ApiError("validation", "evidence_empty");
  return asUser(userId, async (tx) => {
    const usId = await upsertSkill(tx, userId, skillId, "evidenced", "user");
    await tx.query(`UPDATE user_skills SET status = 'evidenced' WHERE id = $1 AND status IN ('declared','inferred')`, [usId]);
    await tx.query(`INSERT INTO skill_evidence (user_id, user_skill_id, kind, text, url, plan_task_id) VALUES ($1,$2,$3,$4,$5,$6)`, [userId, usId, ev.kind, ev.text ?? null, ev.url ?? null, ev.planTaskId ?? null]);
  });
}

export async function removeSkill(userId: string, skillId: string) {
  const rows = await asUser(userId, (tx) => tx.query(`DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 RETURNING id`, [userId, skillId]));
  if (!rows.length) throw new ApiError("not_found");
}
