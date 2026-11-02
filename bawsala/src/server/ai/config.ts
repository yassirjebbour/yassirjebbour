/**
 * Model routing, pricing and prompt versions. One place to change models per task.
 * Defaults follow the provider's current flagship; every route can be overridden by env so a
 * cheaper model can be evaluated (npm run eval:ai) before it reaches students.
 */
export type AiTask = "chat" | "extract" | "title";

export function modelFor(task: AiTask): string {
  const base = process.env.AI_MODEL ?? "claude-opus-5-5";
  if (task === "extract") return process.env.AI_MODEL_EXTRACT ?? base;
  if (task === "title") return process.env.AI_MODEL_TITLE ?? base;
  return process.env.AI_MODEL_CHAT ?? base;
}

export function effortFor(task: AiTask): "low" | "medium" | "high" {
  const v = (task === "chat" ? process.env.AI_EFFORT_CHAT : process.env.AI_EFFORT_EXTRACT) ?? process.env.AI_EFFORT ?? "low";
  return v === "medium" || v === "high" ? v : "low";
}

/** USD per million tokens (input, output, cache read). Source: provider price list cached 2026-10-06. */
const PRICES: Record<string, { in: number; out: number; cacheRead: number }> = {
  "claude-opus-5-5": { in: 4, out: 20, cacheRead: 0.2 },
  "claude-sonnet-5-5": { in: 2, out: 10, cacheRead: 0.2 },
  "claude-haiku-5-5": { in: 0.1, out: 0.5, cacheRead: 0.01 },
};

export function estimateCostUsd(model: string, u: { input: number; output: number; cacheRead?: number; cacheWrite?: number }) {
  const p = PRICES[model];
  if (!p) return 0;
  return (u.input * p.in + u.output * p.out + (u.cacheRead ?? 0) * p.cacheRead + (u.cacheWrite ?? 0) * p.in * 1.25) / 1e6;
}

export const PROMPT_VERSIONS = { chat: "chat-2026-11-02.1", extract: "extract-2026-11-02.1" } as const;
