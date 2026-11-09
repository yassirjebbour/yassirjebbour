# Next-session handoff

Read this first, then `PROJECT_STATUS.md` and `MAXIMUM_ENGINEERING_GAP_REGISTER.md`.

## Where things are

- Branch `claude/nice-brahmagupta-ophs0a`, app in `bawsala/`. Root `README.md`/`server/`/`public/` belong to an
  unrelated project ("Repair OS"); do not modify.
- Everything described in `docs/` is committed and pushed. Last full green run: typecheck, lint, 89 Vitest tests,
  build, 5 Playwright tests, AI eval.
- Original prototypes and brand assets: `legacy/` (inventory in `legacy/MANIFEST.md`).

## Start a session from zero (Ubuntu with Postgres 16)

```bash
sudo apt-get install -y postgresql-16-pgvector
sudo -u postgres psql -c "CREATE ROLE bawsala LOGIN PASSWORD 'bawsala' CREATEDB"
sudo -u postgres createdb -O bawsala bawsala_dev && sudo -u postgres createdb -O bawsala bawsala_test
for db in bawsala_dev bawsala_test; do sudo -u postgres psql -d $db -c "CREATE EXTENSION vector; CREATE EXTENSION pg_trgm;"; done
cd bawsala && npm ci
cp .env.example .env            # set DATABASE_URL=postgres://bawsala:bawsala@localhost:5432/bawsala_dev, CRON_SECRET
npm run models:fetch            # needs huggingface.co; or copy models/ from a machine that has it (checksums enforced)
npm run setup                   # migrate + seed + ingest knowledge base
npm run dev                     # http://localhost:3000
npm test && npm run build && npx playwright test
npm run admin:grant -- you@example.com   # after signing up, to open /admin
```

## Conventions that matter

- All SQL goes through `asUser` / `asSystem` / `asPublic` (`src/server/db/index.ts`); never add a raw pool query.
- New UI text: add to `src/i18n/messages/en.ts` first; the build fails until fr/ar/ary/zgh have the key.
- New AI capability = a tool in `src/server/ai/tools/index.ts` with input/output schemas and a test; anything that
  changes data significantly must go through a pending action + `/api/v1/actions/:id`.
- Knowledge: edit `kb/*.md` (front matter rules in `kb/README.md`), run `npm run kb:ingest`.
- Measure before changing retrieval or models: `npm run eval:ai`.

## Exact next tasks (in order)

1. Owner adds `ANTHROPIC_API_KEY`; run `npm run eval:ai -- --llm`; record in `AI_EVALUATION_REPORT.md`.
2. Native review of `src/i18n/messages/ary.ts` and `zgh.ts` (69 lines marked `// review`).
3. Hosting + email provider per `DEPLOYMENT.md`; run `PRODUCTION_CHECKLIST.md`.
4. E2E for institution/admin UIs and CV upload; Firefox/WebKit projects.
5. Email verification at sign-up; Sentry; non-owner DB role.
