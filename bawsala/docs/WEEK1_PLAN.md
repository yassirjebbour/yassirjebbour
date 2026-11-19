# SKILMA — Pilot sprint (continue the existing repo)

Goal: on day 7, SKILMA runs on a real link with real accounts, real AI extraction measured on real Moroccan sentences,
and 20 real users from the volunteer list. Nothing else.

## In scope (build only this)
0. `/audit-existing` on the current repo; keep everything that passes; list gaps against this plan.
1. Repo hygiene: pushed to GitHub (yassirjebbour/BAWSALA, private), CI running typecheck + lint + tests on every PR. Rename UI to SKILMA.
2. Only what is still missing from legacy (`/extract-legacy`): i18n ar/fr/en + ary (Darija, co-founder reviewed), SK skills, OPPS (is_demo = true), RES, design tokens, icons, offline reader + tests.
3. Pages, matching docs/design/skilma-prototype.html:
   - Landing (live hero: write a sentence → skills appear) + /trust (privacy) + sign-in
   - Compose (write my story) → Discover (skills found, with the user's own words as evidence)
   - Passport (one card: name, city, top 5 skills, one evidence line per skill, share)
   - Opportunities (list, fit x/y, missing skills) — demo opportunities labeled as examples
   - Path (user picks weekly or 30-day daily; mark done → skill moves to passport)
   - Interview practice (one question per screen, one strength + one improvement, no score)
   - Me (dark mode, larger text, lite mode, language, delete account) + /trust
4. Auth: email OTP / magic link. Adults 18+ (checkbox + birth year). Consent screen before the first story.
5. Database: the existing Neon schema; add only missing tables (`stories`, `skills_found`, `ai_runs`, `events` if absent). Isolation tests stay green.
6. AI: activate the existing layer → Claude Haiku 5.5, caps $1/day $20/month, prompt `/prompts/extract-skills/v1.md` + schema; identity never sent; exact-quote validation
   (every skill must cite a quote that exists in the story); offline reader as fallback; every call logged in `ai_runs`.
7. Evals: `pnpm eval extract-skills` on `docs/legacy/evals/eval_blind.json` + 50 new founder sentences. Report recall/precision vs the
   offline reader baseline (76% / 100% on the blind set). Claude ships only if it beats the baseline.
8. Deploy: Vercel preview per PR + production; Sentry (no PII); 3 metrics in `events`: skill_found, path_step_done, returned_d7.
9. Performance: first load < 170 KB JS on the landing; Lighthouse mobile ≥ 90; fonts self-hosted WOFF2 subsets.

## Out of scope this week (do not scaffold)
Institution console, employers, challenges, scorer A/B, credentials/QR, voice, WhatsApp, pgvector, durable jobs,
Tamazight, minors, payments, ads, paid hosting tiers.

## Exit criteria (all must PASS, with evidence)
- [ ] Production URL works on a low-end Android over slow 4G (Lighthouse ≥ 90 mobile).
- [ ] Sign up → write a story → see skills with quotes → passport saved → log out → log in on another device → story still there.
- [ ] RLS test: user A cannot read user B (automated, green in CI).
- [ ] No API key in the browser bundle (grep test in CI).
- [ ] Eval report committed: Claude vs offline reader on ≥ 80 sentences, ar/fr/en/Darija.
- [ ] i18n: zero hardcoded UI strings; ar RTL correct; light + dark.
- [ ] 5 usability tests done (student, shopkeeper's son, teacher, 55+, low-literacy) and the top issues fixed.
- [ ] 20 real users signed up; the 3 metrics visible.

## Day by day
| Day | Build (Claude Code) | Founder |
|---|---|---|
| Thu 19 | Repo, CI, extraction | Accounts, tools, messages to the 54 volunteers |
| Fri 20 | Design tokens, landing + passport pages | First PR yourself, 10 interviews scheduled |
| Sat 21 | Missing tables + isolation tests + sign-in polish | Learn tables/SQL, 3 interviews |
| Sun 22 | /lib/ai + prompt v1 + eval harness | Write 50 real sentences, 3 interviews |
| Mon 23 | Compose/discover/opportunities/path, deploy, metrics | Review PRs, last 4 interviews |
| Tue 24 | Fix usability issues | 5 usability tests, English pitch |
| Wed 25 | Final audit (`/phase-audit A-lite`) | Fix one issue yourself, launch to 20 users |
