# BAWSALA — Architecture

Status as of 2026-11-02. Decisions and their alternatives are recorded in `ARCHITECTURE_DECISIONS.md`.

## Shape: a modular monolith

One Next.js 16 application (TypeScript, App Router) serves the web UI, the versioned JSON API (`/api/v1`) and
server-rendered pages. It talks to one PostgreSQL 16 database (with `pgvector`, `pg_trgm`, `pgcrypto`, `citext`).
AI calls go to an external LLM provider through a provider-neutral interface; embeddings run in-process.

```
 Browser (React 19, RTL/LTR, PWA shell)
   │  HTTPS, cookie session (HttpOnly, SameSite=Lax), CSP with per-request nonce
   ▼
 Next.js server ─ proxy.ts (CSP, security headers, optimistic auth gate, noindex for private areas)
   ├─ Pages (server components) ──────────────┐
   ├─ API /api/v1/* (route.ts) ── route() wrapper: Origin check, zod validation, typed errors
   │                                           ▼
   │                         Data-access layer src/server/repo/*  ── asUser / asSystem / asPublic
   │                                           ▼
   │                         PostgreSQL (RLS forced on every student table)
   ├─ AI layer src/server/ai/*
   │     chat.ts (orchestrator, bounded tool loop, SSE) · tools/* (15 tools) · basic.ts (deterministic engine)
   │     providers/anthropic.ts (Messages API: streaming, tools, structured outputs, fallback)
   ├─ RAG src/server/rag/* — ingest (chunk, embed) · retrieve (pgvector + full-text + trigram, RRF)
   │     embedder: multilingual-e5-small ONNX via @huggingface/transformers (in-process)
   └─ Ops: flags.ts (kill switches), notify.ts (in-app + email outbox), events.ts (analytics), log.ts
```

## Layers and responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| Edge of the app | `src/proxy.ts` | CSP nonce, security headers, redirect anonymous users away from `/app`, `/institution`, `/admin` (optimistic; the real check is server-side). |
| Pages | `src/app/**/page.tsx` | Server components read data through repositories, pass serialisable props to small client islands. |
| API | `src/app/api/v1/**/route.ts` | Thin handlers: authenticate (`apiUser(roles)`), validate (`readJson(req, zodSchema)`), call a repository/service, return JSON. |
| Data access | `src/server/repo/*` | All SQL. Every function takes the user id from the session and runs inside `asUser(userId)` so Postgres RLS scopes rows. |
| Domain logic | `src/server/domain/*` | Pure, deterministic functions: skill detection, fit scores, gap, 30-day plan generator, CV checks, interview rubric. |
| AI | `src/server/ai/*` | Provider abstraction, model routing, prompts (versioned), tools registry, orchestrator, usage/cost tracking. |
| RAG | `src/server/rag/*` | Text normalisation (incl. Arabizi → Arabic script), chunking, embeddings, hybrid retrieval with provenance. |
| i18n | `src/i18n/*` | 5 catalogues (ar, ary, fr, en, zgh) with compile-time key completeness, plural rules, RTL metadata. |
| Design system | `src/app/globals.css`, `src/components/ui.tsx` | Tokens from the brand, IBM Plex (Latin/Arabic) + Noto Sans Tifinagh, logical properties for RTL. |

## Authorization in depth

1. **Route** — `apiUser(["platform_admin"])` etc. rejects wrong roles (403) and anonymous users (401).
2. **Data-access layer** — repositories never accept a user id from the request body; ids come from the session.
3. **Database** — `FORCE ROW LEVEL SECURITY` on every student-owned table. `asUser` sets `app.user_id`;
   a query that forgets a `WHERE user_id = …` still only sees the caller's rows (tested in `tests/integration/isolation.test.ts`).
4. **Tenancy** — institution queries filter by the admin's `institution_id` from the session and by student consent,
   and aggregates are suppressed below 5 students.
5. **AI tools** — tools receive a `ToolContext` built from the session; consequential tools only create a pending action
   that the student confirms in the UI.

## Request lifecycles

**Skill analysis** — `POST /api/v1/experiences/:id/analyze` → rules engine (+ LLM structured extraction when configured)
→ quotes must occur in the student's text → stored as `skill_suggestions` → student accepts/rejects → `user_skills`
(state `inferred`, evidence = the quote).

**Assistant turn** — `POST /api/v1/chat` → quota & budget checks → user message stored → `runChat()` streams SSE:
LLM engine (≤5 model rounds, ≤8 tool calls) or basic engine → assistant message stored with tool calls, citations,
engine and prompt version.

**Plan** — `create_learning_roadmap` tool or `POST /api/v1/plan` → deterministic generator from the student's gaps →
`plans` + `plan_tasks`; completing a *prove*/*project* task with a link/note adds evidence and upgrades the skill to
`evidenced`.

## Data

See `DATABASE_SCHEMA.md` (21 tables over 3 migrations). Key invariants enforced by the database:
`opportunities` must cite a source unless they are demo data; demo rows always have `verification_status = 'demo'`;
one active plan per student; suggestions are unique per (student, skill, experience).

## Configuration

All configuration is environment variables validated at startup by `src/server/env.ts` (see `.env.example`).
Feature flags in the database (`feature_flags`) act as kill switches without a redeploy.

## What is deliberately not here (yet)

No message queue (the daily cron + email outbox table cover the pilot), no separate search engine (Postgres is enough
for ~10⁵ chunks), no microservices, no client-side state store, no third-party analytics.
