# SKILMA — Build progress

Format per phase: plan → steps (with commit hashes) → audit results → DONE (date).

## Week 1 — Phase A-lite (docs/WEEK1_PLAN.md)
Status: starting 2026-11-19

### Step 0 — /audit-existing (2026-11-19) — DONE, waiting for founder decisions
Full report: `docs/AUDIT_2026-11-19.md`.
- Foundations sound, no rebuild: FORCE RLS on 32/33 tables (the 33rd is the migration log), no secrets in the client bundle, all AI server-side, 97/97 tests.
- Blockers: build refused by two Next.js 16.4.3 advisories (fix: 16.4.6); lint fails only on kit legacy files (fix: ESLint ignore).
- Grades: design 3, motion 3, copy 3, frontend 4, backend 4, AI 3, trust 3, performance not measured. Decisions: KEEP frontend and backend; REFACTOR design, motion, copy, AI, trust.
- Biggest gap: all screens use the old BAWSALA design and name; the reference is now `docs/design/skilma-prototype.html`.
- Week-1 gaps: magic link + 18+, Haiku default + $20/month cap + prompt file + evals vs offline reader, Tamazight removal, "demo" wording, interview and /trust pages, path pace choice, Sentry and the 3 metrics.

## Phase A — Foundation migration (full, after week 1)
Status: not started
