# BAWSALA — Product roadmap and plan to 100 activated students

## Now → launch gate (owner actions, ~1 week)

1. Choose hosting; create DB and container; set secrets (see `DEPLOYMENT.md`, `PRODUCTION_CHECKLIST.md`).
2. Add `ANTHROPIC_API_KEY`, run `npm run eval:ai -- --llm`, review one conversation per language.
3. Native review of Darija and Tamazight copy; verify the 8 factual knowledge documents against their sources.
4. Enter ≥ 10 real opportunities with sources (ANAPEC listings, partner companies, university career office).
5. Legal: privacy notice/terms review; CNDP filing.

## The first 100 activated students (30 days)

*Activation = ≥ 3 confirmed skills + a target role. Numbers are targets, not results.*

| Week | Action | Measure |
|---|---|---|
| 1 | 2–3 campus ambassadors (economics, management, computer science faculties) run 30-min sessions; each student signs up and writes one experience in class | sign-ups, onboarding completion |
| 1 | Fix the top 3 drop-off points seen in the funnel and feedback | funnel step conversion |
| 2 | Partner with one association/club: "turn your club work into skills" workshop | experiences analysed, suggestions accepted |
| 2–3 | Weekly WhatsApp/Instagram posts showing anonymised (consented) passport examples; no paid ads before activation ≥ 40% | sign-ups per channel (utm in landing links) |
| 3 | Career-office pilot with one institution: join code, verification of 10 experiences | verification requests |
| 4 | Review: 100 activated? retention week-2? 👍 ratio? Decide next features from evidence | activation, WAU, North Star |

Support: one named person answers feedback daily; privacy requests within 72 h.

## Next (after the pilot evidence)

| Priority | Item | Why |
|---|---|---|
| P1 | Real opportunity sourcing (partner feeds/APIs with permission) + expiry checks | Matching value depends on real roles |
| P1 | Tamazight query translation step for retrieval; stronger multilingual embeddings evaluated | Tifinagh retrieval unsupported today |
| P1 | Error tracking + uptime alerts | Operability |
| P2 | Conversation summarisation for long threads; model routing by task after evaluation | Cost and quality |
| P2 | Institution reports export (CSV/PDF), cohort trends | Institution adoption |
| P2 | Google sign-in, email verification at sign-up | Conversion, account security |
| P3 | Employer view (search verified passports with consent) | Two-sided value |
| P3 | Native mobile wrapper / push notifications | Engagement |
