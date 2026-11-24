# SKILMA — MASTER REBUILD SPEC (v1.0 → international grade)
### From a strong single-file prototype (v0.9) to a production, AI-native, B2B2C Skills Intelligence platform

> **Who this is for:** the AI coding agent rebuilding SKILMA together with the founder.
> **What it is based on:** a technical audit of the current SKILMA build (`SKILMA.html`, v0.9, changelog dated 2026-10-16) plus research on youth employability, skills assessment, AI regulation, and vertical-AI SaaS.
> **Companion files (optional, deeper reference):** `BUILD_SPEC.md` (full generic engineering spec) and `skills-intelligence-platform-blueprint.md` (strategy, Arabic). **If they conflict with this file, this file wins for SKILMA.**
> **Date:** 2026-11-19.

---

## PART 0 — RULES FOR THE AI AGENT (read before every task)

1. **This is a rebuild of a working product, not a new idea.** SKILMA v0.9 already has excellent UX, copy, and i18n. **Preserve what works** (Part 2, "KEEP"), upgrade what's weak, and remove only what Part 2 marks "REMOVE".
2. **Work in phases (Part 9).** Never rebuild everything in one pass. At the end of each phase: run the acceptance checks, produce a self-audit, then stop.
3. **Before coding any feature**, state: the Part/section you are implementing, the files you will touch, and any DB migration. Wait for approval on migrations.
4. **Non-negotiables. Violating any of these is a bug:**
   - Row Level Security on every table with personal or tenant data; one institution can never see another's data.
   - Student identity (name, phone, email) is stored separately and **never sent to an LLM for scoring**.
   - Every AI call is server-side (no API keys in the browser) and logged: task, model, prompt version, latency, cost, success.
   - The **"Nothing is shared without your yes"** promise stays literally true: every share is an explicit, revocable consent.
   - Every string goes through i18n (ar, fr, en; zgh partial). RTL works everywhere.
   - `prefers-reduced-motion` and the existing **Calm** and **Lite** modes are honored by every animation and heavy feature.
   - **No fake data presented as real.** Demo organizations, opportunities, and numbers must be visibly labeled "Demo".
   - TypeScript strict.
5. **Never invent requirements.** If unspecified, choose the simplest option consistent with this file and list it under "Assumptions".
6. **Port, don't paraphrase:** reuse the existing SKILMA copy (2,000+ i18n keys), skill dictionary, resource list, prompts, and design tokens. Extract them programmatically from `SKILMA.html` instead of retyping.

---

## PART 1 — WHAT SKILMA IS TODAY (audit of v0.9)

### 1.1 Positioning (from the current product)
- **Promise:** "Discover what you can do, not just what you studied." / "Turn what you've done into proof, and proof into your first opportunity."
- **Users:** university students and graduates in Morocco.
- **Core flow:** a student writes a real experience (any language, including Darija) → AI finds the skills it proves, with exact evidence quotes → the skills go into a **Skills Passport** → the student picks a goal (an opportunity) → SKILMA shows readiness and gaps → a **30-day path** closes the gaps → a **mock interview** → apply.
- **Institution side:** career centres see cohorts, skills by programme, a verification queue, AI insights (minimum group size 10), and exportable reports.
- **Social layer:** "No one left behind": for every 10 students who join, a local partner accompanies one student from a remote area.

### 1.2 Technical reality
| Aspect | Current state | Consequence |
|---|---|---|
| Architecture | One 1.1 MB HTML file: vanilla JS app (~570 KB) + CSS with inlined base64 fonts (~500 KB) | Works as a demo; not maintainable, testable, or scalable |
| Persistence | `localStorage` (`skilma.v1`) only | No real accounts, no multi-device, and institutions can't see real student data. All "console" data is simulated. |
| AI | `window.claude.use("sample")`, which only works inside a Claude artifact; JSON and text calls with `modelTier`; run logging; prompt version map `PROMPT_V` | Must move to your own server-side AI layer |
| AI fallback | A rules-based "built-in reader" (regex hints per skill, e.g. `HINT`) runs on-device; "rules only" mode | **A real differentiator for weak connections. Keep it.** |
| i18n | ar / fr / en complete, zgh (Amazigh) partial, Darija understood as input | A major asset. Extract to JSON. |
| Skills | 20 hardcoded skills (`SK`), 6 marked rare (`RARE`) | Too small; needs a taxonomy backbone (ESCO + a local layer) |
| Opportunities | 12 fictional employers (`OPPS`), with eligibility rules (`ELIG`), required-skill levels, and a portfolio project per role | A good structure, but demo data must be labeled and replaced with real opportunities |
| Evidence levels | "Confirmed by you" → "With proof" → "Verified by institution" | A good start; it lacks the **assessed/demonstrated** level and **outcome** evidence (Part 3) |
| Interview | 5 questions, STAR guidance, AI or rule scoring (clarity / evidence / relevance, 0–100), voice input via the Web Speech API, report, "Show my best score on my passport" | Great practice tool; **the 0–100 score is uncalibrated and must not become a hiring signal** (Part 3.4) |
| Outcomes | Applications tracked; **no placement or 90-day retention tracking** | The biggest strategic gap (Part 3.6) |
| Employers | Public "Employers" page only; no employer product | Required for the B2B2C loop |
| Design | Deep green `#0F3D36` + paper `#F8F6EF` + gold `#D4AF7C`; IBM Plex Sans / Plex Sans Arabic / Plex Mono; light/dark/system; a passport "book" with page-flip; sounds, confetti, tours, command palette, copilot, mascot | Distinctive and premium. Keep the identity; refine the motion (Part 6) |
| Accessibility prefs | Sound, voice (read-aloud), Calm, Lite, font size, theme | Excellent. Keep and extend. |

