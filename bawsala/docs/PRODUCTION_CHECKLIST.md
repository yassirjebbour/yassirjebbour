# BAWSALA — Production checklist (pilot launch gate)

Mark each item with the date and the person who checked it.

## Must have before inviting real students
- [ ] Hosting chosen and created by the owner (container ≥1 GB RAM; managed Postgres with PITR, pgvector, pg_trgm)
- [ ] App connects with a dedicated role: not superuser, no BYPASSRLS, not the provider's `postgres` role
- [ ] Backup role created (`db/ops/backup-role.sql`), nightly encrypted dump scheduled, restore tested on staging
- [ ] `APP_URL` is https; HSTS active; `TRUSTED_PROXY_HOPS` matches the host (check `X-Forwarded-For` layout)
- [ ] `CRON_SECRET` set; daily cron calling `/api/v1/cron/daily`
- [ ] First platform admin granted with `npm run admin:grant`; no other admins
- [ ] `SEED_DEMO_OPPORTUNITIES=false` **or** demo roles clearly kept with the "Demo" label until real ones exist
- [ ] At least 10 real opportunities added through the admin with source URL, date and verification status
- [ ] Knowledge documents re-checked against their sources; set `verified_at`/`verification_status: verified` only after checking
- [ ] Privacy notice and terms reviewed by a lawyer; CNDP declaration/authorisation filed (Law 09-08), including the
      transfer of data to the LLM provider outside Morocco
- [ ] Native-speaker review of the Darija and Tamazight catalogues (69 Tamazight strings flagged `// review`)
- [ ] Manual screen-reader pass (VoiceOver iOS, TalkBack Android) on the core journey
- [ ] A support owner reads `/admin` → Feedback at least daily during the pilot

## With the AI key
- [ ] `ANTHROPIC_API_KEY` in the secret store (never in the repo or client)
- [ ] `npm run eval:ai -- --llm` run and results recorded in `AI_EVALUATION_REPORT.md`
- [ ] One manual conversation per language (ar, ary in both scripts, fr, en, zgh) reviewed
- [ ] `AI_DAILY_BUDGET_USD` and `AI_DAILY_MESSAGES_PER_USER` set to the agreed values
- [ ] Data-processing terms with the provider reviewed (retention, training opt-out)

## Should have in the first weeks
- [ ] Error tracking (e.g. Sentry) wired with `requestId`
- [ ] Uptime check on `/api/health/ready`
- [ ] Alerts from `OBSERVABILITY.md` (5xx rate, AI cost, outbox failures)
- [ ] Email provider configured (`RESEND_API_KEY`, verified sender domain with SPF/DKIM)
- [ ] Separate non-owner DB role for the app (finding F-17)
