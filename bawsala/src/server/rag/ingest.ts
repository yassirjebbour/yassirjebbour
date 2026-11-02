/**
 * Knowledge-base ingestion: parse → normalise → chunk → embed → index, with versioning.
 * Re-ingesting unchanged content is a no-op (content hash). Changed content bumps `version`
 * and replaces the chunks atomically. Deleting a document cascades to its chunks.
 */
import { createHash } from "node:crypto";
import { chunkMarkdown } from "./chunker";
import { getEmbedder, toPgVector } from "./embedder";
import { normalizeForSearch } from "./text";
import type { Tx } from "../db";

export interface KbMeta {
  slug: string; title: string; kind: string; language: string; geography?: string;
  source_name: string; source_url?: string | null; license?: string | null;
  published_at?: string | null; verified_at?: string | null;
  verification_status: "verified" | "unverified" | "editorial"; confidence?: "high" | "medium" | "low";
}

/** Front matter: a leading block of `key: value` lines between `---` fences. */
export function parseKbFile(raw: string): { meta: Record<string, string>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw.replace(/\r\n/g, "\n"));
  if (!m) throw new Error("missing front matter");
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line.trim());
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: m[2].trim() };
}

/** Strips anything that is not plain prose: HTML tags, scripts, control characters. */
export function sanitizeDocument(s: string) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F​-‏‪-‮⁦-⁩]/g, "")
    .slice(0, 200_000);
}

export async function ingestDocument(tx: Tx, meta: KbMeta, rawBody: string, opts: { force?: boolean; actorId?: string | null } = {}) {
  const body = sanitizeDocument(rawBody);
  const hash = createHash("sha256").update(JSON.stringify(meta) + "\n" + body).digest("hex");
  const existing = await tx.one<{ id: string; content_hash: string; version: number }>(`SELECT id, content_hash, version FROM kb_documents WHERE slug = $1`, [meta.slug]);
  if (existing && existing.content_hash === hash && !opts.force) return { id: existing.id, changed: false, chunks: 0 };

  const embedder = getEmbedder();
  const chunks = chunkMarkdown(body, { title: meta.title });
  const vectors = embedder ? await embedder.embed(chunks.map((c) => (c.heading ? c.heading + "\n" : "") + c.content), "passage") : null;

  const vals = [meta.slug, meta.title, meta.kind, meta.language, meta.geography ?? "MA", meta.source_name, meta.source_url || null, meta.license || null,
    meta.published_at || null, meta.verified_at || null, meta.verification_status, meta.confidence ?? "medium", hash, body];
  let id: string;
  if (existing) {
    await tx.query(
      `UPDATE kb_documents SET title=$2, kind=$3, language=$4, geography=$5, source_name=$6, source_url=$7, license=$8, published_at=$9, verified_at=$10,
              verification_status=$11, confidence=$12, content_hash=$13, content=$14, version = version + 1, status = 'active' WHERE slug = $1`, vals);
    id = existing.id;
    await tx.query(`DELETE FROM kb_chunks WHERE document_id = $1`, [id]);
  } else {
    const r = await tx.one<{ id: string }>(
      `INSERT INTO kb_documents (slug, title, kind, language, geography, source_name, source_url, license, published_at, verified_at, verification_status, confidence, content_hash, content, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`, [...vals, opts.actorId ?? null]);
    id = r!.id;
  }
  for (const c of chunks) {
    await tx.query(
      `INSERT INTO kb_chunks (document_id, ord, heading, content, search_text, embedding, embedding_model) VALUES ($1,$2,$3,$4,$5,$6::vector,$7)`,
      [id, c.ord, c.heading, c.content, normalizeForSearch((c.heading ?? "") + " " + c.content), vectors ? toPgVector(vectors[c.ord]) : null, embedder?.id ?? null],
    );
  }
  return { id, changed: true, chunks: chunks.length };
}

export async function archiveDocument(tx: Tx, slug: string) {
  await tx.query(`UPDATE kb_documents SET status = 'archived' WHERE slug = $1`, [slug]);
}
export async function deleteDocument(tx: Tx, slug: string) {
  await tx.query(`DELETE FROM kb_documents WHERE slug = $1`, [slug]);
}