### 1.3 Verdict (strict)
SKILMA's **front-end product thinking is already above the average funded startup**: honest copy, evidence quotes, privacy-first, multilingual, weak-connection mode. But today it is **a high-fidelity prototype without a backend, without a measurable outcome, and with a weak trust signal (self-reported skills)**. International-grade means three upgrades, in this order:
1. **Real infrastructure:** accounts, a database, server AI, security, and compliance.
2. **Stronger evidence:** skills *demonstrated* through scored tasks, not only *described*, plus cryptographically verifiable credentials.
3. **Outcomes:** track jobs and 90-day retention, because that is what institutions and funders pay for.

---

## PART 2 — KEEP / ADAPT / REMOVE (feature-by-feature)

| Area | Feature (current) | Decision | What to do |
|---|---|---|---|
| Public site | Home (story input on the landing page, "Try a sample story", live demo "One sentence. Five answers.") | **KEEP** | Best feature on the site: the visitor tries the engine before signing up. Rate-limit the server AI; fall back to the on-device reader. |
| Public site | How it works, Institutions, Trust, Example passport, Employers, Partners, Vision, Access (accompaniment), Changelog, Brand, Sign-in, 404 | **KEEP** | Port as SSG pages. "Employers" becomes an entry to the new Employer product. |
| Public site | HCP unemployment figures ("Q3 2026, each with its source") | **ADAPT** | Keep the sourcing. Store stats in a CMS table with source URL + date; show "last checked" dates. Note: HCP changed its methodology in 2026 (new EMO survey), so never compare with older series. |
| Public site | "No one left behind" (1 per 10 accompaniment) | **ADAPT** | A strong mission story, but it costs money. Make it a funded program (sponsor/NGO partner), track requests and capacity in the DB, and never promise more than real capacity. |
| Student | Compose → Discover (AI skills + exact evidence quotes + rejected/"left out" skills) | **KEEP + UPGRADE** | Keep the exact-quote rule (excellent anti-hallucination design). Map skills to the taxonomy (Part 4.2). Evidence level = `claimed`. |
| Student | Setup (name, field, goal) | **KEEP** | Add consent steps (Part 7). |
| Student | Home (readiness, next step, "why this step") | **KEEP** | Add outcome check-ins. |
| Student | Passport (book with page flip, tabs: skills/experiences/share & verify, public link, PDF) | **KEEP + UPGRADE** | Add the evidence ladder (Part 3.2), verifiable credentials (Open Badges 3.0), QR verification, and per-skill visibility. |
| Student | Opportunities (list/map, eligibility, fit, readiness, project per role) | **ADAPT** | Real opportunities from institutions and employers; "fit" shown as "You can prove X of Y required skills" (already the style; keep it). |
| Student | 30-day path (AI-written from gaps or built-in, week view, streaks, regenerate) | **KEEP + UPGRADE** | Each "prove" step becomes a **scored Skill Challenge** (Part 3.3). The Day-30 portfolio project becomes rubric-scored evidence. Resources only from the curated `RES` list → DB. |
| Student | Mock interview (STAR, voice, AI or rules, report) | **ADAPT** | Keep it as **practice**. Replace the 0–100 scores with rubric levels (1–4) and qualitative feedback. **Remove "Show my best score on my passport"** until the scoring is validated (Part 3.4). |
| Student | Programs, Progress, Notifications, Help, Me, Settings (sound, voice, calm, lite, font size, theme) | **KEEP** | Persist server-side. |
| Student | Copilot (persona "calm, precise, warm"; only uses student data; tools) | **KEEP + UPGRADE** | Server-side, with tool calls against real data, safety layer, logging. |
| Student | Command palette, guided tours | **KEEP** | |
| Student | Confetti / big celebration | **ADAPT** | Keep one dignified celebration (passport issued, job reported). Remove repeated confetti. Respect Calm mode. |
| Student | Sounds | **KEEP (off by default)** | Already off by default. Keep it that way. |
| Institution | Overview, Students, Skills, Opportunities, Verification queue, AI insights (min group 10), Reports (CSV), Settings | **KEEP + UPGRADE** | Real multi-tenant data, cohorts, outcomes, donor-ready PDF reports, fairness panel, audit log. |
| Ops | Overview, Institutions, Impact, Users, Skills taxonomy, Opportunities, AI quality, Audit, Settings (rules-only switch, maintenance banner, skill/opportunity toggles, retention) | **KEEP (internal only)** | Becomes the real `/admin` with prompt registry, evals, fairness, and taxonomy mapping review. |
| Data | `SK` (20 skills), `RARE`, `HINT` regexes, `OPPS`, `ELIG`, `RES`, `CHANGES` | **ADAPT** | Seed into DB tables. `HINT` regexes stay in the client-side offline reader. |
| Tech | Single HTML, localStorage, `window.claude` | **REMOVE** | Replace with the target stack (Part 5). Keep a local cache only for offline drafts. |

---

## PART 3 — THE STRATEGIC CORE (the "secrets" the product must embody)

### 3.1 Secret #1: value = a *credible signal*, not a nicer CV
The strongest causal evidence in this field is a randomized trial in South Africa (Carranza, Garlick, Orkin, Rankin, *American Economic Review* 2022, with the Harambee accelerator): young job seekers who received **assessment results in a credible, branded certificate they could share with employers** saw employment rise by 5 percentage points (36% vs. 31%) and earnings by 34%. When only the job seeker saw the results (a "private" certificate), the employment effect was smaller. A related J-PAL study found that attaching a standardized reference letter raised employer response rates by 60%.
**Design rule:** every SKILMA feature must increase how much an employer can *trust* the passport. A feature that doesn't do this is secondary.

