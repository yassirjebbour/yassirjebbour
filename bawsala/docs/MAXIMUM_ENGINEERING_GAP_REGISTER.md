# BAWSALA — Engineering gap register

Final independent gap review, 2026-11-02. Each row: capability · state · priority (P0 must before real users,
P1 first weeks, P2 next phase, P3 later) · dependency · evidence/next step.

## 1. Implemented and verified (local production build, browser + real DB)

Auth & sessions · onboarding · rules-based skill analysis (incl. Arabizi) · consent-based passport with evidence ·
opportunity ranking with demo labels · gap analysis · 30-day path with proof → evidence · assistant UI (basic engine) ·
hybrid RAG with citations · 5-language rendering incl. RTL and Tifinagh · cross-account/role/CSRF boundaries ·
export and account deletion · backup & restore. Evidence: `TESTING_REPORT.md`, `DISASTER_RECOVERY.md`.

## 2. Implemented but not fully verified

| Capability | Gap | Pri | Next step |
|---|---|---|---|
| LLM assistant & tool calling | Never run against the live API | P0 | add key; `npm run eval:ai -- --llm`; manual conversations |
| LLM skill extraction | Same | P0 | same |
| Institution portal UI | API/integration tested; no browser test | P1 | add E2E with an institution admin |
| Admin console UI | Same | P1 | add E2E for opportunity + knowledge creation |
| CV upload in browser | Server checks tested; no E2E upload | P1 | E2E with a sample PDF/DOCX |
| Password reset email | Token flow tested; no delivery | P0 | configure Resend + sender domain |
| CI workflow | Written, not run on GitHub | P1 | push → check Actions run |
| Docker image | Not built in this environment | P1 | `docker build` on CI or host |
| Firefox / Safari | Only Chromium tested | P1 | add Playwright projects |

## 3. Tested and failed (then fixed)

All failures found this session were fixed with regression tests (14 listed in `TESTING_REPORT.md`). No known
failing test.

## 4. Blocked by credentials or external services

| Item | Needs |
|---|---|
| Live AI | `ANTHROPIC_API_KEY` (owner account, billing) |
| Email | `RESEND_API_KEY` + DNS for sender domain |
| Hosting / domain | owner-created accounts (no paid service was created) |
| Embedding model from official source | network access to huggingface.co at build time (blocked in this environment; checksums pinned) |
| Real opportunities | partnerships / permitted sources (no scraping) |
| Legal | lawyer review; CNDP filing (Law 09-08) |
| Language quality | native speakers for Darija and Tamazight |

## 5. Not justified for the current stage

Microservices, a separate vector database, message queues, payments/subscriptions, employer accounts, native apps,
a cross-encoder reranker (recall@5 already 1.0 on the eval set), multi-region deployment.

## 6. Recommended for the next phase (from the gap review)

| Capability | Why it matters | Pri | Effort |
|---|---|---|---|
| Email verification at sign-up | Prevent fake accounts and typo emails; F-01 class issues | P1 | S |
| Hosted error tracking (Sentry) with requestId | Production debugging | P1 | S |
| Tamazight query translation for retrieval | Tifinagh retrieval unsupported by e5-small | P1 | M |
| Real student evaluation set (~200 questions, consented) | Current sets are team-written (optimistic) | P1 | M |
| Opportunity freshness job (expire/recheck sources) | Trust in listings | P1 | M |
| Conversation summarisation for long threads | Cost and context quality | P2 | M |
| PDF parsing in an isolated worker with memory limits | F-05 residual risk | P2 | M |
| Non-owner DB role for the app (F-17) | Defence in depth | P1 | S |
| Institution CSV/PDF reports, cohort trends | University adoption | P2 | M |
| Google sign-in | Conversion | P2 | S |
| A/B testing on onboarding copy | Flags with rollout exist; experiment logging not built | P2 | S |
| Data retention automation for events/ai_usage/retrieval_log | Privacy | P1 | S |
| ISCO-08 / ESCO mapping of skills and roles | Interoperability, labour-market linking | P2 | M |
| Offline-capable path view | Low-connectivity students | P3 | M |

## 7. Product risks (would make real users leave)

- Without real opportunities, matching feels like a demo → P0: enter ≥ 10 sourced opportunities before launch.
- Without the AI key, the assistant is useful but limited to known intents → P0: key + evaluation.
- Darija/Tamazight copy not native-reviewed → P0 review.
- No email delivery → password reset unusable → P0 provider.
