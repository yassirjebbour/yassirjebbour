# BAWSALA — RAG pipeline

Retrieval is used where external or institutional facts are needed (labour-market figures, ANAPEC, OFPPT,
self-employment, CV/interview guidance, skill and role profiles). Calculations about the student (fit, gaps, plans)
never come from retrieval — they are deterministic code.

## Pipeline

```
kb/*.md (front matter: source, URL, licence, dates, verification status, confidence)
 + documents generated from the catalogue (26 skills, 12 role profiles)
   │ parseKbFile → sanitizeDocument (strip HTML/scripts/bidi controls, 200k chars max)
   │ chunkMarkdown (heading-aware, ≤900 chars, word-window split for long runs, heading path kept)
   │ normalizeForSearch (case, accents, Arabic diacritics, alef/ya/ta-marbuta) → search_text + tsvector
   │ embed("passage: …") with multilingual-e5-small (384-d, L2-normalised)
   ▼
kb_documents (versioned by content hash) / kb_chunks (HNSW cosine index, GIN full-text, GIN trigram)

query
   │ variants: original + Arabizi→Arabic-script transliteration when the query looks like Latin-script Darija
   │ vector search per variant (top 20)          ── pgvector `<=>`
   │ keyword search per variant (top 20)         ── to_tsquery('simple', prefix terms, stopwords removed) OR trigram
   │ Reciprocal Rank Fusion, k=60, weights vector 1 : keyword 1, small boost for verified sources
   ▼
top-k passages with document title, source, URL, verification status, dates, version → tool output → [n] citations
```

## Ingestion and lifecycle

- `npm run kb:ingest` (idempotent): unchanged documents are skipped by content hash; changed ones get `version+1` and
  their chunks replaced atomically; documents whose file disappeared are archived (never served).
- Admin UI (`/admin` → Knowledge base) can add/update a document from Markdown and archive it; hard delete is
  `DELETE /api/v1/admin/knowledge/:slug?hard=1`. All actions are audit-logged.
- Embedding model changes: `npm run kb:ingest -- --force`; each chunk stores `embedding_model`, and retrieval only
  compares vectors from the active model.
- Provenance rules (`kb/README.md`): `verified` only after a person checked the primary source on `verified_at`;
  `unverified` facts must be confirmed on the official site (the assistant says so); `editorial` = BAWSALA guidance.

## Current corpus (2026-11-02)

48 documents / 132 chunks: 26 skill profiles, 12 role profiles (editorial, low confidence on requirements), 3 guides
(interview/STAR, CV for Morocco, informal experience), 1 policy (passport states), 2 institutions (ANAPEC, OFPPT —
unverified), 1 programme (auto-entrepreneur — unverified, low confidence), 1 labour-market note (HCP Q2 2026 figures
transcribed from the founders' copy of the HCP note — unverified), 2 international references (ISCO/ESCO, Europass).
**No document is marked `verified` yet**: a person must check each against its primary source.

## Why these choices (evidence in `AI_EVALUATION_REPORT.md`)

| Choice | Evidence |
|---|---|
| Hybrid instead of vector-only | Vector-only recall@5 on Latin-script Darija 0.571 → hybrid 1.000 |
| Stopwords for keyword channel | Hybrid 1:1 recall@5 0.952 → 0.976 (before content fixes); fewer function-word matches |
| RRF weights 1:1 | Best recall@5 (1.000) with MRR 0.886; 1:0.5 has slightly better MRR (0.890) but misses one query |
| Arabizi transliteration | Adds an Arabic-script query variant that e5 understands (e.g. "mo9abala" → "مقابلة") |
| No cross-encoder reranker | recall@5 already 1.0 on the evaluation set; would add latency and a second model |
| pgvector HNSW | Same database/transactions/backups; p50 query ~30–60 ms warm including embedding |

## Known limitations

- **Tifinagh**: the embedding model has little or no Tamazight training data; the single Tifinagh test query only
  succeeded through the Latin word "ANAPEC". Tamazight queries should be answered by the LLM translating the query
  (when a key is configured) — not yet implemented as a dedicated step.
- **Evaluation set** written by the team (42 queries): optimistic bias; must be extended with real student questions.
- **Model provenance**: the ONNX files were obtained from an npm package mirroring `Xenova/multilingual-e5-small`
  (HuggingFace was not reachable from the build environment). SHA-256 values are pinned in
  `scripts/fetch-embedding-model.ts`; production deployments download from HuggingFace and must match those hashes —
  if they do not, the script refuses to install the model (investigate before overriding).
- Cold start: the first retrieval after a restart loads the model (~1.0 s).
