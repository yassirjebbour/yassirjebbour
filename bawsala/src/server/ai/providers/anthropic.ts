import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { effortFor, modelFor } from "../config";
import { LlmError, type LlmMessage, type LlmProvider, type ToolSpec, type TurnEvent, type TurnResult, type Usage } from "./types";

type BetaMessageParam = Anthropic.Beta.BetaMessageParam;

function mapError(e: unknown): LlmError {
  if (e instanceof Anthropic.APIUserAbortError) return new LlmError("cancelled", "cancelled");
  if (e instanceof Anthropic.RateLimitError) return new LlmError("rate_limited", e.message, true);
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return new LlmError("auth", e.message);
  if (e instanceof Anthropic.BadRequestError) return new LlmError("bad_request", e.message);
  if (e instanceof Anthropic.APIConnectionTimeoutError) return new LlmError("timeout", e.message, true);
  if (e instanceof Anthropic.APIConnectionError) return new LlmError("unavailable", e.message, true);
  if (e instanceof Anthropic.APIError) return new LlmError((e.status ?? 500) >= 500 ? "unavailable" : "unknown", e.message, (e.status ?? 500) >= 500);
  if (e instanceof Error && e.name === "AbortError") return new LlmError("cancelled", "cancelled");
  return new LlmError("unknown", e instanceof Error ? e.message : String(e));
}

function toAnthropic(messages: LlmMessage[]): BetaMessageParam[] {
  return messages.map((m) => {
    if (m.role === "assistant_raw") return { role: "assistant", content: m.raw as Anthropic.Beta.BetaContentBlockParam[] };
    if (m.role === "assistant") return { role: "assistant", content: m.text || "…" };
    return {
      role: "user",
      content: m.parts.map((p) =>
        p.type === "text"
          ? ({ type: "text", text: p.text } as const)
          : ({ type: "tool_result", tool_use_id: p.toolUseId, content: p.content, is_error: p.isError ?? false } as const),
      ),
    };
  });
}

function usageOf(u: { input_tokens?: number | null; output_tokens?: number | null; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null }): Usage {
  return { input: u.input_tokens ?? 0, output: u.output_tokens ?? 0, cacheRead: u.cache_read_input_tokens ?? 0, cacheWrite: u.cache_creation_input_tokens ?? 0 };
}

export class AnthropicProvider implements LlmProvider {
  id = "anthropic";
  private client: Anthropic;
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey, maxRetries: 2, timeout: 90_000 });
  }

  async *streamTurn(req: { task: "chat" | "extract" | "title"; system: string; messages: LlmMessage[]; tools: ToolSpec[]; signal?: AbortSignal; maxTokens?: number }): AsyncGenerator<TurnEvent> {
    const model = modelFor(req.task);
    const useFallbacks = process.env.AI_FALLBACKS !== "false";
    const params = {
      model,
      max_tokens: req.maxTokens ?? 8000,
      system: [{ type: "text" as const, text: req.system, cache_control: { type: "ephemeral" as const } }],
      messages: toAnthropic(req.messages),
      tools: req.tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema as Anthropic.Beta.BetaTool.InputSchema, eager_input_streaming: true })),
      output_config: { effort: effortFor(req.task) },
      ...(useFallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    };
    let message: Anthropic.Beta.BetaMessage;
    for (let attempt = 0; ; attempt++) {
      try {
        const stream = this.client.beta.messages.stream(params as Anthropic.Beta.MessageCreateParamsStreaming, { signal: req.signal });
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") yield { type: "text", delta: ev.delta.text };
        }
        message = await stream.finalMessage();
        break;
      } catch (e) {
        // With eager input streaming the SDK may fail to parse a truncated tool input: re-issue once.
        if (!(e instanceof Anthropic.APIError) && !(e instanceof Anthropic.APIUserAbortError) && !(e instanceof Error && e.name === "AbortError") && attempt < 1) continue;
        throw mapError(e);
      }
    }
    const text = message.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("");
    const toolCalls = message.content
      .filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use")
      .map((b) => ({ id: b.id, name: b.name, input: b.input }));
    const sr = message.stop_reason;
    const result: TurnResult = {
      stopReason: sr === "end_turn" ? "end" : sr === "tool_use" ? "tool_use" : sr === "max_tokens" ? "max_tokens" : sr === "refusal" ? "refusal" : "other",
      text,
      toolCalls,
      raw: message.content,
      usage: usageOf(message.usage),
      model: message.model ?? model,
    };
    yield { type: "done", result };
  }

  async structured<T>(req: { task: "chat" | "extract" | "title"; system: string; user: string; schema: z.ZodType<T>; signal?: AbortSignal }) {
    const model = modelFor(req.task);
    try {
      const res = await this.client.messages.parse(
        {
          model,
          max_tokens: 4000,
          system: req.system,
          messages: [{ role: "user", content: req.user }],
          output_config: { format: zodOutputFormat(req.schema as z.ZodType), effort: effortFor(req.task) },
        },
        { signal: req.signal },
      );
      return { data: (res.parsed_output as T | null) ?? null, usage: usageOf(res.usage), model: res.model ?? model, refused: res.stop_reason === "refusal" };
    } catch (e) {
      throw mapError(e);
    }
  }
}
