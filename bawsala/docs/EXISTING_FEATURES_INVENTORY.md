# Prototype feature inventory → rebuild mapping

States: **Real** (worked as described), **Simulated** (looked real, demo data/browser-only), **Partial**.

| Prototype feature | State in prototype | In the rebuild |
|---|---|---|
| Landing page, 5-second hero, "try it now" | Real (rules engine in browser) | Rebuilt; try-it calls the server rules engine (`/api/v1/try`) |
| Language switcher (ary, ar, fr, en, zgh) | Real (UI dictionaries) | Rebuilt with typed catalogues; dictionary reused as terminology reference |
| Experience → skills discovery | Partial: AI only inside Claude artifacts | Rules engine (improved: Arabizi, French) + LLM extraction with grounding |
| Skills Passport with 4 states | Real UI, localStorage | Real, database-backed, consent and evidence enforced |
| Verification by institution | Simulated | Real human queue for institution admins (no AI verification) |
| Opportunities with fit | Real logic on fictional data | Real logic; demo data labelled; admin can add sourced opportunities |
| Skill gap + resources | Real logic | Rebuilt (same resources, links added) |
| 30-day path with drills, Day-30 project | Real logic, localStorage | Rebuilt as persistent plan with due dates and proof → evidence |
| Interview practice with feedback | Real rules | Rebuilt as `interview_simulation` tool (STAR rubric) |
| Copilot chat | Simulated outside Claude | Real assistant (LLM via provider interface) + basic engine |
| Certificate / QR passport | Simulated | Not rebuilt (printable passport instead); verifiable certificates deferred |
| University console (cohorts, insights) | Simulated demo cohorts | Real aggregated stats with consent and k-anonymity (≥5) |
| Operations console | Simulated | Real admin console (flags, users, institutions, opportunities, knowledge, feedback, audit) |
| Employer search | Simulated | Not rebuilt (v1 scope) |
| HCP unemployment figures | Real figures, cited | Kept in the knowledge base (marked unverified pending re-check) |
| Light/dark theme, reduced motion | Real | Rebuilt |
| Sound/voice/confetti effects | Real | Not rebuilt (not essential; can return as P3) |
| Guided tours / demo switcher | Real (demo purpose) | Not rebuilt (real onboarding instead) |
