/**
 * Chat orchestrator: one function that turns a student message into a streamed answer.
 *
 *  - Engine "llm": provider-neutral tool loop (bounded: ≤5 model rounds, ≤8 tool calls per turn).
 *  - Engine "basic": deterministic intent router that calls the same tools and renders the
 *    results with localised templates. Used when no LLM is configured or the "ai.llm" flag is off,
 *    and as the fallback when the provider is down. The UI labels which engine answered.
 *
 * Persistence: the user message is stored before generation; the assistant message is stored
 * once at the end with its tool calls, citations, engine, prompt version and status
 * (complete / stopped / error).
 */
import "server-only";
import { getProvider } from "./providers";
import { LlmError, type LlmMessage, type ToolSpec, type TurnResult } from "./providers/types";
import { TOOLS, TOOL_BY_NAME } from "./tools";
import { jsonSchemaFor, runTool, type ToolContext } from "./tools/registry";
import { CHAT_SYSTEM, contextBlock, type StudentContext } from "./prompts";
import { PROMPT_VERSIONS } from "./config";
import { recordUsage } from "./usage";
import { renderBasic, detectIntent } from "./basic";
import { isEnabled } from "../flags";
import { addMessage, getConversation, type Message, type ToolCallRecord } from "../repo/conversations";
import { getProfile } from "../repo/profile";
import { getPassport, pendingSuggestions } from "../repo/skills";
import { listExperiences } from "../repo/experiences";
import { getActivePlan } from "../repo/plans";
import { getOpportunity } from "../repo/opportunities";
import { pick } from "@/i18n/config";
import { SKILLS } from "../domain/catalog";
import { translator } from "@/i18n/messages";
import type { SessionUser } from "../auth/session";
import { log } from "../log";

export type ChatEvent =
  | { type: "meta"; conversationId: string; engine: "llm" | "basic" }
  | { type: "text"; delta: string }
  | { type: "tool_start"; id: string; name: string }
  | { type: "tool_end"; id: string; name: string; ok: boolean; output: unknown; ms: number }
  | { type: "citations"; citations: Citation[] }
  | { type: "followups"; items: string[] }
  | { type: "done"; message: Message }
  | { type: "error"; code: string };

export interface Citation { n: number; title: string; source: string; url: string | null; status: string; verified_at: string | null }

const MAX_ROUNDS = 5;
const MAX_TOOL_CALLS = 8;
const HISTORY_MESSAGES = 16;

export async function buildStudentContext(user: SessionUser): Promise<StudentContext> {
  const [profile, passport, pending, exps, plan] = await Promise.all([
    getProfile(user.id), getPassport(user.id), pendingSuggestions(user.id), listExperiences(user.id), getActivePlan(user.id),
  ]);
  let target: StudentContext["target_role"] = null;
  if (profile.target_opportunity_id) {
    try {
      const o = await getOpportunity(profile.target_opportunity_id);
      target = { opportunity_id: o.id, title: pick(o.title, user.locale), data_status: o.is_sample ? "demo" : o.verification_status };
    } catch { target = null; }
  }
  return {
    first_name: user.name.split(/\s+/)[0].slice(0, 40),
    interface_language: { ar: "Modern Standard Arabic", ary: "Moroccan Darija (Arabic script)", fr: "French", en: "English", zgh: "Tamazight (Tifinagh)" }[user.locale],
    situation: profile.situation, field_of_study: profile.field_of_study, education_level: profile.education_level, city: profile.city,
    languages: profile.languages, goal: profile.goal?.slice(0, 300) ?? null, target_role: target,
    passport: passport.map((s) => ({ skill: pick(SKILLS.find((x) => x.id === s.skill_id)?.names, user.locale) || s.skill_id, status: s.status, evidence: s.evidence.length })),
    pending_suggestions: pending.length,
    experiences: exps.length,
    plan: plan ? { title: plan.title, done: plan.tasks.filter((t) => t.completed_at).length, total: plan.tasks.length, next_task: plan.tasks.find((t) => !t.completed_at)?.title ?? null } : null,
    today: new Date().toISOString().slice(0, 10),
  };
}

