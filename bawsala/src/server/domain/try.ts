/**
 * The public "try it" analysis: deterministic rules engine plus a ranking against the example roles.
 * Pure and stateless (no database, no AI cost), so the landing page can pre-compute its examples
 * on the server and the API can answer visitors instantly.
 */
import { detectSkills } from "./skills-engine";
import { SAMPLE_OPPORTUNITIES } from "./catalog";
import { rankByFit, type Requirement } from "./matching";
import type { Localized } from "@/i18n/config";

export interface TryFound { skillId: string; quote: string }
export interface TryRole { slug: string; title: Localized; have: number; total: number; missing: string[] }
export interface TryResult { found: TryFound[]; roles: TryRole[] }

const reqs = (o: (typeof SAMPLE_OPPORTUNITIES)[number]): Requirement[] => [
  ...o.required.map((skillId) => ({ skillId, required: true })),
  ...o.nice.map((skillId) => ({ skillId, required: false })),
];

export function analyzeTry(text: string): TryResult {
  const found = detectSkills(text).map((f) => ({ skillId: f.skillId, quote: f.quote }));
  if (!found.length) return { found, roles: [] };
  const owned = found.map((f) => ({ skillId: f.skillId, status: "inferred" as const }));
  const roles = rankByFit(SAMPLE_OPPORTUNITIES, reqs, owned, (o) => o.slug)
    .filter((r) => r.fit.requiredHave > 0)
    .slice(0, 3)
    .map(({ item, fit }) => ({ slug: item.slug, title: item.title, have: fit.requiredHave, total: fit.requiredTotal, missing: fit.missingRequired }));
  return { found, roles };
}