### 3.2 Secret #2: the Evidence Ladder (replace the current 3 levels with 5)
| Level | Name (EN / FR / AR) | Source | Shown to employers as |
|---|---|---|---|
| 1 | Described / Décrite / موصوفة | Student story + exact quote (current "Confirmed by you") | "From the student's own story" |
| 2 | Proven / Prouvée / مُثبتة | A proof artifact the student added: file, link, photo of work (current "With proof") | "Backed by evidence the student added" |
| 3 | **Demonstrated / Démontrée / مُبيَّنة** (NEW) | A scored Skill Challenge or structured interview, rubric-based, AI double-scored + human review when needed | "Demonstrated in a SKILMA assessment, level X/4" |
| 4 | Verified / Vérifiée / موثَّقة | The institution confirms an experience happened, or a trainer confirms observed performance (current "Verified by institution") | "Verified by [Institution]" |
| 5 | **Proven on the job / Confirmée en emploi / مؤكدة في العمل** (NEW) | The employer confirms at the 90-day check-in | "Confirmed by an employer after 90 days" |

- Keep the current honest wording: *"Verification confirms an experience happened; it does not grade the student."*
- Each level has an icon + label + color; color is never the only signal.
- **Levels expire** (default: 3 → 24 months; 4 → 36 months) and show their dates.

### 3.3 Secret #3: Skill Challenges turn "described" into "demonstrated"
Self-description is the weakest signal, and in 2026 any written test can be solved by an AI chatbot. SKILMA already has the seed of the solution: **a portfolio project per opportunity** and a **30-day path**. Upgrade it:
- **Skill Challenge** = a 10–25 minute real-work task per skill, in 3 formats:
  1. **Voice role-play** (e.g., an angry customer, a B2B prospect objection), run by an AI persona for at most 4 turns.
  2. **Work sample** (e.g., "Here are 8 stock movements; find the 2 errors"; "Write a reply to this customer email"; "Clean this Excel table" with a downloadable file).
  3. **Structured interview**: fixed behavioral questions, scored by a rubric.
- **Anti-cheating built in:** live voice instead of asynchronous text where possible; one adaptive follow-up question ("Why did you choose that?"); randomized item variants; integrity signals (paste, tab switch, latency anomalies) that **only route to human review and never auto-penalize**.
- **Scoring:** behaviorally anchored rubric (BARS, 4 levels), scored twice independently by the AI. If the two runs differ by more than 1 level, if confidence is low, if integrity flags exist, or if the item falls in the 10% calibration sample, it goes to human review. Every score cites exact quotes from the student's answer (the same principle as the current Discover engine).

### 3.4 Secret #4: never put an uncalibrated AI score on a credential
Research on LLM-based resume screening (University of Washington, 2024–2026) found strong name-based bias. Removing names did not fix it, because models infer identity from schools, cities, and wording. Humans working with a biased AI also tended to adopt its bias.
**Rules for SKILMA:**
- The mock interview stays **practice**. Its feedback is qualitative plus rubric levels, and it is **not shown on the passport** (remove `iv_rep_pass` behavior).
- Only **Demonstrated** evidence that passed calibration gates (Part 4.6) appears on the passport.
- The scorer never sees the name, gender, city, university, or photo.
- **Language fairness:** fluency in French must not raise scores on skills that aren't language skills (for example, customer service conducted in Darija).
- Run fairness audits by gender, region, language, and institution type; groups with n < 20 are hidden.

### 3.5 Secret #5: who pays (B2B2C done right)
- **Students never pay** (keep "free for students").
- **Buyer #1, start here: university and school career centres** (public faculties, ENCG, private schools, OFPPT institutes). Pain: employability reporting, rankings, accreditation, no data on graduates after they leave. The current Institution console already speaks to them.
- **Buyer #2: funded employability programs** (NGOs and donor-backed programs). Pain: outcome reports for funders.
- **Buyer #3: employers hiring many entry-level people** (offshoring/BPO, retail, banking networks, logistics). Pain: screening cost and early turnover.
- **Pricing models:** per student per academic year (institutions) → platform license; per role or per assessed candidate (employers); an outcome-based bonus later, once the 90-day data exists.
- **Rule:** an institution's KPI must be **verified jobs retained at 90 days**, not sign-ups. Vanity metrics destroy employer trust in the passport.

### 3.6 Secret #6: outcomes are the moat
Investors in vertical AI in 2026 discount thin "wrappers" over general models. The defensible assets are **proprietary data plus ownership of the daily workflow**. For SKILMA the proprietary data is:
> **which demonstrated skills actually predict getting and keeping a job, in Morocco.**
Nobody can buy or copy this; it accumulates only if SKILMA tracks **application → interview → hire → 30/90/180-day retention**. Build this from Phase C onward. Make reporting effortless: 3 taps, WhatsApp check-ins, and an employer 1-click confirmation.

### 3.7 Secret #7: honesty with numbers wins juries
- Morocco context (HCP, new EMO 2026 survey): strict unemployment was 10.8% in Q1 2026 and 9.5% in Q2 2026; youth (15–24) unemployment was 29.2% in Q1 2026. Part of the Q2 drop is methodological, so don't sell it as a recovery. Over 3 million young people are NEET.
- "Skills-based hiring" is mostly talk: a Harvard Business School / Burning Glass Institute study found that dropping degree requirements changed fewer than 1 in 700 hires. SKILMA must make skills-based hiring **cheaper and less risky**, not just "fairer".
- SKILMA cannot create jobs. It can **shorten the search, improve match quality, and improve retention**. Say this explicitly; it builds credibility.

### 3.8 Secret #8: regulation is a sales argument
- **Morocco, Law 09-08 / CNDP:** declare processing before collecting data; the CNDP stated in March 2025 that AI processing of personal data falls under Law 09-08. Transfers abroad (e.g., to an LLM API hosted outside Morocco) are regulated. Prior consent is needed for direct prospecting messages.
- **EU AI Act** (relevant for offshoring employers serving EU clients, and for EU-funded programs): AI used for recruitment, selection, and access to education or vocational training is **high-risk** (Annex III). Obligations for standalone high-risk systems now apply from **2 December 2027** (deferred by the Digital Omnibus). Transparency obligations (Art. 50, e.g., telling people they are interacting with AI) have applied since August 2026.
- Building compliance in from day one (human oversight, logs, model cards, fairness audits) is a **feature you sell to institutions and employers**.