function historyToLlm(messages: Message[]): LlmMessage[] {
  const recent = messages.filter((m) => m.status !== "error" && m.content.trim()).slice(-HISTORY_MESSAGES);
  return recent.map((m) => (m.role === "user" ? { role: "user" as const, parts: [{ type: "text" as const, text: m.content.slice(0, 6000) }] } : { role: "assistant" as const, text: m.content.slice(0, 6000) }));
}

/** Follow-up suggestions derived from what happened in the turn (deterministic, localised). */
function followupsFor(toolNames: string[], locale: SessionUser["locale"]): string[] {
  const t = translator(locale);
  const out: string[] = [];
  const has = (n: string) => toolNames.includes(n);
  if (has("analyze_skills")) out.push(t("chat.follow.review_passport"), t("chat.follow.match"));
  if (has("match_opportunities") || has("discover_careers")) out.push(t("chat.follow.gap"), t("chat.follow.compare"));
  if (has("analyze_skill_gap")) out.push(t("chat.follow.plan"), t("chat.follow.resources"));
  if (has("create_learning_roadmap")) out.push(t("chat.follow.interview"));
  if (has("interview_simulation")) out.push(t("chat.follow.next_question"));
  if (has("analyze_cv")) out.push(t("chat.follow.improve_profile"));
  if (!out.length) out.push(t("chat.follow.skills"), t("chat.follow.match"), t("chat.follow.progress"));
  return [...new Set(out)].slice(0, 3);
}

function summarizeOutput(name: string, output: unknown): unknown {
  // The full output goes to the model; the UI gets a bounded copy (cards render from it).
  const s = JSON.stringify(output ?? null);
  return s.length > 20_000 ? { truncated: true, name } : output;
}

