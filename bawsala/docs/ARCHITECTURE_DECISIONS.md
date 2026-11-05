# Architecture decision records

Each record: context → options compared → decision → consequences. Dates: 2026-11-01/02.

## ADR-01 Rebuild as a web application instead of extending the HTML prototype
- **Context.** The reference prototype (`legacy/prototypes/BAWSALA_Prototype_v2.html`, 1.48 MB, one file) has excellent
  UX and copy but stores everything in `localStorage`, has no backend, and its AI works only inside Claude artifacts.
- **Options.** (a) Add a backend behind the single file; (b) rebuild with a framework, porting data, copy and UX patterns.
- **Decision.** (b). The prototype's catalogue, roles, drills, rules dictionary and ~1,700 Darija/Tamazight strings were
  extracted programmatically and reused (`src/server/domain/catalog.ts`, translation reference).
- **Consequence.** Original files preserved under `legacy/`; the new app is the canonical implementation.

## ADR-02 Next.js (App Router) + TypeScript, modular monolith
- **Options.** Next.js full-stack; SPA + separate Node/Express API; Python backend (FastAPI) + React.
- **Why.** One language end to end, server components keep data access on the server, route handlers give a versioned
  API, and one deployable unit is the right size for a 2–5 person team and a 100–10,000 user pilot. A separate service
  adds deployment and auth surface without a current need.
- **Note.** Cache Components were disabled: nearly every page is per-student and dynamic.

## ADR-03 PostgreSQL with row-level security as the system of record
- **Options.** Supabase (Postgres + Auth + Storage), plain Postgres (any host incl. Supabase/Neon), MongoDB/Firebase.
- **Decision.** Plain PostgreSQL accessed with `pg`, SQL migrations in `db/migrations`, RLS forced on student tables,
  identity passed per transaction (`app.user_id`). Works on Supabase, Neon, RDS or a VPS — no vendor lock-in.
- **Why not Supabase Auth/client SDK.** Server-side sessions keep tokens out of the browser, are simpler to test
  locally, and avoid exposing a database API to clients.

## ADR-04 Own session-based authentication
- Opaque 256-bit token in an HttpOnly, SameSite=Lax, Secure cookie; only its SHA-256 is stored; 30-day sliding expiry,
  90-day absolute; scrypt password hashing (N=2^15, r=8, p=3) with rehash-on-login; password reset by single-use
  1-hour token; failed-attempt throttling per (account, IP).
- **Alternatives.** Auth.js (credentials provider is discouraged and adds little here), Supabase Auth, Clerk (paid,
  data leaves the region). OAuth sign-in (Google) is a candidate for later.

## ADR-05 LLM provider: Anthropic Messages API behind a provider-neutral interface
- **Interface.** `LlmProvider { streamTurn, structured }` (`src/server/ai/providers/types.ts`); the orchestrator never
  imports a vendor SDK.
- **Model routing.** Per task via env (`AI_MODEL`, `AI_MODEL_CHAT`, `AI_MODEL_EXTRACT`); default `claude-opus-5-5`
  at effort `low`, server-side refusal fallback enabled. Cheaper models (e.g. `claude-sonnet-5-5`, `claude-haiku-5-5`)
  are a configuration change, to be adopted only after `npm run eval:ai -- --llm` shows equal quality on BAWSALA's sets.
- **Without a key** the product runs a deterministic engine that uses the same tools and says so in the UI.

## ADR-06 Embeddings: multilingual-e5-small in-process; vectors in pgvector
- **Options compared.** Hosted APIs (Voyage multilingual, OpenAI, Cohere) vs local open models (multilingual-e5-small,
  bge-m3, LaBSE); vector stores: pgvector vs Pinecone/Qdrant/Weaviate.
- **Decision.** e5-small (384 dims, 118 MB quantised) runs inside the server: no per-call cost, student text never
  leaves the server for retrieval, ~30–60 ms per query warm. pgvector HNSW in the same database: transactions, RLS,
  backups and joins for free; adequate to ~10⁶ chunks.
- **Measured trade-off.** e5-small handles EN/FR/MSA/Arabic-script Darija well but Latin-script Darija poorly; this is
  compensated by Arabizi→Arabic transliteration and keyword search (see `RAG_PIPELINE.md`, `AI_EVALUATION_REPORT.md`).
  Tifinagh retrieval is not reliably supported by the model.
- **Revisit when** the corpus exceeds ~10⁶ chunks or retrieval quality on Darija/Tamazight needs a stronger model
  (bge-m3 or a hosted multilingual model — the `Embedder` interface already has a Voyage implementation).

## ADR-07 Hybrid retrieval with Reciprocal Rank Fusion; no cross-encoder reranker
- Chosen by ablation on a 42-query multilingual set: hybrid RRF 1:1 + stopwords → recall@5 1.00, MRR 0.886, vs
  vector-only recall@5 0.929 (and 0.571 on Arabizi). A cross-encoder reranker would add ~100–300 ms and a second model
  for a 130-chunk corpus where recall@5 is already 1.0 — not justified now.

## ADR-08 Deterministic business logic, LLM for language
- Fit scores, gaps, plans, rubric scores, CV checks are deterministic code with tests. The LLM chooses tools and
  explains; it cannot change numbers, cannot save a plan without the student's confirmation, cannot mark a skill
  verified.

## ADR-09 Files in Postgres (bytea) for the pilot
- CVs ≤ 5 MB, private by construction (RLS), included in backups, no extra vendor. Move to object storage
  (S3-compatible, private bucket, signed URLs) when storage exceeds a few GB.

## ADR-10 First-party analytics and logs; no third-party trackers
- Events table with an allowlist and no free text or IPs; structured JSON logs to stdout. A hosted error tracker
  (e.g. Sentry) can be added with `SENTRY_DSN` later; not wired yet.

## ADR-11 Deployment as a container
- The in-process embedding model needs ~650 MB RAM and native ONNX binaries (~550 MB on disk), which exceeds typical
  serverless function limits. A single container (Dockerfile provided) on a small VM/PaaS is simpler and cheaper.
