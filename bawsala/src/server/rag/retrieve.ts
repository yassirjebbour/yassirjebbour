/**
 * Hybrid retrieval over the knowledge base.
 *
 *   1. Query variants: the raw query, plus an Arabic-script transliteration when the query looks
 *      like Latin-script Darija (Arabizi).
 *   2. Vector search (pgvector HNSW, cosine) for each variant.
 *   3. Keyword search: Postgres full-text (simple config, normalised text) + trigram similarity.
 *   4. Reciprocal Rank Fusion (k=60) merges the lists; small boosts for verified sources.
 *   5. Results carry the document's source, date and verification status for attribution.
 * A cross-encoder reranker was evaluated and not adopted at this corpus size — see RAG_PIPELINE.md.
 */
import { createHash } from "node:crypto";
import { asPublic, asSystem } from "../db";
import { getEmbedder, toPgVector } from "./embedder";
import { arabiziToArabic, looksArabizi, normalizeForSearch, guessLanguage, STOPWORDS } from "./text";
import { log } from "../log";

export interface RetrievedChunk {
  chunkId: string; content: string; heading: string | null; score: number;
  vectorRank: number | null; keywordRank: number | null;
  doc: { slug: string; title: string; kind: string; language: string; sourceName: string; sourceUrl: string | null; verificationStatus: string; verifiedAt: string | null; publishedAt: string | null; version: number };
}
export interface RetrievalResult { mode: "hybrid" | "keyword" | "vector"; results: RetrievedChunk[]; variants: string[]; latencyMs: number; embedder: string | null }

const RRF_K = 60;
/** Channel weights for Reciprocal Rank Fusion. Chosen by the retrieval evaluation (docs/AI_EVALUATION_REPORT.md):
 *  semantic ranking is the primary signal; keyword search adds exact names (ANAPEC, Excel) and Arabizi recall. */
export const RRF_WEIGHTS = { vector: 1, keyword: 1 };

export type RetrievalMode = "hybrid" | "vector" | "keyword";

