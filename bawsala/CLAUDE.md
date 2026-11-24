# SKILMA — project instructions for Claude Code

SKILMA is an AI-native, B2B2C skills-intelligence platform for youth employability in Morocco.
Students (free) turn real experience into verified proof of skills; institutions and employers pay;
the outcome that matters is jobs retained at 90 days.

## Source of truth (read in this order before any phase)
1. `docs/SKILMA_MASTER_SPEC.md` — rebuild spec (wins on everything SKILMA-specific)
2. `docs/SKILMA_GENIUS_LAYER.md` — adaptive modes + breakthrough features (priorities in its Part 9)
3. `docs/BUILD_SPEC.md` — generic deep engineering reference (use for details the two above don't cover)
4. `docs/STRATEGY_BLUEPRINT_AR.md` — strategy (Arabic), for product reasoning only
5. `docs/legacy/SKILMA_v0.9.html` — the current prototype. Extract from it programmatically; never retype its content.
Progress and decisions: `docs/PROGRESS.md`, `docs/DECISIONS.md` (keep both updated).

## How we work
- One phase at a time (Master Spec Part 9 + Genius Layer Part 9). Start each phase with `/phase-start <phase>`, end with `/phase-audit <phase>`.
- Plan before editing: for any non-trivial task, propose files to touch + DB migrations, then wait for approval.
- Small, reviewable steps. Commit after each green step with a clear message. Never commit secrets.
- Never invent requirements. Unspecified → simplest option consistent with the specs, logged in `docs/DECISIONS.md` under "Assumptions".
- Open founder decisions (Master Spec Part 10) are never guessed; ask.
- Don't build P2/P3 items before every P1 item of the current phase passes acceptance.

## Non-negotiables (a violation is a bug)
- RLS on every table with tenant or personal data, with automated cross-tenant tests.
- Student identity (name, phone, email) lives only in `student_identity` and never reaches an LLM scoring/matching call.
- All AI calls server-side, routed through `/lib/ai`, logged to `ai_runs` (task, model, prompt version, latency, cost, ok).
- Prompts are versioned files in `/prompts/<name>/<version>.md` + `.schema.json`; never edit a published version.
- Scorers: exact-quote validation, two independent runs, human review routing, eval gates before publishing.
- Every UI string through i18n: ar (MSA), fr, en, ary (Moroccan Darija in Arabic script) — founder decision 2026-11-19. No Tamazight UI for now; Darija strings are reviewed by the co-founders before release; RTL correct; `prefers-reduced-motion`, Calm and Lite modes honored.
- No fake data presented as real; demo data is flagged `is_demo` and labeled in the UI.
- No personal data in URLs, logs, analytics, or error messages.
- No single numeric "employability score" for a person; no automated hiring decision anywhere.

## Product rules from the founder (decided)
- No prices or money amounts anywhere in the product UI. No founder or team names. No "demo" / "prototype" wording in the public build.
- Keep the original logo mark and the green/gold/paper palette.
- Official statistics only with source and date (HCP).
- Week 1 serves adults (18+) only; minors need parental consent and come later.
- Sign-in: email OTP / magic link first (phone OTP costs SMS money; later).
- Learning path pace: the USER chooses — one step per week, or a 30-day daily path. Same steps, different pacing.
- Team: founder + co-founders. No team names in the product.

## THIS REPO ALREADY EXISTS — continue it, never restart it
An earlier Claude Code session built auth, a Postgres schema with per-user isolation (97 passing tests), the home page, and an AI layer
(not yet activated), ready for Vercel + Neon. Keep what works. Rename BAWSALA → SKILMA in UI/copy (the logo mark stays). Drop the
Tamazight UI. Run `/audit-existing` first, then follow docs/WEEK1_PLAN.md.

## Current scope: Pilot sprint (see docs/WEEK1_PLAN.md)
Until docs/WEEK1_PLAN.md is marked DONE, build ONLY what it lists. Everything else in the specs (institution console, employers,
challenges, scorer A/B, pgvector, durable jobs, voice, WhatsApp, Tamazight) is out of scope for now — do not scaffold it.

## Stack
Next.js (App Router) + TypeScript strict + Tailwind + shadcn/ui (restyled to SKILMA tokens) + Motion + next-intl;
Postgres on Neon (Frankfurt) with the auth already in the repo — do NOT migrate to Supabase; Vercel. Vitest + Playwright + axe; SQL tests for isolation.

## Budget (hard limits — founder decision)
Free tiers only for hosting/DB/monitoring. AI ≤ 200 MAD/month (~$20): default model Claude Haiku 5.5 for extraction; larger models only
in offline evals, never in production. Hard caps in code: $1/day and $20/month; on cap → offline reader fallback, never an error page.

## Commands (this repo uses npm; filled in by /audit-existing on 2026-11-19)
- Install: `npm ci`
- Dev: `npm run dev`
- Typecheck / lint: `npm run typecheck` / `npm run lint`
- Tests: `npm test` (unit + integration, includes the isolation tests) · `npm run test:unit` · `npm run test:integration` · `npm run test:e2e` (Playwright desktop + mobile, includes axe)
- DB: `npm run db:migrate` · `npm run db:seed` · `npm run kb:ingest` (or all three: `npm run setup`)
- Evals: `npm run eval:ai` (the extract-skills eval on the legacy sets is still to be added)
- Deploy build (Vercel): `bash scripts/vercel-build.sh`

## Design
Design reference: `docs/design/skilma-prototype.html` (open it in a browser; every screen of the pilot is there: home with live try,
sign-in, compose, discover with quoted evidence, passport card, opportunities with fit, path, interview, settings, privacy). Match its
layout, hierarchy, copy tone and interactions; improve only where QUALITY_BAR demands. Keep the SKILMA identity: deep green #0F3D36, paper #F8F6EF, gold #D4AF7C, IBM Plex Sans / Plex Sans Arabic / Plex Mono,
passport-book metaphor. Tokens come from the legacy CSS variables (extract them). Body text ≥ 13px everywhere; targets ≥ 44px. Motion: transform/opacity only, 60fps on mid-range Android.

## Subagents available
- `spec-guardian` — checks a diff against the specs and the non-negotiables
- `rls-auditor` — audits migrations/policies and writes cross-tenant tests
- `i18n-rtl-checker` — finds hardcoded strings, RTL and a11y issues
- `ai-quality-guard` — reviews prompts, schemas, scorer logic and eval coverage
- `design-critic` — grades screenshots 1–5 against docs/QUALITY_BAR.md and lists exact fixes
Use them proactively at the end of each step that touches their area.

## Quality bar
`docs/QUALITY_BAR.md` defines "world-class" with checkable criteria. Every user-facing screen must reach level ≥ 4,
the 7 wow moments level 5, via the quality loop (build → screenshots 375/1440 × ar/fr × light/dark → design-critic → fix, max 3 loops).
If code already exists, the first task is `/audit-existing` (no code changes) before any phase.
