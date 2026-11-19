---
name: audit-existing
description: Audit the code already built for SKILMA against the specs and the quality bar, then decide refactor vs rebuild per area.
disable-model-invocation: true
---
Scope: $ARGUMENTS (or the whole repo if empty)

Do not change any code during this audit.

1. Inventory: list every route/page, component, table/migration, API route, job and AI feature that exists. Note the stack used.
2. Run what exists: install, typecheck, lint, tests, build. Report real results.
3. Capture screenshots of each existing page (375px and 1440px, ar and fr, light and dark) if the app runs, and invoke `design-critic` on them.
4. Invoke `spec-guardian`, `rls-auditor`, `i18n-rtl-checker` and `ai-quality-guard` on the existing code.
5. Grade each area 1–5 against docs/QUALITY_BAR.md: design, motion, copy, frontend, backend/data, AI, trust/safety, performance.
6. For each area decide: KEEP (≥ 4), REFACTOR (3, fixable in place), or REBUILD (≤ 2, or wrong foundations such as no RLS, client-side API keys, wrong data model). Justify each decision in one line.
7. Compare with docs/SKILMA_MASTER_SPEC.md Part 2 (Keep/Adapt/Remove) and Part 9 (phases): where does the current code sit, and what is the shortest path to Phase A exit?
8. Write the full report to docs/AUDIT_<date>.md and a summary to docs/PROGRESS.md. Then stop and wait for the founder's decision.
