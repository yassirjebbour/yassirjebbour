"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, useErrorMessage, useToast } from "../ui";
import { Markdown } from "./markdown";
import { CompassRose, StarField } from "../viz";
import { IconCopy, IconPlus, IconRefresh, IconSend, IconStop, IconThumbDown, IconThumbUp, IconTrash, IconMenu, IconSearch, IconSpark, IconCompass, IconPath, IconFile, IconBuilding, IconChat, IconCheck, IconX, IconExternal } from "../icons";
import { ITarget, IMic, IChart, IPencil, IArrow } from "./flow/icons";

type ToolCall = { id: string; name: string; ok?: boolean; output?: unknown; running?: boolean };
type Citation = { n: number; title: string; source: string; url: string | null; status: string; verified_at: string | null };
type Msg = {
  id: string; role: "user" | "assistant"; content: string; status?: "complete" | "stopped" | "error" | "streaming";
  tool_calls?: ToolCall[]; citations?: Citation[]; feedback?: -1 | 1 | null; engine?: string | null; followups?: string[];
};
type Conv = { id: string; title: string; updated_at: string };

const PROMPTS = ["skills", "match", "gap", "plan", "cv", "interview", "anapec", "progress"] as const;
const PROMPT_ICON = { skills: IconSpark, match: IconCompass, gap: ITarget, plan: IconPath, cv: IconFile, interview: IMic, anapec: IconBuilding, progress: IChart } as const;
const VISIBLE_STEPS = 3;

