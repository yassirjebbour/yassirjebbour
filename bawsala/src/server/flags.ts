import "server-only";
import { createHash } from "node:crypto";
import { asPublic, asSystem } from "./db";

export type FlagKey = "ai.assistant" | "ai.llm" | "ai.analysis" | "rag.search" | "signup.open" | "uploads.cv";
interface Flag { key: string; enabled: boolean; rollout: number; roles: string[]; description: string }

let cache: { at: number; flags: Map<string, Flag> } | null = null;

async function load() {
  if (cache && Date.now() - cache.at < 15_000) return cache.flags;
  const rows = await asPublic((tx) => tx.query<Flag>(`SELECT key, enabled, rollout, roles, description FROM feature_flags`));
  cache = { at: Date.now(), flags: new Map(rows.map((r) => [r.key, r])) };
  return cache.flags;
}

/** Stable per-user bucket 0..99 so a 20% rollout always shows the feature to the same 20%. */
export function bucket(key: string, userId: string) {
  return parseInt(createHash("sha256").update(key + ":" + userId).digest("hex").slice(0, 8), 16) % 100;
}

export async function isEnabled(key: FlagKey, user?: { id: string; role: string } | null): Promise<boolean> {
  const f = (await load()).get(key);
  if (!f || !f.enabled) return false;
  if (f.roles.length && (!user || !f.roles.includes(user.role))) return false;
  if (f.rollout < 100) return !!user && bucket(key, user.id) < f.rollout;
  return true;
}

export async function listFlags() {
  return [...(await load()).values()].sort((a, b) => a.key.localeCompare(b.key));
}

export async function setFlag(actorId: string, key: string, patch: { enabled?: boolean; rollout?: number; roles?: string[] }) {
  await asSystem(async (tx) => {
    await tx.query(
      `UPDATE feature_flags SET enabled = coalesce($2, enabled), rollout = coalesce($3, rollout), roles = coalesce($4, roles), updated_by = $5, updated_at = now() WHERE key = $1`,
      [key, patch.enabled ?? null, patch.rollout ?? null, patch.roles ?? null, actorId],
    );
    await tx.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES ($1,'flag.updated',$2,$3)`, [actorId, key, JSON.stringify(patch)]);
  });
  cache = null;
}
