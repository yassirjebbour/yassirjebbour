# BAWSALA — Project status

**Updated:** 2026-11-02 · **Branch:** `claude/nice-brahmagupta-ophs0a` · **App:** `bawsala/` (the repository root
contains an unrelated earlier project, "Repair OS", left untouched).

Status definitions: NOT STARTED · IN PROGRESS · IMPLEMENTED (code exists) · TESTED (automated tests pass) ·
VERIFIED (exercised end-to-end on a running production build in a browser against real PostgreSQL, with evidence in
`TESTING_REPORT.md`; **no environment has been deployed**, so nothing is verified in production) · BLOCKED (external
dependency) · NOT JUSTIFIED (deliberately not built now).

## Modules

| Module | Status | Evidence / blocker |
|---|---|---|
| Sign-up, sign-in, sign-out, sessions | VERIFIED | E2E journey; integration session tests |
| Password reset | TESTED (API) | token flow reviewed + tests; **email delivery BLOCKED** (no email provider key) |
| Onboarding (language, profile, first experience, consent, target) | VERIFIED | E2E (desktop + mobile) |
| Profile & experiences CRUD | VERIFIED (create/analyse) / TESTED (edit/delete) | E2E + integration |
| Skill analysis — rules engine (5 languages incl. Arabizi) | VERIFIED | E2E + labelled eval set |
| Skill analysis — LLM structured extraction | IMPLEMENTED | **BLOCKED: needs `ANTHROPIC_API_KEY`** to run |
| Skills Passport (states, evidence, add/remove, export, print) | VERIFIED | E2E; integration |
| Verification by institution (human) | TESTED | integration (tenant + consent checks) |
| Opportunities (ranking, filters, detail, gap, save, target) | VERIFIED | E2E; demo labelling enforced by DB constraint |
| Real opportunity data | BLOCKED | needs owner-entered or partner-provided listings (admin UI ready) |
| 30-day path (generate, complete, proof → evidence) | VERIFIED | E2E; integration |
| Assistant UI (history, search, rename, delete, stream, stop, regenerate, copy, feedback, citations, follow-ups) | VERIFIED (basic engine) | E2E; stop/regenerate tested in integration |
| Assistant with LLM (tool calling, streaming) | TESTED (scripted provider) | **BLOCKED: live run needs the API key** |
| 15 AI tools | TESTED | each executed against Postgres |
| RAG (ingest, hybrid retrieval, citations) | VERIFIED | E2E citation; eval recall@5 1.0 on 42 queries |
| Knowledge base content | IMPLEMENTED | 48 docs; **0 verified against sources** (owner/editor task) |
| Notifications (in-app) | TESTED | created by plan/suggestions/security events; cron for due tasks |
| Email outbox + delivery | IMPLEMENTED | **BLOCKED: `RESEND_API_KEY`** |
| File upload (CV: PDF/DOCX/TXT) | TESTED (unit/API review) | not exercised in the browser E2E |
| Five-language interface (ar, ary, fr, en, zgh) | VERIFIED (rendering) | complete catalogues; **native review pending** (Darija, Tamazight) |
| RTL / Tifinagh rendering | VERIFIED | E2E `dir`, fonts, no overflow |
| Institution portal | TESTED | integration; UI not covered by E2E |
| Admin console (overview, flags, users, institutions, opportunities, knowledge, feedback, audit) | IMPLEMENTED | API role checks tested; UI not E2E-tested |
| Feature flags / kill switches | TESTED | unit + used by chat/analysis/search |
| Analytics (events, funnel, North Star) | IMPLEMENTED | events written by real flows; dashboard numbers are real data only |
| Security controls | TESTED | independent review: 19 findings, 17 fixed, 2 accepted (`SECURITY.md`) |
| Accessibility | TESTED | axe 0 serious/critical on 8 pages; manual screen-reader pass NOT STARTED |
| Backups / restore | VERIFIED (local) | restore test recorded in `DISASTER_RECOVERY.md` |
| CI pipeline | IMPLEMENTED | workflow written; **not yet run on GitHub** |
| Docker image | IMPLEMENTED | not built here (no Docker daemon use attempted); standalone build verified |
| Deployment | NOT STARTED | owner must choose/create hosting (no paid services created) |
| Payments / subscriptions | NOT JUSTIFIED | pilot is free |
| Employer portal | NOT JUSTIFIED (v1) | see roadmap |

## Last successful checks (2026-11-02)

`npm run typecheck` 0 errors · `npm run lint` 0 errors/warnings · `npm test` 12 files / 89 tests passed ·
`npm run build` OK · `npx playwright test` 5/5 passed (desktop + mobile) · `npm run eval:ai` hybrid recall@5 1.0.

## Next exact task

Add `ANTHROPIC_API_KEY` to `bawsala/.env`, then run `npm run eval:ai -- --llm` and one manual conversation per language,
and record results in `docs/AI_EVALUATION_REPORT.md` §2 and §5. Then follow `docs/PRODUCTION_CHECKLIST.md`.