/** The assistant's mark: a small compass whose needle settles when it appears (spins while thinking). */
function Avatar({ thinking }: { thinking?: boolean }) {
  return (
    <span className={`msg-avatar ${thinking ? "is-thinking" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false"><circle cx="16" cy="16" r="11.5" className="av-ring" /><g className="av-needle"><path d="M16 6.5 18.6 16h-5.2z" className="av-n" /><path d="M16 25.5 13.4 16h5.2z" className="av-s" /></g><circle cx="16" cy="16" r="1.6" className="av-pin" /></svg>
    </span>
  );
}

export function Chat({ conversations, conversation, messages, userName, engine, initialMessage }: {
  conversations: Conv[]; conversation: { id: string; title: string } | null; messages: Msg[]; userName: string; engine: "llm" | "basic"; initialMessage: string | null;
}) {
  const { t, fmtDate } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [convs, setConvs] = useState(conversations);
  const [convId, setConvId] = useState<string | null>(conversation?.id ?? null);
  const [msgs, setMsgs] = useState<Msg[]>(messages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [q, setQ] = useState("");
  const [sideOpen, setSideOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentInitial = useRef(false);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [msgs]);
  useEffect(() => {
    if (initialMessage && !sentInitial.current) { sentInitial.current = true; send(initialMessage); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const id = setTimeout(async () => { try { setConvs(await api<Conv[]>(`/conversations${q ? `?q=${encodeURIComponent(q)}` : ""}`)); } catch { /* keep list */ } }, 250);
    return () => clearTimeout(id);
  }, [q]);
  useEffect(() => {
    if (!sideOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSideOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sideOpen]);

  function patchLast(fn: (m: Msg) => Msg) {
    setMsgs((list) => { const copy = [...list]; copy[copy.length - 1] = fn(copy[copy.length - 1]); return copy; });
  }

  async function stream(body: Record<string, unknown>) {
    setStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setMsgs((l) => [...l, { id: `tmp-a-${Date.now()}`, role: "assistant", content: "", status: "streaming", tool_calls: [] }]);
    try {
      const res = await fetch("/api/v1/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        const code = j?.error?.message ?? j?.error?.code ?? "internal";
        patchLast((m) => ({ ...m, status: "error", content: code === "daily_limit" ? t("assistant.error_quota") : code === "assistant_disabled" ? t("assistant.error_disabled") : t("assistant.error") }));
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n\n")) >= 0) {
          const line = buf.slice(0, idx).replace(/^data: /, "");
          buf = buf.slice(idx + 2);
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "meta" && !convId) { setConvId(ev.conversationId); window.history.replaceState(null, "", `/app/assistant/${ev.conversationId}`); }
          else if (ev.type === "text") patchLast((m) => ({ ...m, content: m.content + ev.delta }));
          else if (ev.type === "tool_start") patchLast((m) => ({ ...m, tool_calls: [...(m.tool_calls ?? []), { id: ev.id, name: ev.name, running: true }] }));
          else if (ev.type === "tool_end") patchLast((m) => ({ ...m, tool_calls: (m.tool_calls ?? []).map((c) => (c.id === ev.id ? { ...c, running: false, ok: ev.ok, output: ev.output } : c)) }));
          else if (ev.type === "citations") patchLast((m) => ({ ...m, citations: ev.citations }));
          else if (ev.type === "followups") patchLast((m) => ({ ...m, followups: ev.items }));
          else if (ev.type === "error") patchLast((m) => ({ ...m, status: "error" }));
          else if (ev.type === "done") patchLast((m) => ({ ...m, id: ev.message.id, status: ev.message.status === "complete" && m.status === "error" ? "error" : ev.message.status, engine: ev.message.engine, content: ev.message.content || m.content }));
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") patchLast((m) => ({ ...m, status: "stopped" }));
      else patchLast((m) => ({ ...m, status: "error" }));
    } finally {
      setStreaming(false);
      abortRef.current = null;
      api<Conv[]>("/conversations").then(setConvs).catch(() => {});
    }
  }

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || streaming) return;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "";
    setMsgs((l) => [...l, { id: `tmp-u-${Date.now()}`, role: "user", content: msg }]);
    await stream({ conversationId: convId, message: msg });
  }
  function stop() { abortRef.current?.abort(); }
  async function regenerate() {
    if (!convId || streaming) return;
    setMsgs((l) => (l[l.length - 1]?.role === "assistant" ? l.slice(0, -1) : l));
    await stream({ conversationId: convId, regenerate: true });
  }
  async function feedback(m: Msg, value: 1 | -1) {
    if (m.id.startsWith("tmp")) return;
    const next = m.feedback === value ? null : value;
    try { await api(`/messages/${m.id}/feedback`, { body: { value: next } }); setMsgs((l) => l.map((x) => (x.id === m.id ? { ...x, feedback: next } : x))); toast(t("assistant.thanks")); } catch (e) { toast(err(e)); }
  }
  async function rename(c: Conv) {
    const title = prompt(t("assistant.rename"), c.title)?.trim();
    if (!title) return;
    try { await api(`/conversations/${c.id}`, { method: "PATCH", body: { title } }); setConvs((l) => l.map((x) => (x.id === c.id ? { ...x, title } : x))); } catch (e) { toast(err(e)); }
  }
  async function remove(c: Conv) {
    if (!confirm(t("assistant.delete_confirm"))) return;
    try { await api(`/conversations/${c.id}`, { method: "DELETE" }); setConvs((l) => l.filter((x) => x.id !== c.id)); if (c.id === convId) router.push("/app/assistant"); } catch (e) { toast(err(e)); }
  }
  const lastAssistant = [...msgs].reverse().find((m) => m.role === "assistant");
  const toolLabel = (c: ToolCall) => {
    const tool = t(`assistant.tools.${c.name}` as never);
    return c.running ? t("assistant.tool_running", { tool }) : c.ok ? t("assistant.tool_done", { tool }) : t("assistant.tool_failed", { tool });
  };
  const step = (c: ToolCall) => (
    <li key={c.id} className={`tool-step ${c.running ? "run" : c.ok ? "ok" : "fail"}`}>
      <span className="ts-ic" aria-hidden="true">{c.running ? <span className="spin" /> : c.ok ? <IconCheck /> : <IconX />}</span>
      <span>{toolLabel(c)}</span>
    </li>
  );

  return (
    <div className="chat a-chat">
      {sideOpen ? <button type="button" className="chat-scrim only-mobile" aria-label={t("flow.a.close_history")} onClick={() => setSideOpen(false)} /> : null}
      <aside className={`chat-side ${sideOpen ? "open" : ""}`} aria-label={t("assistant.history")}>
        <div className="chat-side-head">
          <Link href="/app/assistant" className="btn btn-primary" onClick={() => setSideOpen(false)}><IconPlus width={18} height={18} />{t("assistant.new_chat")}</Link>
          <button type="button" className="btn btn-ghost btn-icon only-mobile" onClick={() => setSideOpen(false)} aria-label={t("flow.a.close_history")}><IconX width={20} height={20} /></button>
        </div>
        <label className="chat-search">
          <IconSearch width={17} height={17} aria-hidden="true" />
          <span className="sr-only">{t("assistant.search_ph")}</span>
          <input type="search" placeholder={t("assistant.search_ph")} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <nav className="conv-list" aria-label={t("assistant.history")}>
          {convs.length === 0 ? <p className="small muted conv-empty">{t("assistant.no_conversations")}</p> : convs.map((c) => (
            <div key={c.id} className={`conv-row ${c.id === convId ? "is-current" : ""}`}>
              <Link href={`/app/assistant/${c.id}`} className="conv" aria-current={c.id === convId ? "page" : undefined} onClick={() => setSideOpen(false)}>
                <IconChat width={16} height={16} aria-hidden="true" />
                <span className="conv-text"><span className="conv-title bidi">{c.title || "…"}</span><time className="conv-date" dateTime={c.updated_at}>{fmtDate(c.updated_at)}</time></span>
              </Link>
              <span className="conv-acts">
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => rename(c)} aria-label={`${t("assistant.rename")}: ${c.title}`} title={t("assistant.rename")}><IPencil width={16} height={16} /></button>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => remove(c)} aria-label={`${t("common.delete")}: ${c.title}`} title={t("common.delete")}><IconTrash width={16} height={16} /></button>
              </span>
            </div>
          ))}
        </nav>
      </aside>

      <section className="chat-main" aria-label={t("assistant.title")}>
        <header className="chat-head">
          <button type="button" className="btn btn-ghost btn-icon only-mobile" onClick={() => setSideOpen((v) => !v)} aria-expanded={sideOpen} aria-label={t("assistant.history")}><IconMenu width={20} height={20} /></button>
          <span className="chat-id"><Avatar thinking={streaming} /><strong>{t("assistant.title")}</strong></span>
          <span className={`badge wrap chat-engine ${engine === "llm" ? "b-inferred" : "b-unverified"}`}>{engine === "llm" ? t("assistant.engine_llm") : t("assistant.engine_basic")}</span>
        </header>
        <div className="chat-scroll" ref={scrollRef} aria-live="polite" aria-busy={streaming}>
          {msgs.length === 0 ? (
            <div className="a-empty">
              <div className="a-hero night">
                <StarField count={26} seed="assistant" />
                <div className="a-hero-rose" aria-hidden="true"><CompassRose /></div>
                <div className="a-hero-text">
                  <p className="eyebrow">{t("flow.a.kicker")}</p>
                  <h1>{t("assistant.welcome_title", { name: userName })}</h1>
                  <p className="a-hero-sub">{t("assistant.welcome_sub")}</p>
                </div>
              </div>
              {engine === "basic" ? <p className="a-basic small"><IconSpark width={16} height={16} aria-hidden="true" /><span>{t("flow.a.basic_note")}</span></p> : null}
              <p className="label a-try">{t("flow.a.try")}</p>
              <div className="prompt-grid a-prompts">
                {PROMPTS.map((p, i) => {
                  const Icon = PROMPT_ICON[p];
                  return (
                    <button key={p} type="button" className="a-prompt glow" style={{ "--i": i } as React.CSSProperties} onClick={() => send(t(`assistant.prompts.${p}`))}>
                      <span className="icon-tile" aria-hidden="true"><Icon /></span><span className="bidi">{t(`assistant.prompts.${p}`)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : msgs.map((m) => (
            m.role === "user" ? (
              <div key={m.id} className="msg msg-user"><div className="bubble">{m.content}</div></div>
            ) : (
              <div key={m.id} className="msg msg-ai">
                <Avatar thinking={m.status === "streaming"} />
                <div className={`msg-col ${m.status === "streaming" && m.content ? "is-streaming" : ""}`}>
                  {m.tool_calls?.length ? (
                    <ol className="tool-steps" aria-label={t("flow.a.steps")}>
                      {m.tool_calls.slice(0, VISIBLE_STEPS).map(step)}
                      {m.tool_calls.length > VISIBLE_STEPS ? (
                        <li className="tool-more"><details><summary>{t("flow.a.more_steps", { n: m.tool_calls.length - VISIBLE_STEPS })}</summary><ol className="tool-steps">{m.tool_calls.slice(VISIBLE_STEPS).map(step)}</ol></details></li>
                      ) : null}
                    </ol>
                  ) : null}
                  {m.tool_calls?.filter((c) => c.ok && c.name === "create_learning_roadmap").map((c) => <PlanActionCard key={c.id} output={c.output as PlanOut} />)}
                  {m.tool_calls?.some((c) => c.ok && c.name === "analyze_skills" && ((c.output as { new_suggestions?: number })?.new_suggestions ?? 0) > 0) ? (
                    <div className="action-card a-card">
                      <div className="a-card-head"><span className="icon-tile gold" aria-hidden="true"><IconSpark /></span><span>{t("assistant.suggestions_saved", { n: (m.tool_calls.find((c) => c.name === "analyze_skills")!.output as { new_suggestions: number }).new_suggestions })}</span></div>
                      <div><Link className="btn btn-primary btn-sm" href="/app/passport">{t("assistant.review")}<IArrow className="arrow" width={16} height={16} /></Link></div>
                    </div>
                  ) : null}
                  {m.content ? <Markdown>{m.content}</Markdown> : m.status === "streaming" ? (
                    <p className="a-thinking"><span>{t("flow.a.thinking")}</span><span className="typing" aria-hidden="true"><i /><i /><i /></span></p>
                  ) : null}
                  {m.citations?.length ? (
                    <div className="cite" role="group" aria-label={t("assistant.sources")}>
                      <p className="cite-h">{t("assistant.sources")}</p>
                      <ol className="cite-list">
                        {m.citations.map((c, i) => (
                          <li key={c.n} className="cite-card" style={{ "--i": i } as React.CSSProperties}>
                            <span className="cite-n" aria-label={t("flow.a.source", { n: c.n })}>{c.n}</span>
                            <span className="cite-body">
                              {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="cite-title bidi">{c.title}<IconExternal width={13} height={13} aria-hidden="true" /></a> : <span className="cite-title bidi">{c.title}</span>}
                              <span className="cite-meta"><span className="bidi">{c.source}</span><span className={`badge ${c.status === "verified" ? "b-verified-src" : "b-unverified"} badge-plain`}>{c.status === "verified" ? t("common.verified_source") : c.status === "editorial" ? "BAWSALA" : t("common.unverified_source")}</span></span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                  {m.status === "stopped" ? <span className="small muted">{t("assistant.stopped")}</span> : null}
                  {m.status === "error" ? <div className="alert alert-err" role="alert"><span>{m.content && !m.content.startsWith(t("assistant.error")) ? t("assistant.error") : (m.content || t("assistant.error"))}</span>{m === lastAssistant && convId ? <Button size="sm" variant="secondary" onClick={regenerate}>{t("common.retry")}</Button> : null}</div> : null}
                  {m.status !== "streaming" && m.content ? (
                    <div className="msg-actions">
                      <button type="button" className="btn btn-ghost" onClick={() => { navigator.clipboard.writeText(m.content).then(() => toast(t("common.copied"))).catch(() => {}); }} aria-label={t("assistant.copy")} title={t("assistant.copy")}><IconCopy width={16} height={16} /></button>
                      {m === lastAssistant ? <button type="button" className="btn btn-ghost" onClick={regenerate} disabled={streaming} aria-label={t("assistant.regenerate")} title={t("assistant.regenerate")}><IconRefresh width={16} height={16} /></button> : null}
                      <button type="button" className="btn btn-ghost" aria-pressed={m.feedback === 1} onClick={() => feedback(m, 1)} aria-label={t("assistant.good")} title={t("assistant.good")}><IconThumbUp width={16} height={16} /></button>
                      <button type="button" className="btn btn-ghost" aria-pressed={m.feedback === -1} onClick={() => feedback(m, -1)} aria-label={t("assistant.bad")} title={t("assistant.bad")}><IconThumbDown width={16} height={16} /></button>
                    </div>
                  ) : null}
                  {m === lastAssistant && m.followups?.length && !streaming ? (
                    <div className="a-follow">
                      <p className="small muted">{t("flow.a.followups")}</p>
                      <div className="chips">{m.followups.map((f) => <button key={f} type="button" className="chip" onClick={() => send(f)}><span className="bidi">{f}</span><IArrow className="arrow flip-rtl" width={14} height={14} /></button>)}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          ))}
        </div>
        <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <div className="composer-box">
            <label htmlFor="composer" className="sr-only">{t("assistant.placeholder")}</label>
            <textarea id="composer" ref={inputRef} className="textarea" rows={1} value={input} placeholder={t("assistant.placeholder")} maxLength={12000}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(200, e.target.scrollHeight) + "px"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(input); } }} />
            {streaming ? <Button type="button" variant="secondary" className="composer-send" onClick={stop} aria-label={t("assistant.stop")}><IconStop width={18} height={18} /></Button>
              : <Button type="submit" className="composer-send" disabled={!input.trim()} aria-label={t("assistant.send")}><IconSend width={18} height={18} className="flip-rtl" /></Button>}
          </div>
          <p className="composer-hint hide-mobile" aria-hidden="true">{t("flow.a.hint")}</p>
        </form>
      </section>
    </div>
  );
}

type PlanOut = { pending_action_id: string; title: string; days: number; tasks: Array<{ day: number; kind: string; title: string }> };

function PlanActionCard({ output }: { output: PlanOut }) {
  const { t } = useI18n();
  const toast = useToast();
  const err = useErrorMessage();
  const [state, setState] = useState<"pending" | "confirmed" | "cancelled">("pending");
  const [busy, setBusy] = useState(false);
  async function decide(decision: "confirm" | "cancel") {
    setBusy(true);
    try { await api(`/actions/${output.pending_action_id}`, { body: { decision } }); setState(decision === "confirm" ? "confirmed" : "cancelled"); }
    catch (e) { toast(err(e)); } finally { setBusy(false); }
  }
  if (!output?.pending_action_id) return null;
  return (
    <div className={`action-card a-plan is-${state}`} role="group" aria-label={t("assistant.action_plan_title", { title: output.title })}>
      <div className="a-card-head">
        <span className="icon-tile gold" aria-hidden="true"><IconPath /></span>
        <span className="stack-sm" style={{ gap: 2 }}><strong className="bidi">{t("assistant.action_plan_title", { title: output.title })}</strong><span className="small muted">{t("assistant.action_plan_body", { n: output.tasks.length, days: output.days })}</span></span>
      </div>
      <ol className="a-plan-days">
        {output.tasks.slice(0, 5).map((x, i) => <li key={i} style={{ "--i": i } as React.CSSProperties}><span className="a-day num">{t("flow.a.day", { n: x.day })}</span><span className="bidi">{x.title}</span></li>)}
      </ol>
      {state === "pending" ? (
        <div className="row"><Button size="sm" onClick={() => decide("confirm")} loading={busy}><IconCheck width={16} height={16} />{t("assistant.action_confirm")}</Button><Button size="sm" variant="ghost" onClick={() => decide("cancel")} disabled={busy}>{t("assistant.action_cancel")}</Button></div>
      ) : state === "confirmed" ? (
        <div className="row a-plan-done"><span className="a-done-mark" aria-hidden="true"><IconCheck /></span><span className="badge b-inferred">{t("assistant.action_done")}</span><Link href="/app/plan" className="btn btn-secondary btn-sm">{t("nav.plan")}<IArrow className="arrow" width={16} height={16} /></Link></div>
      ) : <span className="badge b-unverified">{t("assistant.action_cancelled")}</span>}
    </div>
  );
}
