"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, useErrorMessage, useToast } from "../ui";
import { Markdown } from "./markdown";
import { IconCopy, IconPlus, IconRefresh, IconSend, IconStop, IconThumbDown, IconThumbUp, IconTrash, IconMenu, IconSearch } from "../icons";

type ToolCall = { id: string; name: string; ok?: boolean; output?: unknown; running?: boolean };
type Citation = { n: number; title: string; source: string; url: string | null; status: string; verified_at: string | null };
type Msg = {
  id: string; role: "user" | "assistant"; content: string; status?: "complete" | "stopped" | "error" | "streaming";
  tool_calls?: ToolCall[]; citations?: Citation[]; feedback?: -1 | 1 | null; engine?: string | null; followups?: string[];
};
type Conv = { id: string; title: string; updated_at: string };

const PROMPTS = ["skills", "match", "gap", "plan", "cv", "interview", "anapec", "progress"] as const;

export function Chat({ conversations, conversation, messages, userName, engine, initialMessage }: {
  conversations: Conv[]; conversation: { id: string; title: string } | null; messages: Msg[]; userName: string; engine: "llm" | "basic"; initialMessage: string | null;
}) {
  const { t } = useI18n();
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

  return (
    <div className="chat">
      <aside className={`chat-side ${sideOpen ? "open" : ""}`} aria-label={t("assistant.history")}>
        <Link href="/app/assistant" className="btn btn-primary" onClick={() => setSideOpen(false)}><IconPlus width={18} height={18} />{t("assistant.new_chat")}</Link>
        <label className="row" style={{ gap: 6, flexWrap: "nowrap" }}><IconSearch width={18} height={18} aria-hidden="true" /><span className="sr-only">{t("assistant.search_ph")}</span>
          <input className="input" style={{ minHeight: 38 }} placeholder={t("assistant.search_ph")} value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <nav className="conv-list" aria-label={t("assistant.history")}>
          {convs.length === 0 ? <p className="small muted">{t("assistant.no_conversations")}</p> : convs.map((c) => (
            <div key={c.id} className="row" style={{ flexWrap: "nowrap", gap: 0 }}>
              <Link href={`/app/assistant/${c.id}`} className="conv" aria-current={c.id === convId ? "page" : undefined} style={{ flex: 1, minWidth: 0 }}><span>{c.title || "…"}</span></Link>
              <button className="btn btn-ghost btn-icon" style={{ minHeight: 32, minWidth: 32 }} onClick={() => rename(c)} aria-label={`${t("assistant.rename")}: ${c.title}`} title={t("assistant.rename")}>✎</button>
              <button className="btn btn-ghost btn-icon" style={{ minHeight: 32, minWidth: 32 }} onClick={() => remove(c)} aria-label={`${t("common.delete")}: ${c.title}`} title={t("common.delete")}><IconTrash width={16} height={16} /></button>
            </div>
          ))}
        </nav>
      </aside>

      <section className="chat-main" aria-label={t("assistant.title")}>
        <div className="row-between" style={{ padding: "8px 12px", borderBottom: "1px solid var(--line)" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setSideOpen((v) => !v)} aria-expanded={sideOpen} style={{ visibility: "visible" }}><IconMenu width={18} height={18} />{t("assistant.history")}</button>
          <span className={`badge wrap ${engine === "llm" ? "b-inferred" : "b-unverified"}`}>{engine === "llm" ? t("assistant.engine_llm") : t("assistant.engine_basic")}</span>
        </div>
        <div className="chat-scroll" ref={scrollRef} aria-live="polite" aria-busy={streaming}>
          {msgs.length === 0 ? (
            <div className="msg stack" style={{ marginTop: "auto", marginBottom: "auto" }}>
              <h1 style={{ fontSize: 22 }}>{t("assistant.welcome_title", { name: userName })}</h1>
              <p className="muted">{t("assistant.welcome_sub")}</p>
              <div className="prompt-grid">
                {PROMPTS.map((p) => <button key={p} className="btn btn-secondary" onClick={() => send(t(`assistant.prompts.${p}`))}>{t(`assistant.prompts.${p}`)}</button>)}
              </div>
            </div>
          ) : msgs.map((m) => (
            <div key={m.id} className={`msg ${m.role === "user" ? "msg-user" : ""}`}>
              {m.role === "user" ? <div className="bubble">{m.content}</div> : (
                <>
                  {m.tool_calls?.length ? (
                    <div className="msg-tools">
                      {m.tool_calls.map((c) => (
                        <span key={c.id} className={`tool-pill ${c.running ? "" : c.ok ? "ok" : "fail"}`}>
                          {c.running ? <span className="spin" style={{ width: 12, height: 12 }} /> : null}
                          {(c.running ? t("assistant.tool_running", { tool: t(`assistant.tools.${c.name}` as never) }) : c.ok ? t("assistant.tool_done", { tool: t(`assistant.tools.${c.name}` as never) }) : t("assistant.tool_failed", { tool: t(`assistant.tools.${c.name}` as never) }))}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {m.tool_calls?.filter((c) => c.ok && c.name === "create_learning_roadmap").map((c) => <PlanActionCard key={c.id} output={c.output as PlanOut} />)}
                  {m.tool_calls?.some((c) => c.ok && c.name === "analyze_skills" && ((c.output as { new_suggestions?: number })?.new_suggestions ?? 0) > 0) ? (
                    <div className="action-card"><span>{t("assistant.suggestions_saved", { n: (m.tool_calls.find((c) => c.name === "analyze_skills")!.output as { new_suggestions: number }).new_suggestions })}</span><div><Link className="btn btn-primary btn-sm" href="/app/passport">{t("assistant.review")}</Link></div></div>
                  ) : null}
                  {m.content ? <Markdown>{m.content}</Markdown> : m.status === "streaming" ? <span className="typing" aria-label={t("common.loading")}><i /><i /><i /></span> : null}
                  {m.citations?.length ? (
                    <div className="cite"><strong>{t("assistant.sources")}</strong>
                      {m.citations.map((c) => (
                        <span key={c.n}>[{c.n}] {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer nofollow">{c.title}</a> : c.title} · <span className={`badge ${c.status === "verified" ? "b-verified-src" : "b-unverified"} badge-plain`}>{c.status === "verified" ? t("common.verified_source") : c.status === "editorial" ? "BAWSALA" : t("common.unverified_source")}</span></span>
                      ))}
                    </div>
                  ) : null}
                  {m.status === "stopped" ? <span className="small muted">{t("assistant.stopped")}</span> : null}
                  {m.status === "error" ? <div className="alert alert-err" role="alert"><span>{m.content && !m.content.startsWith(t("assistant.error")) ? t("assistant.error") : (m.content || t("assistant.error"))}</span>{m === lastAssistant && convId ? <Button size="sm" variant="secondary" onClick={regenerate}>{t("common.retry")}</Button> : null}</div> : null}
                  {m.status !== "streaming" && m.content ? (
                    <div className="msg-actions">
                      <button className="btn btn-ghost" onClick={() => { navigator.clipboard.writeText(m.content); toast(t("common.copied")); }} aria-label={t("assistant.copy")} title={t("assistant.copy")}><IconCopy width={16} height={16} /></button>
                      {m === lastAssistant ? <button className="btn btn-ghost" onClick={regenerate} disabled={streaming} aria-label={t("assistant.regenerate")} title={t("assistant.regenerate")}><IconRefresh width={16} height={16} /></button> : null}
                      <button className="btn btn-ghost" aria-pressed={m.feedback === 1} onClick={() => feedback(m, 1)} aria-label={t("assistant.good")} title={t("assistant.good")}><IconThumbUp width={16} height={16} /></button>
                      <button className="btn btn-ghost" aria-pressed={m.feedback === -1} onClick={() => feedback(m, -1)} aria-label={t("assistant.bad")} title={t("assistant.bad")}><IconThumbDown width={16} height={16} /></button>
                    </div>
                  ) : null}
                  {m === lastAssistant && m.followups?.length && !streaming ? <div className="chips">{m.followups.map((f) => <button key={f} className="chip" onClick={() => send(f)}>{f}</button>)}</div> : null}
                </>
              )}
            </div>
          ))}
        </div>
        <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="composer" className="sr-only">{t("assistant.placeholder")}</label>
          <textarea id="composer" className="textarea" rows={1} value={input} placeholder={t("assistant.placeholder")} maxLength={12000}
            onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(200, e.target.scrollHeight) + "px"; }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(input); } }} />
          {streaming ? <Button type="button" variant="secondary" onClick={stop} aria-label={t("assistant.stop")}><IconStop width={18} height={18} />{t("assistant.stop")}</Button>
            : <Button type="submit" disabled={!input.trim()} aria-label={t("assistant.send")}><IconSend width={18} height={18} /></Button>}
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
    <div className="action-card" role="group" aria-label={t("assistant.action_plan_title", { title: output.title })}>
      <strong>{t("assistant.action_plan_title", { title: output.title })}</strong>
      <span className="small">{t("assistant.action_plan_body", { n: output.tasks.length, days: output.days })}</span>
      <ol className="small" style={{ margin: 0, paddingInlineStart: 20 }}>{output.tasks.slice(0, 5).map((x, i) => <li key={i}>{x.title}</li>)}</ol>
      {state === "pending" ? (
        <div className="row"><Button size="sm" onClick={() => decide("confirm")} loading={busy}>{t("assistant.action_confirm")}</Button><Button size="sm" variant="ghost" onClick={() => decide("cancel")} disabled={busy}>{t("assistant.action_cancel")}</Button></div>
      ) : state === "confirmed" ? <div className="row"><span className="badge b-inferred">{t("assistant.action_done")}</span><Link href="/app/plan" className="small">{t("nav.plan")}</Link></div> : <span className="badge b-unverified">{t("assistant.action_cancelled")}</span>}
    </div>
  );
}
