import "server-only";
import { AnthropicProvider } from "./anthropic";
import type { LlmProvider } from "./types";

let cached: LlmProvider | null | undefined;

/** The configured LLM provider, or null (the product then runs its deterministic "basic" engine). */
export function getProvider(): LlmProvider | null {
  if (cached !== undefined) return cached;
  const name = process.env.AI_PROVIDER ?? "anthropic";
  if (name === "anthropic" && process.env.ANTHROPIC_API_KEY) cached = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
  else cached = null;
  return cached;
}

/** Test hook: inject a fake provider (used by integration tests of the tool loop). */
export function setProviderForTests(p: LlmProvider | null) {
  cached = p;
}
