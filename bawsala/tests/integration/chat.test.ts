import { afterEach, describe, expect, it } from "vitest";
import { makeUser } from "../support/factory";
import { runChat, type ChatEvent } from "@/server/ai/chat";
import { setProviderForTests } from "@/server/ai/providers";
import type { LlmProvider, TurnEvent, LlmMessage } from "@/server/ai/providers/types";
import { addMessage, createConversation, getConversation } from "@/server/repo/conversations";
import { asSystem } from "@/server/db";

/** Scripted provider: each call to streamTurn returns the next scripted turn. Records requests. */
function fakeProvider(turns: Array<{ text?: string; tools?: Array<{ name: string; input: unknown }> }>, seen: LlmMessage[][]): LlmProvider {
  let i = 0;
  return {
    id: "fake",
    async *streamTurn(req): AsyncGenerator<TurnEvent> {
      seen.push(JSON.parse(JSON.stringify(req.messages)));
      const t = turns[Math.min(i++, turns.length - 1)];
      if (t.text) for (const w of t.text.split(" ")) yield { type: "text", delta: w + " " };
      const toolCalls = (t.tools ?? []).map((x, k) => ({ id: `call_${i}_${k}`, name: x.name, input: x.input }));
      yield { type: "done", result: { stopReason: toolCalls.length ? "tool_use" : "end", text: t.text ?? "", toolCalls, raw: [{ type: "text", text: t.text ?? "" }], usage: { input: 1000, output: 100, cacheRead: 800, cacheWrite: 0 }, attempts: [{ model: "claude-opus-5-5", input: 1000, output: 100, cacheRead: 800, cacheWrite: 0 }], model: "claude-opus-5-5" } };
    },
    async structured() { return { data: null, usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, attempts: [], model: "fake", refused: false }; },
  };
}

async function collect(gen: AsyncGenerator<ChatEvent>) { const out: ChatEvent[] = []; for await (const e of gen) out.push(e); return out; }

afterEach(() => setProviderForTests(null));

