# BAWSALA knowledge base

Each `.md` file here is one knowledge document. It starts with front matter:

```
---
slug: unique-kebab-case-id
title: Human title
kind: skill | occupation | pathway | resource | labor_market | institution | program | guide | policy
language: ar | ary | fr | en | zgh | multi
geography: MA | INTL
source_name: who published the information
source_url: https://… (primary source)
license: usage terms of the source
published_at: YYYY-MM-DD (when the source published it)
verified_at: YYYY-MM-DD (when a person last checked it against the source; empty if never)
verification_status: verified | unverified | editorial
confidence: high | medium | low
---
```

Rules:
- **verified** only after a person has compared the text with the primary source on `verified_at`.
- **unverified** for facts about third parties that were transcribed or summarised but not re-checked.
  The assistant must tell the student to confirm these on the official site.
- **editorial** for BAWSALA's own advice (how to write a CV, how to prove a skill). It is guidance, not fact.
- Never add an opportunity, partnership, statistic or programme that you cannot source.

Ingest with `npm run kb:ingest` (idempotent; unchanged files are skipped, changed files get a new version).
Skill and occupation documents are also generated from `src/server/domain/catalog.ts` at ingest time.