---

## PART 4 — PRODUCT SPEC (target)

### 4.1 Information architecture
```
PUBLIC SITE
/  /how  /institutions  /employers  /trust  /example  /vision  /access  /partners
/changelog  /brand  /pricing (NEW)  /verify (NEW)  /p/[slug] (public passport)
/legal/{privacy,terms,ai-notice,cookies}  /signin  /404

STUDENT APP (/app) — mobile-first PWA
compose → discover → setup(+consent) → home
/app/passport  /app/opportunities  /app/opportunities/[id]  /app/path
/app/challenges (NEW)  /app/challenges/[id]  /app/interview  /app/programs
/app/progress  /app/outcomes (NEW)  /app/notifications  /app/help  /app/me
/app/settings  /app/settings/data (NEW: export / delete / consents)

INSTITUTION CONSOLE (/uni)
/uni (overview)  /uni/cohorts (NEW)  /uni/students  /uni/students/[id]
/uni/skills  /uni/opportunities  /uni/verify  /uni/review (NEW, human review queue)
/uni/outcomes (NEW)  /uni/insights  /uni/reports  /uni/fairness (NEW)  /uni/settings

EMPLOYER PORTAL (/employer) — NEW
/employer  /employer/roles  /employer/roles/new (Role Builder)  /employer/roles/[id] (pipeline)
/employer/candidates/[id]  /employer/hires (90-day check-ins)  /employer/settings

OPS / ADMIN (/ops) — internal, MFA + IP allowlist
overview · institutions · employers · users · skills taxonomy · opportunities
challenges & rubrics · prompts · AI quality (evals) · fairness · impact · audit · settings/flags
```

### 4.2 Skills backbone
- **Seed:** the current 20 `SK` skills, kept as the "SKILMA core layer", each **mapped to ESCO** (the European skills/occupations taxonomy; ~14,000 skills, 20+ languages including French; free). Optionally add Lightcast Open Skills (33,000+ skills from job postings, refreshed monthly; free tier limited, larger access by contract) for tools and technologies.
- **Local layer:** Moroccan-specific skills (e.g., "customer service in Darija + French", "informal-shop cash management") mapped to the nearest ESCO skill using embeddings plus human approval in `/ops`.
- **Skill families for v1 Challenges** (they match the current opportunities): Customer service, Sales/negotiation, Stock and cash, Social media/content, Excel/data, Presenting.

### 4.3 Student screens: upgrades in detail
- **Compose / Discover:** unchanged UX. Server AI (or on-device reader when offline or in Lite mode). Output adds `taxonomy_id` and `evidence_level = described`. Keep the "Left out" list (skills mentioned but not proven) because it builds trust.
- **Passport:** keep the book and page-flip. Add an **evidence ladder badge** per skill, a per-skill visibility toggle, the public link (private by default), a QR code, a credential ID (Plex Mono), PDF with QR, and an "Add to LinkedIn" link. Issue a credential the first time a skill reaches Demonstrated (a dignified 600 ms card flip plus a lattice shimmer; no confetti).
- **Opportunities:** real data; "You can prove 4 of 6 required skills" (keep). Show eligibility (`ELIG`: level, languages) transparently. "Apply with passport" shares a link-only passport with that employer (explicit consent screen).
- **Path (30 days):** each week ends with a **prove** step that is a Skill Challenge. Day 30 is the portfolio project, rubric-scored. Resources only from the curated DB list.
- **Challenges (new):** catalog by skill → intro (what's measured, duration, mic check, AI notice) → session (voice orb, live captions, text fallback, autosave, resume within 72 h) → "scoring" state → results (level per skill, the student's own quotes highlighted, "to reach the next level…", "Request human review").
- **Interview:** practice only. STAR guidance stays. Feedback: rubric levels for clarity, evidence, and relevance (1–4), with quotes. No passport display.
- **Outcomes (new):** "Did you get a job?" (3 taps) plus 30/90/180-day check-ins (in-app + WhatsApp).
- **Settings → My data (new):** consent history with toggles, export (JSON + PDF), delete account (7-day grace period).

### 4.4 Institution console: upgrades
- **Cohorts:** create a cohort, invite by link/QR/CSV, assign challenges, set dates.
- **Verify queue:** keep. Add a trainer "observed performance" verification and one-tap confirmation through a link.
- **Review queue (new):** blind human review of flagged challenge scores (transcript + audio + rubric + AI runs A and B; keyboard shortcuts; 10% double review for calibration).
- **Outcomes (new):** funnel Enrolled → Passport → Demonstrated → Applied → Interview → Hired → Retained 90d.
- **Insights:** keep the AI insights with the minimum group (raise to 20 for fairness slices).
- **Fairness (new):** pass rates and mean levels by gender (self-declared, optional), region, language, and programme; adverse-impact ratio with an 0.8 threshold line.
- **Reports:** keep CSV; add branded PDF templates (Cohort Outcomes, Funder Report, Skills Gap, Fairness), scheduled monthly.

### 4.5 Employer portal (new)
- **Role Builder ("Reverse JD"):** paste a job ad → AI outputs a skill spec (must-have / nice-to-have with minimum levels), mapped to the taxonomy, plus **flags for discriminatory requirements** (age, gender, appearance, marital status, origin, photo; in FR/AR/Darija/EN) with suggested fixes, plus the recommended SKILMA Challenge.
- **Pipeline:** candidates arrive anonymized ("Candidate 0427: proves 5/6 must-haves") until shortlisting; identity is revealed only if the student consented for that employer.
- **No single opaque AI ranking score.** Sorting is by evidence coverage and level, and the explanation is always visible.
- **Hires:** 1-click 30/90/180-day check-ins ("Still employed? Yes/No" + optional 1–4 rating on must-have skills).

