/**
 * Opportunity matching and skills-gap analysis. Pure functions — no I/O — so the numbers the
 * student sees are reproducible and testable. Every number states what it counts.
 */

export type StatusWeight = "declared" | "inferred" | "evidenced" | "verified";

export interface Requirement { skillId: string; required: boolean }
export interface OwnedSkill { skillId: string; status: StatusWeight }

export interface Fit {
  requiredTotal: number;
  requiredHave: number;
  niceTotal: number;
  niceHave: number;
  have: string[];          // skill ids the student has that the role asks for
  missingRequired: string[];
  missingNice: string[];
  /** 0–100. Required skills weigh 80%, nice-to-have 20%; evidence counts more than a claim. */
  score: number;
}

const STATUS_CREDIT: Record<StatusWeight, number> = { declared: 0.6, inferred: 0.8, evidenced: 1, verified: 1 };

export function computeFit(reqs: Requirement[], owned: OwnedSkill[]): Fit {
  const byId = new Map(owned.map((o) => [o.skillId, o.status]));
  const required = reqs.filter((r) => r.required);
  const nice = reqs.filter((r) => !r.required);
  const credit = (list: Requirement[]) => list.reduce((acc, r) => acc + (byId.has(r.skillId) ? STATUS_CREDIT[byId.get(r.skillId)!] : 0), 0);
  const reqScore = required.length ? credit(required) / required.length : 1;
  const niceScore = nice.length ? credit(nice) / nice.length : 1;
  const score = Math.round((reqScore * 0.8 + niceScore * 0.2) * 100);
  return {
    requiredTotal: required.length,
    requiredHave: required.filter((r) => byId.has(r.skillId)).length,
    niceTotal: nice.length,
    niceHave: nice.filter((r) => byId.has(r.skillId)).length,
    have: reqs.filter((r) => byId.has(r.skillId)).map((r) => r.skillId),
    missingRequired: required.filter((r) => !byId.has(r.skillId)).map((r) => r.skillId),
    missingNice: nice.filter((r) => !byId.has(r.skillId)).map((r) => r.skillId),
    score,
  };
}

export interface Ranked<T> { item: T; fit: Fit }

/** Rank by score, then by fewest missing required skills, then by stable key. */
export function rankByFit<T>(items: T[], reqsOf: (t: T) => Requirement[], owned: OwnedSkill[], keyOf: (t: T) => string): Ranked<T>[] {
  return items
    .map((item) => ({ item, fit: computeFit(reqsOf(item), owned) }))
    .sort((a, b) => b.fit.score - a.fit.score || a.fit.missingRequired.length - b.fit.missingRequired.length || keyOf(a.item).localeCompare(keyOf(b.item)));
}

/** Readiness for one target: share of required skills backed by evidence vs merely claimed. */
export function readiness(reqs: Requirement[], owned: OwnedSkill[]) {
  const byId = new Map(owned.map((o) => [o.skillId, o.status]));
  const required = reqs.filter((r) => r.required);
  const evidenced = required.filter((r) => ["evidenced", "verified"].includes(byId.get(r.skillId) ?? "")).length;
  const claimed = required.filter((r) => byId.has(r.skillId)).length;
  return { required: required.length, claimed, evidenced };
}
