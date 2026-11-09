import { describe, expect, it } from "vitest";
import { costOfAttempts, estimateCostUsd, isPricedModel } from "@/server/ai/config";
import { attemptsOf } from "@/server/ai/providers/anthropic";

const M = 1_000_000;

describe("AI cost estimate", () => {
  it("uses the provider's list prices per million tokens", () => {
    expect(estimateCostUsd("claude-opus-5-5", { input: M, output: M })).toBeCloseTo(24);
    expect(estimateCostUsd("claude-sonnet-5-5", { input: 0, output: 0, cacheRead: M })).toBeCloseTo(0.2);
    expect(estimateCostUsd("claude-opus-5-5", { input: 0, output: 0, cacheWrite: M })).toBeCloseTo(5); // 1.25 × input
  });

  it("applies Haiku 5.5's long-prompt rate card above 100K prompt tokens", () => {
    expect(estimateCostUsd("claude-haiku-5-5", { input: 100_000, output: 0 })).toBeCloseTo(0.01);
    expect(estimateCostUsd("claude-haiku-5-5", { input: 100_001, output: 0 })).toBeCloseTo(0.0500005);
  });

  it("never prices an unknown model at zero", () => {
    expect(isPricedModel("claude-future-9")).toBe(false);
    expect(estimateCostUsd("claude-future-9", { input: M, output: 0 })).toBeGreaterThanOrEqual(10);
  });

  it("recognises platform prefixes and dated ids", () => {
    expect(isPricedModel("anthropic.claude-opus-5-5")).toBe(true);
    expect(estimateCostUsd("claude-opus-5-5-20261101", { input: M, output: 0 })).toBeCloseTo(4);
  });

  it("bills every attempt of a server-side fallback at its own model", () => {
    const usage = {
      input_tokens: 2000, output_tokens: 500, cache_read_input_tokens: 0, cache_creation_input_tokens: 0,
      iterations: [
        { type: "message", model: null, input_tokens: 2000, output_tokens: 10, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
        { type: "fallback_message", model: "claude-opus-5", input_tokens: 2000, output_tokens: 500, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
      ],
    };
    const { usage: total, attempts } = attemptsOf(usage, "claude-opus-5-5");
    expect(attempts.map((a) => a.model)).toEqual(["claude-opus-5-5", "claude-opus-5"]);
    expect(total).toEqual({ input: 4000, output: 510, cacheRead: 0, cacheWrite: 0 });
    // 2000×4 + 10×20 (refused attempt) + 2000×5 + 500×25 (fallback), per million
    expect(costOfAttempts(attempts)).toBeCloseTo((8000 + 200 + 10000 + 12500) / M);
  });

  it("falls back to top-level usage when there are no iterations", () => {
    const { attempts } = attemptsOf({ input_tokens: 10, output_tokens: 5 }, "claude-sonnet-5-5");
    expect(attempts).toEqual([{ model: "claude-sonnet-5-5", input: 10, output: 5, cacheRead: 0, cacheWrite: 0 }]);
  });
});
