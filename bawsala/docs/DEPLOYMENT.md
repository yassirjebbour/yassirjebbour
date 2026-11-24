# BAWSALA — Deployment guide

Nothing has been deployed. These steps are complete and were exercised locally (build, migrations, seed, ingestion,
production server, backup/restore); hosting accounts and secrets are the owner's to create.

## Requirements

- Node.js 22, PostgreSQL 15+ with extensions `vector` (pgvector ≥ 0.5 for HNSW), `pg_trgm`, `pgcrypto`, `citext`.
- A container host with ≥ 1 GB RAM (the embedding model uses ≈ 650 MB).
- Outbound HTTPS to `api.anthropic.com` (AI), `api.resend.com` (email, optional), `huggingface.co` (model download at build).

## Environments

| Env | Database | Notes |
|---|---|---|
| development | `bawsala_dev` (local) | `.env` copied from `.env.example` |
| test | `bawsala_test` (name must contain `test`; schema is rebuilt by the test runner) | CI service container `pgvector/pgvector:pg16` |
| staging | separate managed DB | same image as production, `SEED_DEMO_OPPORTUNITIES=true` |
| production | managed DB with PITR | `SEED_DEMO_OPPORTUNITIES=false` once real opportunities exist |

## 1. Database (once per environment)

```sql
-- as the provider's admin role
CREATE ROLE bawsala LOGIN PASSWORD '<secret>';          -- app role: NOT superuser, NO BYPASSRLS
CREATE DATABASE bawsala OWNER bawsala;
\c bawsala
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- backup role (see DISASTER_RECOVERY.md)
\i db/ops/backup-role.sql
```
On Supabase/Neon enable `vector` and `pg_trgm` from the dashboard; use a dedicated app role rather than the
platform's `postgres` role (the latter may bypass RLS).

## 2. Configuration

Copy `.env.example` → secrets store of the host. Required: `DATABASE_URL`, `DATABASE_SSL=true` (managed DBs),
`APP_URL=https://<domain>`, `CRON_SECRET` (≥ 24 chars), `TRUSTED_PROXY_HOPS` (1 for Fly/Render/Railway/nginx).
Optional: `ANTHROPIC_API_KEY`, `AI_*`, `RESEND_API_KEY`, `EMAIL_FROM`. `src/server/env.ts` refuses to start with an
invalid configuration.

## 3. Build and release

```bash
docker build -t bawsala:$(git rev-parse --short HEAD) bawsala/
```
Release step (run once per deploy, before switching traffic), with the same environment:
```bash
npx tsx scripts/migrate.ts                                   # forward-only SQL migrations, one transaction each
node --conditions=react-server --import tsx scripts/seed.ts   # skills catalogue (+ demo roles if enabled)
node --conditions=react-server --import tsx scripts/kb-ingest.ts   # knowledge base (idempotent)
curl -fsS "https://<domain>/api/v1/search?q=warmup" > /dev/null    # loads the embedding model
```
Create the first platform admin after they sign up: `npm run admin:grant -- person@example.com`.

## 4. Scheduler

Call daily (e.g. 07:00 Africa/Casablanca) — host cron, GitHub Actions schedule or the platform's scheduler:
```bash
curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/v1/cron/daily
```
It creates due-task notifications, queues opt-in reminders, delivers the email outbox with retries and prunes
expired rows.

## 5. Health and monitoring

Liveness `GET /api/health`; readiness `GET /api/health/ready` (database reachable, AI/embedding configured).
Logs are JSON on stdout. See `OBSERVABILITY.md` for alerts and the incident runbook.

## 6. Rollback

- Application: redeploy the previous image tag (the DB schema is additive-only so far).
- Migrations are forward-only; a breaking change must ship as expand → migrate data → contract over two releases.
  If a migration fails it rolls back its own transaction. To undo a deployed migration, write a new corrective
  migration; restore from backup only for data loss (see `DISASTER_RECOVERY.md`).
- Kill switches (`/admin` → Feature flags) disable AI, retrieval, sign-ups or uploads instantly without a deploy.

## 7. CI/CD

`.github/workflows/bawsala-ci.yml` runs on every push/PR touching `bawsala/`: install, model fetch (cached), lint,
type-check, unit+integration tests on Postgres+pgvector, production build, Playwright E2E, AI evaluation report
(artifact). Continuous deployment is intentionally not configured until hosting is chosen; recommended: deploy the
image on merge to `main` after CI passes, staging first.
