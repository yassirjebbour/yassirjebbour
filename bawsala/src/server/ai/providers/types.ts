/**
 * Provider-neutral LLM interface. The orchestrator (tool loop, persistence, permissions) only
 * talks to this interface, so adding a provider means implementing one class.
 */
import type { z } from "zod";
import type { AiTask } from "../config";

export type LlmPart =
  | { type: "text"; text: string }
  | { type: "tool_result"; toolUseId: string; content: string; isError?: boolean };

export type LlmMessage =
  | { role: "user"; parts: LlmPart[] }
  | { role: "assistant"; text: string }
  /** A provider's own assistant turn, replayed unchanged inside a tool loop (keeps thinking/tool blocks intact). */
  | { role: "assistant_raw"; provider: string; raw: unknown };

export interface ToolSpec { name: string; description: string; inputSchema: Record<string, unknown> }
export interface ToolCall { id: string; name: string; input: unknown }
export interface Usage { input: number; output: number; cacheRead: number; cacheWrite: number }

export interface TurnResult {
  stopReason: "end" | "tool_use" | "max_tokens" | "refusal" | "other";
  text: string;
  toolCalls: ToolCall[];
  raw: unknown;
  usage: Usage;
  model: string;
}

export type TurnEvent = { type: "text"; delta: string } | { type: "done"; result: TurnResult };

export type LlmErrorCode = "rate_limited" | "unavailable" | "auth" | "bad_request" | "timeout" | "cancelled" | "unknown";
export class LlmError extends Error {
  constructor(public code: LlmErrorCode, message: string, public retryable = false) { super(message); }
}

export interface LlmProvider {
  id: string;
  streamTurn(req: { task: AiTask; system: string; messages: LlmMessage[]; tools: ToolSpec[]; signal?: AbortSignal; maxTokens?: number }): AsyncGenerator<TurnEvent>;
  structured<T>(req: { task: AiTask; system: string; user: string; schema: z.ZodType<T>; signal?: AbortSignal }): Promise<{ data: T | null; usage: Usage; model: string; refused: boolean }>;
}
