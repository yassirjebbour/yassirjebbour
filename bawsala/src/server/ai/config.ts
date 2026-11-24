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

type Rate = { in: number; out: number; cacheRead: number };
/**
 * USD per million tokens (input, output, cache read), from the provider's price list (checked 2026-11-09).
 * Cache writes use the 5-minute TTL the app sends: 1.25 × the input rate.
 * The fallback models (claude-opus-5, claude-opus-4-8) are listed because server-side fallbacks bill each
 * attempt at the model that ran it.
 */
const PRICES: Record<string, Rate & { longPrompt?: Rate }> = {
  "claude-fable-5-1": { in: 10, out: 50, cacheRead: 0.25 },
  "claude-opus-5-5": { in: 4, out: 20, cacheRead: 0.2 },
  "claude-opus-5": { in: 5, out: 25, cacheRead: 0.5 },
  "claude-opus-4-8": { in: 5, out: 25, cacheRead: 0.5 },
  "claude-sonnet-5-5": { in: 2, out: 10, cacheRead: 0.2 },
  // Haiku 5.5 has a second rate card for prompts over 100K tokens.
  "claude-haiku-5-5": { in: 0.1, out: 0.5, cacheRead: 0.01, longPrompt: { in: 0.5, out: 2.5, cacheRead: 0.05 } },
};
const LONG_PROMPT_TOKENS = 100_000;
/** An unknown model is charged at the highest known rate, so the daily budget can only over-count, never under-count. */
const UNKNOWN: Rate = Object.values(PRICES).reduce((a, p) => ({ in: Math.max(a.in, p.in), out: Math.max(a.out, p.out), cacheRead: Math.max(a.cacheRead, p.cacheRead) }), { in: 0, out: 0, cacheRead: 0 });

/** "anthropic.claude-opus-5-5" or "claude-opus-5-5-20261101" → "claude-opus-5-5". */
const normalizeModel = (m: string) => m.replace(/^anthropic\./, "").replace(/-\d{8}$/, "");

export const isPricedModel = (model: string) => normalizeModel(model) in PRICES;

export interface TokenUsage { input: number; output: number; cacheRead?: number; cacheWrite?: number }

export function estimateCostUsd(model: string, u: TokenUsage) {
  const card = PRICES[normalizeModel(model)];
  const prompt = u.input + (u.cacheRead ?? 0) + (u.cacheWrite ?? 0);
  const p: Rate = !card ? UNKNOWN : card.longPrompt && prompt > LONG_PROMPT_TOKENS ? card.longPrompt : card;
  return (u.input * p.in + u.output * p.out + (u.cacheRead ?? 0) * p.cacheRead + (u.cacheWrite ?? 0) * p.in * 1.25) / 1e6;
}

/** Cost of every attempt behind one response (main model, fallback models), each at its own model's rates. */
export const costOfAttempts = (attempts: Array<TokenUsage & { model: string }>) => attempts.reduce((sum, a) => sum + estimateCostUsd(a.model, a), 0);

export const PROMPT_VERSIONS = { chat: "chat-2026-11-02.1", extract: "extract-2026-11-02.1" } as const;