### 4.6 AI system
| Task | Current | Target |
|---|---|---|
| Discover skills from story | Prompt with allowed IDs + exact-quote rule | Keep v1 prompt → registry; add taxonomy mapping; server-validated exact-substring check (reject + retry once) |
| 30-day plan | AI or fallback plan | Planner may choose **only** from DB resource and challenge IDs; validate IDs |
| Interview feedback | 0–100 scores | Rubric levels + quotes; practice only |
| Copilot | Persona, uses student data, tools | Server tools: `get_passport`, `get_path`, `get_opportunities`, `start_challenge`, `report_outcome`, `draft_application`; safety layer; ≤ 90 words default (keep) |
| **Challenge scorer (new)** | — | BARS rubric, 2 independent runs, JSON schema, exact quotes, `insufficient_evidence` option, never sees identity |
| **Role persona (new)** | — | Role-play character card, max 4 turns, bounded emotion, stays in character, no insults |
| **Role Builder (new)** | — | Skill spec + discrimination flags |
| **Integrity analyzer (new)** | — | Flags → review routing only |
| Offline reader | `HINT` regex rules | Keep on-device; label results "Built-in reader" (already done) |

**Scorer output schema (mandatory):**
```json
{"level": 1, "confidence": 0.0, "insufficient_evidence": false,
 "evidence_quotes": [{"turn": 2, "quote": "exact words from the student"}],
 "justification": "≤ 600 chars", "next_level_gap": "≤ 300 chars"}
```
**Scorer rules:** choose the highest level whose anchor behaviors are *clearly* shown; if the evidence falls between two levels, choose the lower; length and fluency are not evidence; non-language skills ignore the language used.

**Quality gates (block publishing a scorer prompt or model if any fails):**
- Golden set: ≥ 300 answers per skill family, double human-rated, stratified by language, gender, and region.
- Quadratic weighted kappa vs. human ≥ 0.70; within-1 agreement ≥ 90%; per-group mean bias ≤ 0.25 level; run-to-run consistency tracked; cost per item within budget.
- In production: weekly model–human agreement on the 10% calibration sample, with drift alerts.

**Model routing:** strong reasoning model for scoring and Role Builder; fast model for persona, copilot, and interviewer; small model for extraction and taxonomy re-ranking; embeddings for skill matching. Model names live in config, never in business logic. Every call has a timeout, at most 2 retries, a fallback model, a token budget, and a log row.

**Voice (Darija first):** benchmark speech-to-text on ≥ 100 Darija + 50 French + 50 Arabic real utterances (different regions, genders, noise levels) **before** choosing a vendor; pick the best accuracy *and* the smallest gap between groups. Handle Darija–French code-switching. Keep the Web Speech API only as a fallback.

---

## PART 5 — TARGET TECH STACK & DATA MODEL

### 5.1 Stack
- **Frontend:** Next.js (App Router) + TypeScript strict + Tailwind (current CSS variables as tokens) + Radix/shadcn primitives restyled to the SKILMA look + Motion for animation + next-intl (ar, fr, en, zgh) + PWA (offline drafts, background sync).
- **Backend:** Supabase (Postgres + pgvector + Auth + Storage + Realtime) + server route handlers + a durable job runner (Inngest or Trigger.dev) for scoring, reports, check-ins, and evals.
- **AI:** a provider-agnostic router (`/lib/ai`), prompt registry (`/prompts/{name}/{version}`), LLM tracing (Langfuse or equivalent).
- **Messaging:** WhatsApp Business Platform (Cloud API) for reminders, results-ready, outcome check-ins, and trainer confirmations; transactional email.
- **Credentials:** W3C Verifiable Credentials / Open Badges 3.0, Ed25519 signatures held in a KMS, `did:web` per issuing institution.
- **Observability and security:** Sentry (no PII), rate limits (Redis), CSP/HSTS, Cloudflare Turnstile on public forms, backups with point-in-time recovery.

### 5.2 Migration map (localStorage state `S` → database)
| Current `S` field | Target table(s) |
|---|---|
| `profile{name, field}` | `students` (non-identifying) + `student_identity` (name, contact; restricted) |
| `stories[]` | `experiences` |
| `skills{id: {ev[]}}`, `custom` | `skill_evidence` (one row per evidence, with `evidence_level`) + `skills` taxonomy |
| `goal`, `applied{}` | `goals`, `applications` |
| `plan{tasks, done}` | `paths`, `path_tasks` |
| `iv`, `ivBest` | `interview_sessions` (practice; never on credentials) |
| `portfolio[]` | `artifacts` (storage) + `challenge_attempts` when scored |
| `chat[]` | `copilot_threads`, `copilot_messages` |
| `verify{status, at}` | `verifications` |
| `share{pub, uni}` | `consents` + `passports.visibility` |
| `prefs{sound, voice, calm, lite, fs, theme}`, `notif` | `user_prefs` |
| `events[]`, `runs[]`, `decisions{}`, `log[]` | `analytics_events`, `ai_runs`, `audit_log` |
| `uni{handled, insights, minGroup}` | `institutions`, `cohorts`, `insight_runs` |
| `ops{rulesOnly, maint, skillOff, oppOff, users, inst, retention}` | `feature_flags`, `admin_settings` |
| `pilots[]`, `access[]`, `partners[]`, `employers[]`, `feedback[]` | `pilot_requests`, `accompaniment_requests`, `partners`, `employers`, `feedback` |

**Migration feature:** on first sign-in, offer "Import my progress from this device", which reads `localStorage['skilma.v1']`, shows what will be uploaded, asks for consent, and then uploads it. This preserves existing demo users' work.