export async function retrieve(query: string, opts: { k?: number; kinds?: string[]; userId?: string | null; log?: boolean; mode?: RetrievalMode; weights?: { vector: number; keyword: number }; stopwords?: boolean } = {}): Promise<RetrievalResult> {
  const t0 = Date.now();
  const k = Math.min(opts.k ?? 6, 20);
  const q = query.trim().slice(0, 500);
  const variants = [q];
  if (looksArabizi(q)) variants.push(arabiziToArabic(q));
  const kinds = opts.kinds?.length ? opts.kinds : null;
  const wantVector = opts.mode !== "keyword";
  const wantKeyword = opts.mode !== "vector";
  const embedder = wantVector ? getEmbedder() : null;
  const weights = opts.weights ?? RRF_WEIGHTS;
  const useStop = opts.stopwords !== false;

  const ranks = new Map<string, { v: number | null; kw: number | null }>();
  const touch = (id: string) => { if (!ranks.has(id)) ranks.set(id, { v: null, kw: null }); return ranks.get(id)!; };

  await asPublic(async (tx) => {
    if (embedder) {
      const vecs = await embedder.embed(variants, "query");
      for (const v of vecs) {
        const rows = await tx.query<{ id: string }>(
          `SELECT c.id FROM kb_chunks c JOIN kb_documents d ON d.id = c.document_id
            WHERE d.status = 'active' AND c.embedding IS NOT NULL AND c.embedding_model = $3 AND ($2::text[] IS NULL OR d.kind = ANY($2))
            ORDER BY c.embedding <=> $1::vector LIMIT 20`,
          [toPgVector(v), kinds, embedder.id],
        );
        rows.forEach((r, i) => { const e = touch(r.id); e.v = e.v === null ? i + 1 : Math.min(e.v, i + 1); });
      }
    }
    for (const variant of wantKeyword ? variants : []) {
      const norm = normalizeForSearch(variant);
      if (!norm) continue;
      const terms = norm.split(" ").filter((w) => w.length > 1 && (!useStop || !STOPWORDS.has(w))).slice(0, 12);
      if (!terms.length) continue;
      const rows = await tx.query<{ id: string }>(
        `SELECT c.id, ts_rank(c.tsv, to_tsquery('simple', $1)) + similarity(c.search_text, $2) AS s
           FROM kb_chunks c JOIN kb_documents d ON d.id = c.document_id
          WHERE d.status = 'active' AND ($3::text[] IS NULL OR d.kind = ANY($3))
            AND (c.tsv @@ to_tsquery('simple', $1) OR c.search_text % $2)
          ORDER BY s DESC LIMIT 20`,
        [terms.map((t) => t.replace(/[':&|!()<>*\\]/g, "") + ":*").filter((t) => t.length > 2).join(" | ") || "zzzz", terms.join(" ") || norm, kinds],
      );
      rows.forEach((r, i) => { const e = touch(r.id); e.kw = e.kw === null ? i + 1 : Math.min(e.kw, i + 1); });
    }
  });

  const scored = [...ranks.entries()].map(([id, r]) => ({ id, v: r.v, kw: r.kw, score: (r.v ? weights.vector / (RRF_K + r.v) : 0) + (r.kw ? weights.keyword / (RRF_K + r.kw) : 0) }));
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, k);
  let results: RetrievedChunk[] = [];
  if (top.length) {
    const rows = await asPublic((tx) =>
      tx.query<{ id: string; content: string; heading: string | null; slug: string; title: string; kind: string; language: string; source_name: string; source_url: string | null; verification_status: string; verified_at: string | null; published_at: string | null; version: number }>(
        `SELECT c.id, c.content, c.heading, d.slug, d.title, d.kind, d.language, d.source_name, d.source_url, d.verification_status,
                to_char(d.verified_at,'YYYY-MM-DD') verified_at, to_char(d.published_at,'YYYY-MM-DD') published_at, d.version
           FROM kb_chunks c JOIN kb_documents d ON d.id = c.document_id WHERE c.id = ANY($1::uuid[])`,
        [top.map((t) => t.id)],
      ),
    );
    const byId = new Map(rows.map((r) => [r.id, r]));
    results = top.flatMap((t) => {
      const r = byId.get(t.id);
      if (!r) return [];
      const boost = r.verification_status === "verified" ? 1.05 : 1;
      return [{
        chunkId: r.id, content: r.content, heading: r.heading, score: Number((t.score * boost).toFixed(5)), vectorRank: t.v, keywordRank: t.kw,
        doc: { slug: r.slug, title: r.title, kind: r.kind, language: r.language, sourceName: r.source_name, sourceUrl: r.source_url, verificationStatus: r.verification_status, verifiedAt: r.verified_at, publishedAt: r.published_at, version: r.version },
      }];
    });
    results.sort((a, b) => b.score - a.score);
  }
  const latencyMs = Date.now() - t0;
  const out: RetrievalResult = { mode: embedder && wantKeyword ? "hybrid" : embedder ? "vector" : "keyword", results, variants, latencyMs, embedder: embedder?.id ?? null };
  if (opts.log !== false) {
    const qh = createHash("sha256").update(q).digest("hex").slice(0, 16);
    asSystem((tx) => tx.query(`INSERT INTO retrieval_log (user_id, query_hash, query_lang, mode, results, latency_ms) VALUES ($1,$2,$3,$4,$5,$6)`, [
      opts.userId ?? null, qh, guessLanguage(q), out.mode,
      JSON.stringify(results.map((r) => ({ chunk: r.chunkId, doc: r.doc.slug, v: r.vectorRank, kw: r.keywordRank, s: r.score }))), latencyMs,
    ])).catch((e) => log.warn("retrieval_log.failed", { err: e }));
  }
  return out;
}
