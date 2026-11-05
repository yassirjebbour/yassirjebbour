# BAWSALA — Backup, disaster recovery and business continuity

## Objectives (pilot)

| | Target | How |
|---|---|---|
| RPO (max data loss) | ≤ 24 h with daily dumps; ≤ 5 min with managed PITR | Managed Postgres point-in-time recovery + nightly logical dump |
| RTO (time to restore service) | ≤ 2 h | Documented restore below; image redeploy is minutes |

## Backups

1. **Managed provider PITR** (Supabase/Neon/RDS): enable; retention ≥ 7 days.
2. **Nightly logical dump** (provider-independent, encrypted, kept 30 days, stored outside the provider):
   ```bash
   PGPASSWORD=$BACKUP_PASSWORD pg_dump -h $DB_HOST -U bawsala_backup -Fc -f bawsala-$(date +%F).dump bawsala
   gpg --encrypt -r ops@<domain> bawsala-$(date +%F).dump    # or the storage provider's server-side encryption
   ```
   **Important (found by the restore test):** row-level security is *forced* on student tables, so `pg_dump` with the
   application's credentials fails. Backups must use the dedicated read-only role with `BYPASSRLS`
   (`db/ops/backup-role.sql`). Never give that role to the application.
3. Uploaded CVs live in the database and are included in both backups. Model weights are re-downloaded at build;
   the knowledge base is rebuilt from `kb/` + `scripts/kb-ingest.ts` (Git is its source of truth).

## Restore procedure

```bash
createdb -O bawsala bawsala_restore
psql -d bawsala_restore -c "CREATE EXTENSION vector; CREATE EXTENSION pg_trgm; CREATE EXTENSION pgcrypto; CREATE EXTENSION citext;"
pg_restore -d bawsala_restore --no-owner --role=bawsala bawsala-YYYY-MM-DD.dump
# verify (expected counts vs the source), then point DATABASE_URL to it and restart the app
```

## Restore test — performed 2026-11-02 (local)

| Step | Result |
|---|---|
| `pg_dump` as app role | **Failed** (`query would be affected by row-level security policy`) → led to the backup role |
| `pg_dump` as `bawsala_backup` (BYPASSRLS, pg_read_all_data) | OK, 0.1 s, 349 KB |
| `pg_restore` into a new database | OK, 0.28 s |
| Row counts users/skills/messages/opportunities/embedded chunks/audit | identical to source (1/7/8/12/130/31) |
| RLS on restored tables | enabled and forced (users, messages, user_skills) |
| App role without identity sees `users` | 0 rows (RLS effective) |
| Vector search on restored DB | returns the expected documents |

Repeat this test monthly on a copy of production and record the timings here.

## Failure scenarios

| Scenario | Effect | Response |
|---|---|---|
| LLM provider outage / rate limit | Chat would fail | Automatic fallback to the basic engine for that turn (same tools, labelled); extraction falls back to rules |
| AI cost spike | Budget exhausted | `AI_DAILY_BUDGET_USD` switches the assistant to basic mode; flag `ai.llm` off |
| Embedding model missing/corrupt | No vector search | Retrieval degrades to keyword search (reported as `mode: "keyword"`); fix by `npm run models:fetch` |
| Email provider down | Emails not sent | Outbox retries with exponential backoff up to 5 attempts, then `failed` (visible in admin) |
| Database down | App unavailable | `/api/health/ready` returns 503; restore from PITR/backup; status message via the host |
| Bad deploy | Errors | Redeploy previous image; feature flags to disable the faulty area |
| Data corruption by a bug | Wrong data | PITR to just before; replay legitimate changes from audit log where possible |
