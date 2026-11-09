# Known issues (redesign recovery, 4 November 2026)

Branch `claude/bawsala-redesign-recovery`. The issues below are known and **not** fixed in this recovery. Each one has a
severity and a reason it was left.

## Product / content (unchanged by the recovery)

| # | Issue | Severity | Why not fixed here |
|---|---|---|---|
| K1 | The AI assistant has never run against the real model. Only the basic (rules) mode has been exercised, because there is no `ANTHROPIC_API_KEY`. | High | Out of scope; needs the owner's key and an approved evaluation budget (see the AI-readiness phase). |
| K2 | All 12 opportunities are demo data (fictional organisations, labelled "Demo data"). | High for launch | Content task; needs real sources. |
| K3 | The knowledge base can return three passages from the **same** document in one answer (e.g. three ANAPEC cards with the same title). | Low | Retrieval behaviour from the verified baseline; changing it is a search change, not a UI repair. |
| K4 | In the basic engine, an English question can be answered with an Arabic knowledge passage when that is the best match. | Low | Same as K3 (baseline behaviour, documented). |
| K5 | 69 Tamazight lines (plus new `// review` lines in `src/i18n/messages/ext/*.ts`) and the Darija catalogue have not been reviewed by native speakers. | Medium | Needs people, not code. |
| K6 | Security items F-05 (PDF parsing in-process) and F-17 (database role at deployment) remain open. | Medium | Unchanged; see `SECURITY.md`. |

## Redesign scope not covered by this recovery

| # | Issue | Severity | Notes |
|---|---|---|---|
| K7 | Passport, opportunities (list and detail), path, profile, settings and notifications were **not redesigned**. They render correctly with the new base styles and pass the browser and accessibility tests, but their layouts are the pre-redesign layouts. | Medium (consistency) | The helper that was redesigning them stopped at the usage limit. The recovery task was limited to the six broken screens. |
| K8 | The dashboard was redesigned before the recovery and was reviewed only as part of the shell; it received no dedicated repair work. | Low | It had no undefined classes. |
| K9 | On phones, the stat tiles of the institution portal and admin console are one per row, which makes the page long. | Low | Uses the shared `.tile` component unchanged (consistency over a portal-specific layout). |
| K10 | When a crowded constellation (more than about 10 skills on one side) tightens its label rows, a label can sit a little away from its star. Labels never overlap and never leave the sky (unit test). | Low | A leader line would need new SVG work. |
| K11 | On wide screens, admin and institution users see the student navigation items in the rail as well as their portal link. | Low | Baseline behaviour (the shell is shared); not changed in this recovery. |

## Test-environment notes

| # | Note |
|---|---|
| T1 | The development server (`next dev`) logs CSP warnings from its own overlay (`next-devtools`); they do not exist in the production build, and every verification result in `UI_VERIFICATION_REPORT.md` comes from the production build. |
| T2 | Editing a shared component while `next dev` runs can leave a stale server copy and cause a one-off hydration warning. It disappeared after restarting the dev server and never appeared on the production build. |
| T3 | The local development database contains review data created during this recovery: the accounts `portal.admin@example.test` (platform admin) and `portal.inst@example.test` (institution admin), the example institution "Université Démo de Tanger (exemple)" with six example students from `scripts/dev-portal-demo.ts`, demo students `salma.*@example.test`, onboarding test users `ob…@example.test`, and two **empty** example institutions left by an interrupted seeding attempt. None of this exists outside the local machine. |
| T4 | A first review sweep (not committed) signed in too often and was blocked by the sign-in limiter (20 per address per 15 minutes). Its mobile results for logged-in pages were therefore invalid and were discarded. The limiter was not changed or bypassed; the sweep was rewritten to sign in once per account and to fail on any redirect (see `UI_VERIFICATION_REPORT.md`). |
