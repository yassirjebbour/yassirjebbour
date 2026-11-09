# BAWSALA — Testing report

Last full run: 2026-11-02, local PostgreSQL 16.15 + pgvector 0.6.0, Node 22.23, Chromium (Playwright 1.63).

## Commands

```bash
npm run typecheck          # TypeScript, strict
npm run lint               # ESLint (next + jsx-a11y rules)
npm test                   # Vitest: unit + integration (real Postgres, schema rebuilt from migrations)
npm run build              # production build
npx playwright test        # E2E on the production build (desktop + Pixel 7)
npm run eval:ai            # AI evaluation report (retrieval + extraction)
```

## Results

| Suite | Files | Tests | Result |
|---|---|---|---|
| Type check | — | — | 0 errors |
| Lint | — | — | 0 errors, 0 warnings |
| Unit (Vitest) | 6 | 62 | all pass |
| Integration (Vitest, real Postgres with RLS + pgvector + real embeddings) | 6 | 27 | all pass |
| E2E (Playwright, production build) | 1 | 5 (4 desktop + 1 mobile) | all pass |
| Production build | — | — | success, 0 warnings |

Vitest total at last run: 12 files, 89 tests, all passed (unit: basic-intent 14, domain 13, i18n 17, rag-text 8,
security 5, skills-engine 5; integration: chat 5, institution 4, isolation 4, journey 3, retrieval 3, tools 8).

## What the tests cover

**Unit** — skill engine on the labelled multilingual set (precision/recall floors per language, negations, grounding,
noise); i18n (key completeness ×4 locales, placeholders, plural forms, RTL metadata, Tifinagh-only Tamazight,
Accept-Language negotiation); RAG text (script/language detection, Arabizi detection and transliteration, search
normalisation, chunker, front matter, sanitiser); domain (fit scores, ranking, readiness, plan generator, CV checks,
STAR rubric, streaks, flag buckets, analytics prop sanitising); basic-engine intent routing (14 phrasings across
EN/FR/MSA/Darija both scripts); security regressions (trusted-proxy IP, X-Forwarded-Host spoof, streaming body limit,
zip-bomb pre-check, magic-byte sniffing, password hash parameters).

**Integration** — RLS isolation (raw SQL as another student returns nothing; cross-tenant insert rejected);
anonymous sessions see no personal data; pending actions single-use and owner-only; full journey through repositories
(Darija analysis → suggestions → consent → passport → match → plan → proof → evidenced → progress → export → deletion
cascade verified table by table); sessions (renewal, expiry, revocation, 90-day absolute lifetime); password change;
demo/real opportunity constraints; every tool; chat orchestrator with a scripted provider (tool loop, tool results fed
back, student context present without email, citations filtered, usage/cost rows written, loop bound, injection
attempt, stop → "stopped"); basic engine in Arabizi; institution k-anonymity, tenant separation, human verification,
re-check after a student stops sharing; retrieval recall floors (overall, Arabizi), provenance, archived documents
excluded, query text not logged.

**E2E (browser, production build)** — signup → onboarding (Arabizi experience) → consent → dashboard → passport →
opportunities (demo banner) → path → complete step → assistant (basic mode label, opportunity table, ANAPEC answer
with citation, plan proposal confirmed in chat) → sign out/in → conversation persisted → export → delete account →
sign-in refused; the same journey on a Pixel 7 viewport; `<html dir/lang>` and no horizontal overflow for ar/ary/zgh/fr,
Tifinagh text rendered with the Noto Sans Tifinagh font; axe-core WCAG 2.2 A/AA scan of 8 pages (0 serious/critical);
HTTP authorization: another student gets 404 on a conversation, student gets 403 on admin and institution APIs,
`/admin` redirects, cross-origin POST rejected (403), anonymous API 401.

## Defects found by testing and fixed this session

| Defect | Found by | Fix |
|---|---|---|
| Mobile assistant page overflowed horizontally by 336 px | browser journey | grid `minmax(0,1fr)`, `min-width:0` |
| French passages inside RTL pages had broken punctuation | screenshot review | `unicode-bidi: plaintext` on text blocks |
| Sources list showed passages not used in the answer | screenshot review | citations limited to rendered / `[n]`-cited passages |
| Search normalisation inserted a space inside hamza words | unit test | strip all combining marks after alef folding |
| Chunker produced oversize chunks for unpunctuated text | unit test | word-window split |
| `asUser` threw synchronously on invalid ids | integration test | made async |
| "How do I register with ANAPEC?" ranked a skill document first | integration test | stopwords + RRF weights (ablation) |
| English vocational-training question found nothing | evaluation | English summaries in ANAPEC/OFPPT documents |
| "How does ANAPEC work?" routed to job search in basic mode | E2E | knowledge intent before job intent |
| A long experience description containing "travaille" routed to job search | unit test | long statements → skill analysis |
| Darija "الخدمات" (plural) not recognised | unit test | added plural forms |
| Warning colour contrast 4.41:1; in-text links not underlined | axe-core | darker warning token; underline class-less links |
| `pg_dump` with app credentials fails under FORCE RLS | restore test | dedicated `bawsala_backup` role with BYPASSRLS |
| 19 security findings | independent review | see `SECURITY.md` |

## Not covered / not verified

- Live LLM behaviour (no API key): streaming, tool round trips, structured outputs, refusal fallback.
- Real email delivery (no provider key): outbox rows are created and marked `skipped`.
- Browsers other than Chromium (Firefox/Safari) — not run.
- Load testing — not run (no target environment).
- Screen-reader manual testing — not done (automated axe checks only).
- PDF/DOCX upload end-to-end in the browser (unit-level checks and API-level review only).
