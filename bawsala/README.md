# BAWSALA — بوصلة

Career intelligence for young people in Morocco: write what you have done, get your skills (with the sentence that
shows each one), a trustworthy Skills Passport, roles that fit, what is missing, a 30-day path to close the gap, and an
assistant that helps you prove each step. Interface in Arabic, Darija, French, English and Tamazight (Tifinagh).

**Status:** pilot-ready codebase, not deployed. See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

## Stack

Next.js 16 (App Router, TypeScript) · PostgreSQL 16 with row-level security + pgvector · server-side sessions ·
Anthropic Messages API behind a provider-neutral interface (optional; deterministic engine without a key) ·
multilingual-e5-small embeddings in-process · Vitest + Playwright.

## Quick start

```bash
cp .env.example .env              # set DATABASE_URL and CRON_SECRET
npm ci
npm run models:fetch              # embedding model (checksum-verified)
npm run setup                     # migrations + seed + knowledge base
npm run dev                       # http://localhost:3000
```
Full setup (Postgres, pgvector, test database): [`docs/NEXT_SESSION_HANDOFF.md`](docs/NEXT_SESSION_HANDOFF.md).

## Commands

| Command | What it does |
|---|---|
| `npm test` | Unit + integration tests (real Postgres) |
| `npx playwright test` | End-to-end tests on the production build |
| `npm run typecheck` / `npm run lint` | Static checks |
| `npm run eval:ai` | Retrieval and skill-extraction evaluation (`-- --llm` with an API key) |
| `npm run kb:ingest` | Index the knowledge base (`kb/`) |
| `npm run admin:grant -- email` | Make an existing account a platform admin |

## Documentation

Product: [specification](docs/PRODUCT_SPECIFICATION.md) · [roadmap & first 100 users](docs/PRODUCT_ROADMAP.md) ·
[audit of the prototypes](docs/PROJECT_AUDIT.md)
Engineering: [architecture](docs/ARCHITECTURE.md) · [decisions](docs/ARCHITECTURE_DECISIONS.md) ·
[database](docs/DATABASE_SCHEMA.md) · [API](docs/API_DOCUMENTATION.md) · [i18n](docs/I18N.md)
AI: [architecture](docs/AI_ARCHITECTURE.md) · [RAG](docs/RAG_PIPELINE.md) · [evaluation](docs/AI_EVALUATION_REPORT.md)
Quality & ops: [testing](docs/TESTING_REPORT.md) · [security](docs/SECURITY.md) · [threat model](docs/THREAT_MODEL.md) ·
[privacy](docs/PRIVACY_AND_DATA_INVENTORY.md) · [accessibility](docs/ACCESSIBILITY_REPORT.md) ·
[performance](docs/PERFORMANCE_REPORT.md) · [observability](docs/OBSERVABILITY.md) · [analytics](docs/ANALYTICS.md) ·
[disaster recovery](docs/DISASTER_RECOVERY.md) · [cost](docs/COST_ANALYSIS.md) · [deployment](docs/DEPLOYMENT.md) ·
[production checklist](docs/PRODUCTION_CHECKLIST.md) · [gap register](docs/MAXIMUM_ENGINEERING_GAP_REGISTER.md) ·
[changelog](docs/CHANGELOG.md)