### 5.3 Core schema (essentials)
```sql
institutions(id, type[university|school|ofppt|ngo|program|employer|platform], name, slug, logo_url, plan, settings jsonb)
memberships(user_id, institution_id, role[admin|career_officer|trainer|reviewer|recruiter|viewer])
students(id, user_id, birth_year, region_code, field, level[fy|grad|other], locale, created_at)
student_identity(student_id, first_name, last_name, phone_e164, email, gender_optional)  -- never sent to LLM scoring
student_institutions(student_id, institution_id, cohort_id, share_level, joined_at)
consents(id, student_id, purpose[core|share_institution|share_employer:{id}|whatsapp|model_improvement|outcome_checkins], granted, notice_version, locale, at, withdrawn_at)
cohorts(id, institution_id, name, programme, starts_on, ends_on, challenge_ids uuid[])
skills(id, source[skilma_core|esco|lightcast|local], external_id, label jsonb, rare bool, embedding vector, esco_id)
occupations(id, isco_code, label jsonb) ; occupation_skills(occupation_id, skill_id, importance, min_level)
experiences(id, student_id, type, text, locale, created_at)
skill_evidence(id, student_id, skill_id, evidence_level[described|proven|demonstrated|verified|on_job],
               level_1_4, confidence, quote, source_type, source_id, issuer_institution_id,
               scored_by[model|human|hybrid], prompt_version, rubric_version, visible, expires_at, revoked_at)
rubrics(id, skill_id, version, levels jsonb, status)
challenges(id, slug, skill_ids, format[roleplay|work_sample|structured_interview], items jsonb, version, est_minutes, cooldown_days)
challenge_attempts(id, challenge_id, student_id, mode, locale, status, integrity_flags jsonb, started_at, submitted_at)
attempt_turns(id, attempt_id, turn, speaker, text, audio_path, audio_expires_at)
score_runs(id, attempt_id, skill_id, run_label, level, confidence, quotes jsonb, justification, model, prompt_version, cost, latency_ms)
human_reviews(id, attempt_id, skill_id, reviewer_id, reason, decision, final_level, note, at)
passports(id, student_id, slug, visibility[private|link|public], show_full_name, allow_indexing)
credentials(id, evidence_id, issuer_institution_id, vc_json, signature, key_id, status, issued_at)
opportunities(id, institution_id, employer_id, title jsonb, city, type, eligibility jsonb, req jsonb, project jsonb, deadline, status, is_demo bool)
roles(id, employer_id, source_text, skill_spec jsonb, flagged jsonb, challenge_id, apply_slug, status)
applications(id, student_id, opportunity_id, role_id, stage, identity_shared, at)
placements(id, student_id, employer_id, start_date, contract_type, wage_band, source, verified)
retention_checks(id, placement_id, day[30|90|180], due_on, still_employed, rating jsonb, reported_by, at)
paths(id, student_id, goal_opportunity_id, generated_by, prompt_version) ; path_tasks(id, path_id, day, type, skill_id, resource_id, challenge_id, done_at)
resources(id, skill_ids, title jsonb, url, provider, hours, locale, cost)
interview_sessions(id, student_id, opportunity_id, mode, turns jsonb, feedback jsonb)   -- practice only
copilot_threads / copilot_messages
ai_runs(id, task, model, prompt_version, input_hash, ok, latency_ms, cost, tokens_in, tokens_out, at)
fairness_audits(id, scope, institution_id, challenge_id, attribute, group_value, n, pass_rate, mean_level, impact_ratio, period)
audit_log(id, actor, institution_id, action, entity, entity_id, diff, at)
feature_flags, admin_settings, stats_cms(id, key, value, source_url, source_date, checked_at)
accompaniment_requests(id, student_id_or_contact, region, status, partner_id) ; partners ; pilot_requests ; feedback
```
**RLS:** a membership-based `is_member(institution_id, roles[])` policy on every institution-scoped table. Students read and write only their own rows. Reviewers have **no** policy on `student_identity` (blinding enforced in the database). The public passport is served through a security-barrier view exposing only allowed columns. Automated cross-tenant tests are required for every table.

### 5.4 Performance targets (the current file is 1.1 MB on first load)
- Marketing route JS ≤ 170 KB gzipped; fonts self-hosted as WOFF2 subsets (not base64 in CSS); LCP < 2.5 s on 4G; CLS < 0.05; INP < 200 ms.
- **Lite mode** (keep): disables animation, images, and server AI; uses the on-device reader; aims for < 100 KB of JS per route.

---

## PART 6 — DESIGN & MOTION (keep the soul, raise the craft)

### 6.1 Identity (keep)
- Deep green `--g #0F3D36` / `--deep #0A2B26` (brand), paper `#F8F6EF`, gold accents (`#D4AF7C`, `#9A7744`), ink `#16201D`; a full dark theme (`#0C1210`).
- Typography: IBM Plex Sans, IBM Plex Sans Arabic (line-height 1.85 for Arabic, as now), IBM Plex Mono for numbers and credential IDs.
- The current logo mark and the "passport book" metaphor are strong and distinctive. Keep them.
- **Decision for the founder (Part 10):** keep the green/gold identity (recommended: it is coherent, already built, and distinctive in the market) or move to a blue-led palette. If blue is chosen, remap tokens only; never hardcode colors.

### 6.2 Tokens to formalize
Port all current CSS variables (`--paper, --surface, --sunk, --ink, --ink2, --muted, --line, --g…, --gold…, --ok, --warn, --err, --r9/13/17, --shadow1–3, --ease, --ease-out`) into a typed token file. Add evidence-ladder colors (described = muted; proven = sage; demonstrated = green; verified = gold; on-job = gold with a glow ring), each paired with an icon. Every text/background pair must pass WCAG 2.2 AA, enforced by an automated contrast test.