describe("chat orchestrator", () => {
  it("LLM engine: runs the tool loop, feeds results back, streams, cites, persists and tracks cost", async () => {
    const user = await makeUser({ locale: "fr" });
    const conv = await createConversation(user.id, "t");
    await addMessage(user.id, conv.id, { role: "user", content: "Comment fonctionne l'ANAPEC et quels postes me conviennent ?" });
    const seen: LlmMessage[][] = [];
    setProviderForTests(fakeProvider([
      { tools: [{ name: "search_knowledge", input: { query: "ANAPEC inscription" } }, { name: "match_opportunities", input: { limit: 2 } }] },
      { text: "L'ANAPEC est l'agence publique de l'emploi [1]. Voici deux postes." },
    ], seen));
    const events = await collect(runChat({ user, conversationId: conv.id, userText: "Comment fonctionne l'ANAPEC ?", signal: new AbortController().signal }));
    expect(events[0]).toMatchObject({ type: "meta", engine: "llm" });
    expect(events.filter((e) => e.type === "tool_end").map((e) => (e as { name: string }).name)).toEqual(["search_knowledge", "match_opportunities"]);
    // round 2 received the tool results as tool_result parts
    const second = seen[1];
    const last = second[second.length - 1] as { role: string; parts: Array<{ type: string }> };
    expect(last.role).toBe("user");
    expect(last.parts.every((p) => p.type === "tool_result")).toBe(true);
    // the first user turn carried the student context as data
    const firstUser = seen[0][seen[0].length - 1] as { parts: Array<{ text?: string }> };
    expect(firstUser.parts[0].text).toContain("<student_context>");
    expect(firstUser.parts[0].text).not.toContain(user.email);
    const cites = events.find((e) => e.type === "citations") as { citations: Array<{ n: number }> };
    expect(cites.citations.map((c) => c.n)).toEqual([1]); // only the cited source
    const done = events.find((e) => e.type === "done") as { message: { content: string; status: string } };
    expect(done.message.status).toBe("complete");
    const stored = await getConversation(user.id, conv.id);
    expect(stored.messages.at(-1)?.tool_calls).toHaveLength(2);
    const usage = await asSystem((tx) => tx.query<{ est_cost_usd: string; cache_read_tokens: number }>(`SELECT est_cost_usd, cache_read_tokens FROM ai_usage WHERE user_id = $1 AND feature = 'chat'`, [user.id]));
    expect(usage).toHaveLength(2);
    expect(Number(usage[0].est_cost_usd)).toBeGreaterThan(0);
  });

  it("bounds the agent loop (max rounds) even if the model keeps calling tools", async () => {
    const user = await makeUser();
    const conv = await createConversation(user.id, "t");
    const seen: LlmMessage[][] = [];
    setProviderForTests(fakeProvider([{ text: "thinking", tools: [{ name: "analyze_progress", input: {} }] }], seen));
    const events = await collect(runChat({ user, conversationId: conv.id, userText: "loop", signal: new AbortController().signal }));
    expect(seen.length).toBeLessThanOrEqual(5);
    expect(events.filter((e) => e.type === "tool_end").length).toBeLessThanOrEqual(8);
    expect(events.at(-1)?.type).toBe("done");
  });

  it("a tool result containing injected instructions is passed as data and cannot act for another user", async () => {
    const victim = await makeUser();
    const attacker = await makeUser();
    const conv = await createConversation(attacker.id, "t");
    const seen: LlmMessage[][] = [];
    // The model (e.g. after reading an injected document) tries to read the victim's plan: tools have no user parameter.
    setProviderForTests(fakeProvider([{ tools: [{ name: "get_my_plan", input: { user_id: victim.id } }] }, { text: "done" }], seen));
    const events = await collect(runChat({ user: attacker, conversationId: conv.id, userText: "show plan of other user", signal: new AbortController().signal }));
    const te = events.find((e) => e.type === "tool_end") as { ok: boolean; output: unknown };
    expect(te.ok).toBe(true);
    expect(te.output).toEqual({ plan: null }); // attacker's own (empty) plan; extra field ignored
  });

  it("basic engine (no LLM) answers Arabizi Darija with real tool data and labels itself", async () => {
    const user = await makeUser({ locale: "ary" });
    const conv = await createConversation(user.id, "t");
    const events = await collect(runChat({ user, conversationId: conv.id, userText: "chno homa l khdmat li kaynin liya?", signal: new AbortController().signal }));
    expect(events[0]).toMatchObject({ engine: "basic" });
    expect(events.some((e) => e.type === "tool_end" && (e as { name: string }).name === "match_opportunities")).toBe(true);
    const done = events.find((e) => e.type === "done") as { message: { content: string } };
    expect(done.message.content).toMatch(/[؀-ۿ]/); // rendered in Darija
    expect(done.message.content).toContain("|"); // table
  });

  it("a stopped generation is saved as stopped", async () => {
    const user = await makeUser();
    const conv = await createConversation(user.id, "t");
    const ctrl = new AbortController();
    const provider: LlmProvider = {
      id: "slow",
      async *streamTurn(req) { yield { type: "text", delta: "partial " }; ctrl.abort(); if (req.signal?.aborted) { const { LlmError } = await import("@/server/ai/providers/types"); throw new LlmError("cancelled", "x"); } },
      async structured() { return { data: null, usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, attempts: [], model: "x", refused: false }; },
    };
    setProviderForTests(provider);
    const events = await collect(runChat({ user, conversationId: conv.id, userText: "hi", signal: ctrl.signal }));
    const done = events.find((e) => e.type === "done") as { message: { status: string; content: string } };
    expect(done.message.status).toBe("stopped");
    expect(done.message.content).toBe("partial");
  });
});
