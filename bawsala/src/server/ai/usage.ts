import "server-only";
import { asSystem } from "../db";
import { estimateCostUsd } from "./config";
import { log } from "../log";

export interface UsageRecord {
  userId: string | null; feature: string; engine: string; model?: string | null; promptVersion?: string | null;
  input?: number; output?: number; cacheRead?: number; cacheWrite?: number; ok: boolean; latencyMs?: number; errorCode?: string | null;
}

export async function recordUsage(u: UsageRecord) {
  const cost = u.model ? estimateCostUsd(u.model, { input: u.input ?? 0, output: u.output ?? 0, cacheRead: u.cacheRead, cacheWrite: u.cacheWrite }) : 0;
  log.info("ai.usage", { feature: u.feature, engine: u.engine, model: u.model, in: u.input, out: u.output, cr: u.cacheRead, ok: u.ok, ms: u.latencyMs, cost, err: u.errorCode });
  await asSystem((tx) =>
    tx.query(
      `INSERT INTO ai_usage (user_id, feature, engine, model, prompt_version, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, ok, latency_ms, est_cost_usd, error_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [u.userId, u.feature, u.engine, u.model ?? null, u.promptVersion ?? null, u.input ?? 0, u.output ?? 0, u.cacheRead ?? 0, u.cacheWrite ?? 0, u.ok, u.latencyMs ?? null, cost, u.errorCode ?? null],
    ),
  ).catch((e) => log.warn("ai.usage.write_failed", { err: e }));
}