export async function* runChat(opts: {
  user: SessionUser;
  conversationId: string;
  userText: string;
  signal: AbortSignal;
}): AsyncGenerator<ChatEvent> {
  const { user, conversationId, signal } = opts;
  const provider = (await isEnabled("ai.llm", user)) ? getProvider() : null;
  const engine: "llm" | "basic" = provider ? "llm" : "basic";
  yield { type: "meta", conversationId, engine };

  const toolCtx: ToolContext = { user, locale: user.locale, conversationId, allowLlm: !!provider, signal };
  const toolRecords: ToolCallRecord[] = [];
  const citations: Citation[] = [];
  let text = "";
  let status: Message["status"] = "complete";

  const collectCitations = (name: string, output: unknown) => {
    if (name !== "search_knowledge" || !output) return;
    const passages = (output as { passages?: Array<Citation & { text: string }> }).passages ?? [];
    for (const p of passages) if (!citations.some((c) => c.n === p.n && c.title === p.title)) citations.push({ n: p.n, title: p.title, source: p.source, url: p.url, status: p.status, verified_at: p.verified_at });
  };

  try {
    if (engine === "basic") {
      const intent = detectIntent(opts.userText);
      for (const call of intent.calls) {
        const tool = TOOL_BY_NAME.get(call.name)!;
        const id = `basic_${toolRecords.length + 1}`;
        yield { type: "tool_start", id, name: call.name };
        const r = await runTool(tool, call.input, toolCtx);
        toolRecords.push({ id, name: call.name, input: call.input, output: r.ok ? r.output : r.error, ok: r.ok, ms: r.ms });
        collectCitations(call.name, r.output);
        yield { type: "tool_end", id, name: call.name, ok: r.ok, output: summarizeOutput(call.name, r.ok ? r.output : r.error), ms: r.ms };
      }
      text = renderBasic(intent.kind, toolRecords, user.locale, opts.userText);
      yield { type: "text", delta: text };
    } else {
      const conv = await getConversation(user.id, conversationId);
      const history = historyToLlm(conv.messages.slice(0, -1)); // the last stored message is the current user turn
      const ctx = await buildStudentContext(user);
      const messages: LlmMessage[] = [...history, { role: "user", parts: [{ type: "text", text: contextBlock(ctx) }, { type: "text", text: opts.userText }] }];
      const tools: ToolSpec[] = TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: jsonSchemaFor(t) }));
      let calls = 0;
      for (let round = 0; round < MAX_ROUNDS; round++) {
        const t0 = Date.now();
        let result: TurnResult | null = null;
        try {
          for await (const ev of provider!.streamTurn({ task: "chat", system: CHAT_SYSTEM, messages, tools, signal })) {
            if (ev.type === "text") { text += ev.delta; yield { type: "text", delta: ev.delta }; }
            else result = ev.result;
          }
        } catch (e) {
          const code = e instanceof LlmError ? e.code : "unknown";
          await recordUsage({ userId: user.id, feature: "chat", engine: provider!.id, ok: false, latencyMs: Date.now() - t0, errorCode: code, promptVersion: PROMPT_VERSIONS.chat });
          throw e;
        }
        if (!result) break;
        await recordUsage({ userId: user.id, feature: "chat", engine: provider!.id, model: result.model, promptVersion: PROMPT_VERSIONS.chat, ...result.usage, ok: true, latencyMs: Date.now() - t0, errorCode: result.stopReason === "refusal" ? "refusal" : null });
        if (result.stopReason === "refusal") { status = "error"; break; }
        if (result.stopReason !== "tool_use" || !result.toolCalls.length) break;
        if (result.stopReason === "tool_use" && result.toolCalls.length && calls >= MAX_TOOL_CALLS) break;
        messages.push({ role: "assistant_raw", provider: provider!.id, raw: result.raw });
        const parts: LlmMessage & { role: "user" } = { role: "user", parts: [] };
        // Run this round's tool calls concurrently; return all results in one user message.
        for (const call of result.toolCalls) yield { type: "tool_start", id: call.id, name: call.name };
        const runs = await Promise.all(result.toolCalls.map(async (call) => {
          calls++;
          const tool = TOOL_BY_NAME.get(call.name);
          if (!tool || calls > MAX_TOOL_CALLS) return { call, r: { ok: false, output: null, error: { code: tool ? "limit" : "unknown_tool", message: tool ? "tool call limit reached for this turn" : "unknown tool" }, ms: 0 } };
          return { call, r: await runTool(tool, call.input, toolCtx) };
        }));
        for (const { call, r } of runs) {
          toolRecords.push({ id: call.id, name: call.name, input: call.input, output: r.ok ? r.output : r.error, ok: r.ok, ms: r.ms });
          collectCitations(call.name, r.output);
          yield { type: "tool_end", id: call.id, name: call.name, ok: r.ok, output: summarizeOutput(call.name, r.ok ? r.output : r.error), ms: r.ms };
          parts.parts.push({ type: "tool_result", toolUseId: call.id, content: JSON.stringify(r.ok ? r.output : { error: r.error }).slice(0, 30_000), isError: !r.ok });
        }
        messages.push(parts);
        if (text && !text.endsWith("\n")) { text += "\n\n"; yield { type: "text", delta: "\n\n" }; }
      }
    }
  } catch (e) {
    if (signal.aborted || (e instanceof LlmError && e.code === "cancelled")) status = "stopped";
    else {
      log.warn("chat.failed", { conv: conversationId, err: e });
      status = "error";
      yield { type: "error", code: e instanceof LlmError ? e.code : "internal" };
    }
  }

  // Only show sources that the answer actually used: the passages rendered by the basic engine
  // (top 3), or the [n] markers the model wrote.
  const used = engine === "basic"
    ? citations.filter((c) => c.n <= 3)
    : citations.filter((c) => new RegExp(`\\[${c.n}\\]`).test(text));
  citations.splice(0, citations.length, ...used);
  if (citations.length) yield { type: "citations", citations };
  const followups = status === "complete" ? followupsFor(toolRecords.map((r) => r.name), user.locale) : [];
  if (followups.length) yield { type: "followups", items: followups };
  const saved = await addMessage(user.id, conversationId, {
    role: "assistant", content: text.trim(), tool_calls: toolRecords, status, engine: engine === "llm" ? (process.env.AI_MODEL_CHAT ?? process.env.AI_MODEL ?? "claude-opus-5-5") : "basic",
  });
  await import("../db").then(({ asUser }) =>
    asUser(user.id, (tx) => tx.query(`UPDATE messages SET citations = $2, prompt_version = $3 WHERE id = $1`, [saved.id, JSON.stringify(citations), engine === "llm" ? PROMPT_VERSIONS.chat : "basic"])),
  );
  yield { type: "done", message: { ...saved, content: text.trim() } };
}
