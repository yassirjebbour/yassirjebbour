import "server-only";
import { asPublic, asSystem, asUser } from "../db";
import { ApiError } from "../http/errors";
import { computeFit, rankByFit, type Requirement } from "../domain/matching";
import { ownedSkills } from "./skills";
import type { Localized } from "@/i18n/config";

export interface Opportunity {
  id: string; slug: string | null; title: Localized; organization: string; city: string | null; remote: boolean;
  kind: string; description: Localized; project_brief: Localized | null; apply_url: string | null;
  source_name: string; source_url: string | null; is_sample: boolean; status: string;
  verification_status: "verified" | "unverified" | "demo"; last_verified_at: Date | null; deadline: string | null; published_at: string | null;
  eligibility: Localized | null; source_updated_at: Date; expires_at: Date | null; requirements: Requirement[];
}

const SELECT = `
  SELECT o.id, o.slug, o.title, o.organization, o.city, o.remote, o.kind, o.description, o.project_brief, o.apply_url,
         o.source_name, o.source_url, o.is_sample, o.status, o.source_updated_at, o.expires_at,
         o.verification_status, o.last_verified_at, to_char(o.deadline,'YYYY-MM-DD') deadline, to_char(o.published_at,'YYYY-MM-DD') published_at, o.eligibility,
         coalesce(json_agg(json_build_object('skillId', os.skill_id, 'required', os.required) ORDER BY os.required DESC, os.skill_id)
                  FILTER (WHERE os.skill_id IS NOT NULL), '[]') AS requirements
    FROM opportunities o LEFT JOIN opportunity_skills os ON os.opportunity_id = o.id`;

export async function listOpportunities(opts: { includeUnpublished?: boolean } = {}): Promise<Opportunity[]> {
  return asPublic((tx) =>
    tx.query<Opportunity>(
      `${SELECT} WHERE ${opts.includeUnpublished ? "true" : "o.status = 'published' AND (o.expires_at IS NULL OR o.expires_at > now()) AND (o.deadline IS NULL OR o.deadline >= current_date)"}
       GROUP BY o.id ORDER BY o.is_sample, o.source_updated_at DESC`,
    ),
  );
}

export async function getOpportunity(id: string, opts: { includeUnpublished?: boolean } = {}): Promise<Opportunity> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("not_found");
  const visible = opts.includeUnpublished ? "true" : "o.status = 'published' AND (o.expires_at IS NULL OR o.expires_at > now()) AND (o.deadline IS NULL OR o.deadline >= current_date)";
  const row = await asPublic((tx) => tx.one<Opportunity>(`${SELECT} WHERE o.id = $1 AND ${visible} GROUP BY o.id`, [id]));
  if (!row) throw new ApiError("not_found");
  return row;
}

export async function rankedForUser(userId: string, filter: { city?: string; kind?: string } = {}) {
  const [opps, owned] = await Promise.all([listOpportunities(), ownedSkills(userId)]);
  const filtered = opps.filter((o) => (!filter.city || o.city === filter.city || o.remote) && (!filter.kind || o.kind === filter.kind));
  return rankByFit(filtered, (o) => o.requirements, owned, (o) => o.id);
}

export async function fitFor(userId: string, opp: Opportunity) {
  return computeFit(opp.requirements, await ownedSkills(userId));
}

export const savedOpportunities = (userId: string) =>
  asUser(userId, (tx) => tx.query<{ opportunity_id: string; status: string; created_at: Date }>(`SELECT opportunity_id, status, created_at FROM saved_opportunities WHERE user_id = $1 ORDER BY created_at DESC`, [userId]));

export async function saveOpportunity(userId: string, opportunityId: string, status: "saved" | "preparing" | "applied" = "saved") {
  await getOpportunity(opportunityId);
  await asUser(userId, (tx) =>
    tx.query(`INSERT INTO saved_opportunities (user_id, opportunity_id, status) VALUES ($1,$2,$3) ON CONFLICT (user_id, opportunity_id) DO UPDATE SET status = EXCLUDED.status`, [userId, opportunityId, status]),
  );
}

export async function unsaveOpportunity(userId: string, opportunityId: string) {
  await asUser(userId, (tx) => tx.query(`DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2`, [userId, opportunityId]));
}

// ---------- admin ----------
export interface OpportunityInput {
  title: Localized; organization: string; city: string | null; remote: boolean; kind: string;
  description: Localized; project_brief: Localized | null; apply_url: string | null;
  source_name: string; source_url: string | null; status: string; expires_at: string | null;
  verification_status: "verified" | "unverified"; deadline: string | null; published_at: string | null; eligibility: Localized | null;
  requirements: Requirement[];
}

export async function upsertOpportunity(actorId: string, input: OpportunityInput, id?: string) {
  const known = new Set((await asPublic((tx) => tx.query<{ id: string }>(`SELECT id FROM skills`))).map((r) => r.id));
  const unknown = input.requirements.filter((r) => !known.has(r.skillId)).map((r) => r.skillId);
  if (unknown.length) throw new ApiError("validation", `unknown_skill: ${unknown.join(",")}`);
  return asSystem(async (tx) => {
    // Opportunities created through the admin are never demo data; demo rows only come from the seed.
    const vals = [input.title, input.organization, input.city, input.remote, input.kind, input.description, input.project_brief, input.apply_url, input.source_name, input.source_url, false, input.status, input.expires_at,
      input.verification_status, input.deadline, input.published_at, input.eligibility];
    let oid = id;
    if (id) {
      const r = await tx.one<{ id: string }>(
        `UPDATE opportunities SET title=$2, organization=$3, city=$4, remote=$5, kind=$6, description=$7, project_brief=$8, apply_url=$9,
                source_name=$10, source_url=$11, is_sample=$12, status=$13, expires_at=$14, verification_status=$15, deadline=$16, published_at=$17, eligibility=$18,
                last_verified_at = CASE WHEN $15 = 'verified' THEN now() ELSE last_verified_at END, source_updated_at = now() WHERE id = $1 RETURNING id`,
        [id, ...vals],
      );
      if (!r) throw new ApiError("not_found");
      await tx.query(`DELETE FROM opportunity_skills WHERE opportunity_id = $1`, [id]);
    } else {
      const r = await tx.one<{ id: string }>(
        `INSERT INTO opportunities (title, organization, city, remote, kind, description, project_brief, apply_url, source_name, source_url, is_sample, status, expires_at,
                                    verification_status, deadline, published_at, eligibility, last_verified_at, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, CASE WHEN $14 = 'verified' THEN now() END, $18) RETURNING id`,
        [...vals, actorId],
      );
      oid = r!.id;
    }
    for (const req of input.requirements) {
      await tx.query(`INSERT INTO opportunity_skills (opportunity_id, skill_id, required) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`, [oid, req.skillId, req.required]);
    }
    await tx.query(`INSERT INTO audit_log (actor_id, action, target) VALUES ($1, $2, $3)`, [actorId, id ? "opportunity.updated" : "opportunity.created", oid]);
    return oid!;
  });
}
