# Next-session handoff

## Latest session — 2026-11-24 (SKILMA)

- **Branch** `claude/bawsala-home-restoration` (PR #1 on `yassirjebbour/yassirjebbour`; the PR's base branch belongs to
  the unrelated Repair OS project, do not merge it as is). App folder `bawsala/`; the product name is SKILMA.
- **Read first:** `CLAUDE.md` (SKILMA kit rules), `docs/AUDIT_2026-11-19.md`, `docs/WEEK1_PLAN.md`, `docs/DECISIONS.md`.
- **Done this session:** PR #1 CI was red at `npm run lint` (2 errors in `docs/legacy/evals/eval_reader.js`, kit reference
  files) and the build was refused by Next.js (`SecurityFatalError`, advisories GHSA-mfr8-8qww-v76h and
  GHSA-vc7v-qv4w-wrv8). Fixed:
  - `eslint.config.mjs` ignores `docs/legacy/**`;
  - `next` and `eslint-config-next` upgraded to 16.4.6 (lockfile: only those 12 package entries changed;
    `npm audit --omit=dev` reports 0 vulnerabilities).
- **Verified locally, CI order:** lint 0 problems, typecheck, 97/97 tests, build, `eval:ai` all pass. E2E desktop: 3
  passed, 1 failed (K12).
- **Single next task:** make the E2E accessibility test pass on `/` (K12).
  - The cause is the dimmed card in the old BAWSALA hero animation (logo "DM" at 2.09:1 while the card is at 0.55
    opacity).
  - The founder must choose: (A) scope the axe rule to exclude the decorative story stage (`role="img"`, WCAG 1.4.3
    incidental text), or (B) change the inactive-card dimming.
  - The founder already decided the homepage will be replaced by the SKILMA design (`docs/design/skilma-prototype.html`),
    which removes this animation. Do not weaken the test without that decision.
- **Then:** follow `AUDIT_2026-11-19.md` §7 (rename to SKILMA and drop Tamazight, AI on Haiku 5.5 with the $1/day and
  $20/month caps, magic-link sign-in, design port).

---

## Earlier handoff (2026-11-02)

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
