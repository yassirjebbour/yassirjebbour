---
name: phase-audit
description: Audit a finished SKILMA phase against its exit criteria before moving on.
disable-model-invocation: true
---
Audit phase: $ARGUMENTS

1. Run: typecheck, lint, unit tests, RLS tests, e2e smoke, a11y checks, Lighthouse (if configured), evals (if prompts changed). Report real results only; never claim a check ran if it did not.
2. Invoke the subagents relevant to what changed: spec-guardian (always), rls-auditor, i18n-rtl-checker, ai-quality-guard.
3. Compare against the phase exit criteria (Master Spec Part 9) and the relevant acceptance tests (Master Spec Part 11, Genius Layer Part 10).
4. Output: a checklist of each exit criterion with PASS/FAIL and evidence; a list of blockers with fixes.
5. If everything passes, append "Phase $ARGUMENTS — DONE (date)" with evidence to docs/PROGRESS.md. Otherwise list what remains and stop.