### 6.3 Motion system
- Durations: 80 / 160 / 240 / 400 ms, plus "story" 700–1200 ms. Easing: the current `--ease cubic-bezier(.2,.8,.2,1)` and `--ease-out cubic-bezier(.32,.72,0,1)`.
- Animate transform and opacity only; 60 fps on a mid-range Android device.
- **Calm mode** = fades only (≤ 120 ms), no loops, no sound. **Lite mode** = no animation. `prefers-reduced-motion` switches Calm on automatically.
- **Signature moments (rework the existing ones):**
  1. **Landing live demo** ("One sentence. Five answers."): the student's sentence is typed in, then the words that prove skills light up one by one with a gold underline sweep (300 ms each), fly into skill chips, and the chips settle into a mini passport.
  2. **Discover:** each found skill slides in with its exact quote highlighted in the original story (a synchronized highlight sweep in both places).
  3. **Passport:** keep the page-flip (drag or swipe), with a subtle paper shadow. First credential issue: a 600 ms card flip plus a soft gold shimmer, once. No confetti.
  4. **Readiness ring:** counts up on first view (900 ms), then animates only on change.
  5. **Challenge voice orb:** scales with audio amplitude while the AI speaks, shows a waveform ring while the student speaks, and three orbiting dots while processing.
  6. **Results:** level bars grow with an 80 ms stagger; quotes slide in with highlight.
  7. **Console KPIs:** tickers on first view only; skeletons appear after 300 ms.
- **Remove:** repeated confetti, celebration on minor actions, and any sound by default.

### 6.4 Accessibility (already good, extend)
WCAG 2.2 AA; full keyboard support (the command palette is great: keep it); screen readers in ar/fr/en; captions for all AI speech; a text alternative for every voice challenge; touch targets ≥ 44 px; font scaling up to 200% (the current `fs` pref); axe-core checks in CI.

---

## PART 7 — TRUST, PRIVACY & COMPLIANCE (built in, visible on /trust)

- **Consent screens** (versioned, in ar/fr/en): core processing (required); share with my institution; share with an employer (asked per employer, at apply time); WhatsApp; outcome check-ins; use of anonymized data to improve assessments (default off).
- **AI notice** on every AI interaction ("You are talking with an AI system").
- **Human oversight:** students can contest any challenge score ("Request human review"); no automated hiring decision exists anywhere.
- **Data minimization:** no photo, no national ID number, no religion, no health data. Gender is optional and used only for aggregated fairness audits.
- **Retention:** challenge audio is kept 90 days after scoring, then deleted; transcripts and evidence are kept while the account is active.
- **Law 09-08:** declare processing to the CNDP before launch; publish the list of processors (hosting, LLM, speech, WhatsApp, email) with data locations; sign data processing agreements with institutions. `[TODO: lawyer review]`
- **Age:** v1 serves students aged 18+ only.
- **Model cards** per Challenge on `/trust`: what is measured, languages, golden-set results, fairness results, limits, version history (extend the existing `/changelog` habit).
- **Readiness for the EU AI Act:** keep technical documentation, a risk file, logs, and post-deployment monitoring in `/docs/compliance`.

---

## PART 8 — METRICS (one definition file, used everywhere)

| Metric | Definition |
|---|---|
| **North Star** | Verified jobs retained at 90 days, per month |
| Activation | Students with ≥ 1 skill at level Described ÷ sign-ups |
| Demonstration rate | Students with ≥ 1 Demonstrated skill ÷ active students |
| Employer response rate | Applications receiving an employer action ÷ applications sent with a passport |
| Placement rate (6 months) | Students hired within 180 days ÷ students who completed the path |
| Retention 90d | 90-day "still employed" ÷ 90-day checks due **and answered** (also show the response rate) |
| Time to first job | Median days from sign-up to start date |
| Model–human agreement | Exact and within-1 agreement on the calibration sample |
| Adverse impact ratio | Lowest group pass rate ÷ highest (n ≥ 20) |
| Gross margin | (Revenue − AI − speech − hosting − human review) ÷ revenue; target ≥ 70% |
| Institution NRR | Revenue from the same institutions year over year; target > 100% |

**Analytics:** privacy-safe events (pseudonymous IDs, no personal data). Port the current `events[]` names and add: `challenge_started`, `challenge_submitted`, `review_requested`, `credential_issued`, `credential_verified`, `apply_with_passport`, `placement_reported`, `retention_check_completed`.

---

## PART 9 — BUILD PHASES (execute in order; stop after each)

### Phase A — Foundation migration (no new features)
1. Monorepo, CI (typecheck, lint, tests, Lighthouse, axe), environments (local, preview, staging, prod).
2. **Programmatic extraction** from `SKILMA.html`: the i18n dictionary → `/messages/{ar,fr,en,zgh}.json`; `SK`, `RARE`, `OPPS` (flagged `is_demo`), `ELIG`, `RES`, `CHANGES` → seed SQL; prompts → `/prompts/*/v1`; CSS variables → the token file; icons → SVG components; the `HINT` reader → the `/lib/offline-reader` module with unit tests.
3. Design system port: every current component restyled faithfully (pixel-compare against v0.9 screenshots in light and dark, LTR and RTL).
4. Auth (students: phone OTP or email; staff: email + MFA), database, RLS with tests, consent flow.
5. Port the student flow (landing demo, compose, discover, setup, home, passport, opportunities, path, interview, settings) with server persistence and the server AI router, keeping offline-reader fallback and Calm/Lite modes.
6. "Import my progress from this device."
**Exit:** v0.9 parity on real infrastructure; RLS tests green; Lighthouse ≥ 90 on mobile; all AI calls logged.

### Phase B — Evidence upgrade
1. Evidence ladder (5 levels) across the passport and the public pages.
2. Challenges v1: 3 challenges (Customer service role-play, Stock/cash work sample, Presenting structured interview) in ar/fr/en, with Darija answers accepted.
3. Scorer (A/B runs), quote validation, integrity signals, review queue, golden-set eval harness and gates.
4. Verifiable credentials, `/verify`, QR, PDF.
5. Interview moved to practice-only feedback (rubric levels); the passport score display removed.
**Exit:** a pilot cohort completes challenges; model–human QWK ≥ 0.70; credentials verify.

