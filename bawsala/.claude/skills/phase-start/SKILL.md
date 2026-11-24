---
name: phase-start
description: Start a SKILMA build phase (A, B, C, D, E, F) with a reviewed plan before any code.
disable-model-invocation: true
---
Start phase: $ARGUMENTS

1. Read CLAUDE.md, docs/PROGRESS.md and docs/DECISIONS.md.
2. Read the phase in docs/SKILMA_MASTER_SPEC.md Part 9 and every P1 item mapped to it in docs/SKILMA_GENIUS_LAYER.md Part 9.
3. Check that the previous phase's exit criteria are recorded as met in docs/PROGRESS.md. If not, stop and say what is missing.
4. Produce a plan:
   - Goal and exit criteria of this phase (quoted from the spec)
   - Ordered steps, each small enough for one commit, with files to create/modify
   - Database migrations (separately listed)
   - Tests to write per step
   - Open founder decisions that block this phase (from Master Spec Part 10) — ask them now
   - Risks
5. Write the plan to docs/PROGRESS.md under "Phase $ARGUMENTS — plan".
6. Stop and wait for approval. Do not write application code in this step.
