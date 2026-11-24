import { z } from "zod";
import { route, readJson, apiUser, ApiError } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { runChat } from "@/server/ai/chat";
import { addMessage, createConversation, getConversation, popLastAssistant } from "@/server/repo/conversations";
import { spentTodayUsd } from "@/server/ai/usage";
import { rateLimit } from "@/server/ratelimit";
import { isEnabled } from "@/server/flags";
import { env } from "@/server/env";
import { track } from "@/server/events";

export const maxDuration = 120;

const Body = z.object({
  conversationId: zUuid.optional().nullable(),
  message: z.string().trim().max(12000).optional(),
  regenerate: z.boolean().optional(),
}).refine((b) => b.regenerate || (b.message && b.message.length > 0), "message required");

/**
 * Streams the assistant's answer as Server-Sent Events.
 * Event types: meta, text, tool_start, tool_end, citations, followups, done, error.
 * Closing the connection (Stop button) aborts generation; the partial answer is saved as "stopped".
 */
export const POST = route(async (req) => {
  const user = await apiUser();
  if (!(await isEnabled("ai.assistant", user))) throw new ApiError("ai_unavailable", "assistant_disabled");
  await rateLimit(`chat:min:${user.id}`, 12, 60);
  // Every generation counts (including regenerate); the counter is independent of conversations,
  // so deleting a conversation does not reset it.
  await rateLimit(`chat:day:${user.id}`, env().AI_DAILY_MESSAGES_PER_USER, 86_400).catch((e) => { throw e instanceof ApiError ? new ApiError("ai_quota", "daily_limit", undefined, e.retryAfter) : e; });
  // Platform-wide daily budget: above it the assistant keeps working in basic mode (no model cost).
  const overBudget = (await spentTodayUsd()) >= env().AI_DAILY_BUDGET_USD;
  const body = await readJson(req, Body);

  let conversationId = body.conversationId ?? null;
  let text: string;
  if (body.regenerate) {
    if (!conversationId) throw new ApiError("bad_request", "conversation_required");
    text = await popLastAssistant(user.id, conversationId);
  } else {
    text = body.message!;
    if (conversationId) await getConversation(user.id, conversationId); // ownership check (404 otherwise)
    else conversationId = (await createConversation(user.id, text.replace(/\s+/g, " ").slice(0, 60))).id;
    await addMessage(user.id, conversationId, { role: "user", content: text });
  }
  track(user.id, "chat.message", { regenerate: !!body.regenerate, chars: text.length });

  const encoder = new TextEncoder();
  const signal = req.signal;
  const stream = new ReadableStream({
    async start(controller) {
      const send = (ev: unknown) => { try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`)); } catch { /* client gone */ } };
      try {
        for await (const ev of runChat({ user, conversationId: conversationId!, userText: text, signal, forceBasic: overBudget })) {
          send(ev);
          if (ev.type === "tool_end") track(user.id, "tool.executed", { tool: ev.name, ok: ev.ok });
        }
      } catch {
        send({ type: "error", code: "internal" });
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-store, no-transform", connection: "keep-alive", "x-accel-buffering": "no" },
  });
});