### Phase C — Institutions for real
Cohorts, invitations (link/QR/CSV), real verify queue, outcomes funnel, fairness panel, PDF report templates, scheduled reports, audit log, billing and usage.
**Exit:** one paying (or LOI-signed) institution uses the console for a full cohort.

### Phase D — Employers and outcomes
Role Builder with discrimination flags, anonymized pipeline, consent-based identity reveal, hires, and 30/90/180-day check-ins (employer + student + WhatsApp).
**Exit:** one employer runs one role end to end; the first 90-day retention data comes in.

### Phase E — Voice, WhatsApp, Ops
Darija STT/TTS benchmark → realtime voice challenges; WhatsApp flows; full `/ops` (taxonomy mapping review, rubric editor, prompt registry with rollout, AI quality dashboards, fairness, flags); accompaniment program management.
**Exit:** voice challenges run on a low-end Android over 4G (reply starts < 1.5 s p50); fairness audits run nightly.

---

## PART 10 — DECISIONS ONLY THE FOUNDER CAN MAKE (don't guess)
1. Brand palette: keep green/gold (recommended) or switch to blue-led.
2. First buyer segment and first 2 institutions (from discovery interviews: at least 10 career-centre heads, 10 recruiters, 10 students).
3. Pricing values (per student per year; per role for employers).
4. Hosting region and data residency requirements of the first institutions.
5. LLM and speech vendors (after evals and the Darija benchmark).
6. Who staffs human review (institution staff vs. SKILMA reviewers).
7. Funding and partner for the "1 per 10" accompaniment pledge.
8. Legal review: privacy policy, terms, AI notice, CNDP declaration.

---

## PART 11 — "INTERNATIONAL GRADE" ACCEPTANCE CHECKLIST
- [ ] A visitor tries the engine on the landing page in under 60 seconds, in Darija, and understands the value.
- [ ] Every skill on a passport shows *how we know* (ladder level + source + date).
- [ ] At least one skill per student can be **Demonstrated** through a challenge that cannot be passed by pasting an AI chatbot answer.
- [ ] Scores are explained with the student's own words and can be contested.
- [ ] Passport credentials verify by QR in one scan; the PDF prints correctly in Arabic and French.
- [ ] An institution goes from signup to a funder-ready outcome report without support.
- [ ] An employer turns a messy job ad into a fair skill spec in seconds.
- [ ] 90-day retention is tracked and visible.
- [ ] No cross-tenant leak is possible, and no identity reaches the scorer (both proven by tests).
- [ ] Fairness audits run, and their results are public in aggregate on `/trust`.
- [ ] Lite mode works on a weak 3G connection; Calm mode and reduced motion work everywhere.
- [ ] Nothing fake: demo data is labeled; every statistic has a source and a date.

---

## PART 12 — FIRST MESSAGE TO SEND THE AGENT
```text
Read SKILMA_MASTER_SPEC.md fully (Parts 0–2 and 9 first). The current product is the attached SKILMA.html (v0.9).
Start Phase A only.
Step 1: Do not write app code yet. Produce:
  (a) an extraction plan for i18n strings, SK/RARE/OPPS/ELIG/RES/CHANGES data, prompts, CSS tokens, icons and the HINT offline reader from SKILMA.html;
  (b) the repo structure;
  (c) the full SQL migration for Part 5.3 with RLS policies and the cross-tenant test plan;
  (d) a list of every v0.9 screen with the target route.
Wait for my approval before implementing.
```

---

## SOURCES
- Carranza, Garlick, Orkin, Rankin (2022), *Job Search and Hiring with Limited Information about Workseekers' Skills*, AER: https://ora.ox.ac.uk/objects/uuid:c39a8830-e08b-4300-880b-8397a4fd2b7e/files/r9p290b21j · J-PAL summary: https://www.povertyactionlab.org/ar/node/3196342
- J-PAL / Harambee (reference letters, partnership): https://www.povertyactionlab.org/ar/node/7800624?lang=ar
- Burning Glass Institute & HBS, *Skills-Based Hiring: The Long Road* (2024): https://www.burningglassinstitute.org/research/skills-based-hiring-2024
- Wilson & Caliskan (UW), LLM resume-screening bias: https://www.arxiv.org/pdf/2407.20371 · human adoption of AI bias: https://techpolicylab.uw.edu/wp-content/uploads/2026/02/2509.04404v2.pdf · details: https://www.geekwire.com/2024/ai-overwhelmingly-prefers-white-and-male-job-candidates-in-new-test-of-resume-screening-bias/
- HCP figures 2026: https://www.moroccoworldnews.com/?p=316474 · https://apanews.net/moroccos-unemployment-rate-at-10-8-in-q1-2026/ · https://en.le360.ma/economy/moroccos-unemployment-drops-below-10-in-six-months-economic-recovery-or-statistical-revision_V6ZVP4FPQVFJVG6YLVZGZZBZDI/ · NEET: https://en.mcg24.com/?p=5481
- ESCO / Lightcast taxonomies: https://jobspipe.dev/blog/skills-taxonomy · https://docs.lightcast.io/lightcast-api/docs/general-taxonomies-skills · https://docs.lightcast.io/lightcast-api/docs/free-api-features
- EU AI Act deferral (Digital Omnibus): https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/ · Art. 50 timing: https://minthcm.org/?p=3274
- CNDP / Law 09-08: https://maroc.ma/fr/actualites/elections-legislatives-la-cndp-fixe-les-imperatifs-respecter-dans-le-traitement-des-donnees-caractere · AI statement (March 2025): https://impact.telquel.ma/wp-content/uploads/2026/04/SUPP-CNDP.pdf
- Vertical AI moats: https://menlovc.com/?p=21199 · https://www.insightpartners.com/?p=25778
- Not retrieved in this research (verify before citing): Schmidt & Hunter (1998); Sackett et al. (2022) on selection-method validity; Open Badges 3.0 / W3C VC specifications.
