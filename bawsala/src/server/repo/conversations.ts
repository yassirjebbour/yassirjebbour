import "server-only";
import { asUser } from "../db";
import { ApiError } from "../http/errors";

export interface Conversation { id: string; title: string; created_at: Date; updated_at: Date }
export interface ToolCallRecord { id: string; name: string; input: unknown; output: unknown; ok: boolean; ms?: number }
export interface Message {
  id: string; role: "user" | "assistant"; content: string; tool_calls: ToolCallRecord[]; status: "complete" | "stopped" | "error";
  feedback: -1 | 1 | null; engine: string | null; created_at: Date;
}

export const listConversations = (userId: string, q?: string) =>
  asUser(userId, (tx) =>
    q && q.trim()
      ? tx.query<Conversation>(
          `SELECT c.id, c.title, c.created_at, c.updated_at FROM conversations c
            WHERE c.user_id = $1 AND (c.title ILIKE $2 OR EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.id AND m.content ILIKE $2))
            ORDER BY c.updated_at DESC LIMIT 100`,
          [userId, `%${q.trim().replace(/[%_\\]/g, (m) => "\\" + m)}%`],
        )
      : tx.query<Conversation>(`SELECT id, title, created_at, updated_at FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 100`, [userId]),
  );

export async function getConversation(userId: string, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("not_found");
  const conv = await asUser(userId, (tx) => tx.one<Conversation>(`SELECT id, title, created_at, updated_at FROM conversations WHERE id = $1`, [id]));
  if (!conv) throw new ApiError("not_found");
  const messages = await asUser(userId, (tx) =>
    tx.query<Message>(`SELECT id, role, content, tool_calls, status, feedback, engine, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at, id`, [id]),
  );
  return { conversation: conv, messages };
}

export const createConversation = (userId: string, title: string) =>
  asUser(userId, (tx) => tx.one<Conversation>(`INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id, title, created_at, updated_at`, [userId, title.slice(0, 160)])).then((r) => r!);

export async function renameConversation(userId: string, id: string, title: string) {
  const rows = await asUser(userId, (tx) => tx.query(`UPDATE conversations SET title = $2 WHERE id = $1 RETURNING id`, [id, title.slice(0, 160)]));
  if (!rows.length) throw new ApiError("not_found");
}

export async function deleteConversation(userId: string, id: string) {
  const rows = await asUser(userId, (tx) => tx.query(`DELETE FROM conversations WHERE id = $1 RETURNING id`, [id]));
  if (!rows.length) throw new ApiError("not_found");
}

export async function addMessage(userId: string, conversationId: string, m: Pick<Message, "role" | "content"> & Partial<Pick<Message, "tool_calls" | "status" | "engine">>) {
  return asUser(userId, async (tx) => {
    const row = await tx.one<Message>(
      `INSERT INTO messages (conversation_id, user_id, role, content, tool_calls, status, engine) VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, role, content, tool_calls, status, feedback, engine, created_at`,
      [conversationId, userId, m.role, m.content, JSON.stringify(m.tool_calls ?? []), m.status ?? "complete", m.engine ?? null],
    );
    await tx.query(`UPDATE conversations SET updated_at = now() WHERE id = $1`, [conversationId]);
    return row!;
  });
}

/** Removes the last assistant message (for "regenerate"); returns the last user message text. */
export async function popLastAssistant(userId: string, conversationId: string) {
  return asUser(userId, async (tx) => {
    const last = await tx.one<{ id: string; role: string }>(`SELECT id, role FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`, [conversationId]);
    if (last?.role === "assistant") await tx.query(`DELETE FROM messages WHERE id = $1`, [last.id]);
    const user = await tx.one<{ content: string }>(`SELECT content FROM messages WHERE conversation_id = $1 AND role = 'user' ORDER BY created_at DESC, id DESC LIMIT 1`, [conversationId]);
    if (!user) throw new ApiError("bad_request", "nothing_to_regenerate");
    return user.content;
  });
}

export async function setFeedback(userId: string, messageId: string, value: -1 | 1 | null) {
  const rows = await asUser(userId, (tx) => tx.query(`UPDATE messages SET feedback = $2 WHERE id = $1 AND role = 'assistant' RETURNING id`, [messageId, value]));
  if (!rows.length) throw new ApiError("not_found");
}

export async function messagesToday(userId: string) {
  const r = await asUser(userId, (tx) => tx.one<{ n: number }>(`SELECT count(*)::int n FROM messages WHERE user_id = $1 AND role = 'user' AND created_at > now() - interval '24 hours'`, [userId]));
  return r?.n ?? 0;
}

// ---- confirmations for actions proposed by the assistant ----
export interface PendingAction { id: string; kind: string; payload: unknown; status: string; created_at: Date }

export const createPendingAction = (userId: string, conversationId: string | null, kind: string, payload: unknown) =>
  asUser(userId, (tx) =>
    tx.one<PendingAction>(`INSERT INTO pending_actions (user_id, conversation_id, kind, payload) VALUES ($1,$2,$3,$4) RETURNING id, kind, payload, status, created_at`, [userId, conversationId, kind, JSON.stringify(payload)]),
  ).then((r) => r!);

export async function takePendingAction(userId: string, id: string, decision: "confirmed" | "cancelled") {
  const row = await asUser(userId, (tx) =>
    tx.one<PendingAction>(`UPDATE pending_actions SET status = $2, resolved_at = now() WHERE id = $1 AND status = 'pending' AND created_at > now() - interval '7 days' RETURNING id, kind, payload, status, created_at`, [id, decision]),
  );
  if (!row) throw new ApiError("not_found", "action_expired_or_done");
  return row;
}
