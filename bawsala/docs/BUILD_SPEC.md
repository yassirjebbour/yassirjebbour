# BUILD_SPEC.md — Bayyina (working name)
## AI-native Skills Intelligence Platform for Youth Employability (B2B2C, Morocco-first)

> **Working name:** "Bayyina" (بيّنة = *proof / clear evidence*). It is a placeholder: check trademark, domain, and social-handle availability before using it publicly. To rename, replace `Bayyina` globally.
>
> **Companion document:** `skills-intelligence-platform-blueprint.md` (Arabic strategy blueprint). This file is the **engineering + design source of truth**. If the two conflict on a technical detail, this file wins. If they conflict on strategy, the blueprint wins.
>
> **Spec version:** 1.0 — 2026-11-19

---

## 0. INSTRUCTIONS FOR THE AI CODING AGENT (read first, obey always)

You are building a production-grade product, not a demo. Follow these rules for every task:

1. **Build in phases (Section 16).** Never generate the whole product in one pass. Finish a phase, run its acceptance checks, then stop and report.
2. **Before writing code for any feature**, restate: (a) the relevant section numbers of this spec, (b) the files you will create/modify, (c) the database changes. Wait for confirmation on schema changes.
3. **Non-negotiables. Violating any of these is a bug:**
   - Row Level Security on every table holding tenant or personal data. No organization may ever read another organization's rows.
   - Personal identity (name, phone, email, photo) lives only in `learner_identity` and is **never** sent to an LLM for scoring or matching.
   - Every LLM call is logged in `ai_decision_log` with model, prompt version, and input hash.
   - Every user-facing string goes through i18n (ar, fr, en, plus Darija `ary`). No hardcoded text.
   - RTL works on every screen.
   - `prefers-reduced-motion` is respected on every animation.
   - No personal data in URLs, logs, analytics events, or error messages.
   - TypeScript strict mode. No `any` without a written justification comment.
4. **Never invent requirements.** If something is not specified, choose the simplest option that fits these rules, and list it under "Assumptions" in your report.
5. **After each phase, self-audit** against Sections 7.3 (RLS), 8.8 (AI guardrails), 12 (security & privacy) and 13 (Definition of Done), and output a list of violations found and fixed.
6. **Use the copy provided in this spec verbatim** (Section 5). Where copy is marked `[TODO-COPY]`, write a placeholder that follows the voice guidelines in 3.9.

---

## 1. PRODUCT SUMMARY

### 1.1 One sentence
Bayyina turns young people's real abilities into **verified, shareable proof** that employers trust. Training organizations, programs, and employers pay for it, and it measures the outcome that matters: **jobs that last 90+ days**.

### 1.2 Core loop
```
Organization enrolls a cohort → Youth take AI-run, evidence-based assessments (voice/text, Darija/FR/AR)
→ Scores reviewed (AI dual-scoring + human review when needed) → Youth receive a Skills Passport + personal pathway
→ Youth apply with the Passport → Employers respond/hire → Placement + 30/90/180-day retention tracked
→ Outcome data recalibrates assessments → the proof becomes more trusted
```

### 1.3 Users & roles

| Role | Surface | What they do |
|---|---|---|
| `learner` | Learner app (mobile-first PWA) + WhatsApp | Onboard, consent, take assessments, see results, follow pathway, share passport, report job outcomes |
| `org_admin` | Organization console | Manage org, team, billing, cohorts, reports |
| `coach` / `trainer` | Organization console | Manage learners, review scores, verify skills (third-party evidence) |
| `reviewer` | Review queue | Human-review flagged AI scores |
| `recruiter` | Employer portal | Create role specs (Reverse JD), invite candidates to assessments, manage pipeline, confirm hires and retention |
| `public_viewer` | Public passport page | View and verify a shared passport (no login) |
| `platform_admin` | Internal admin | Taxonomy, rubrics, prompts, evals, fairness audits, tenants, audit logs |

### 1.4 Product principles (these decide trade-offs)
1. **Proof over promises.** Every skill shown has an evidence type and a confidence level.
2. **Outcomes over activity.** Dashboards lead with placements and retention, not sign-ups.
3. **AI proposes, humans decide.** No automated final hiring decision anywhere.
4. **Built for the real user:** low-end Android, limited data, Darija voice-first, WhatsApp-native.
5. **Fair by design.** Fairness metrics are visible in the product, not hidden in a report.
6. **Calm, premium, alive.** The UI feels like a modern fintech: confident, fast, and with motion that serves meaning.

---

## 2. INFORMATION ARCHITECTURE (complete sitemap)

### 2.1 Marketing site (public, SSG/ISR, SEO-optimized)
```
/                         Home
/institutions             For training centers, programs, universities
/employers                For employers
/youth                    For young people
/how-it-works             The evidence model explained
/responsible-ai           Fairness, privacy, human oversight, model cards
/pricing                  Plans
/impact                   Outcomes & case studies (live counters)
/about                    Mission, team
/contact                  Contact + Book a demo
/verify                   Public passport verification (paste code / scan QR)
/legal/privacy            Privacy policy (Law 09-08 aligned)
/legal/terms              Terms of service
/legal/ai-notice          AI transparency notice
/legal/cookies            Cookie policy
/404, /500                Error pages
```

### 2.2 Auth & onboarding
```
/auth/sign-in             Phone OTP (learners) / email magic link + password (org & employer)
/auth/sign-up             Org & employer self-serve signup (creates trial org)
/auth/invite/[token]      Accept invitation (team member or learner joining a cohort)
/auth/reset               Password reset
/onboarding/learner       Language → consent → profile basics → first assessment intro
/onboarding/org           Org profile → invite team → create first cohort → import learners
/onboarding/employer      Company profile → first role spec (Reverse JD)
```

### 2.3 Learner app (mobile-first, `/app`)
```
/app                      Home (today's next step, progress ring, passport preview)
/app/assessments          Available & completed assessments
/app/assessments/[id]/intro     Pre-assessment briefing (what, how long, mic check)
/app/assessments/[id]/session   Live assessment (voice/text/simulation)
/app/assessments/[id]/done      Submission confirmation + what happens next
/app/results/[attemptId]        Results with evidence, level explanations, next steps
/app/passport             My Skills Passport (edit visibility, share, QR, download PDF)
/app/pathway              Personalized pathway (steps, resources, re-assessment)
/app/opportunities        Opportunities shared by org/employers + applications tracker
/app/coach                Chat/voice with AI coach (also on WhatsApp)
/app/outcomes             "Did you get a job?" + retention check-ins
/app/settings             Language, notifications, WhatsApp link, accessibility
/app/settings/data        My data: download, correct, delete, consent history
```

### 2.4 Organization console (`/org`)
```
/org                      Dashboard (outcomes-first KPIs, funnel, alerts)
/org/cohorts              Cohorts list
/org/cohorts/new          Create cohort (wizard)
/org/cohorts/[id]         Cohort overview (funnel, skill heatmap, fairness panel)
/org/cohorts/[id]/learners    Learners table
/org/learners/[id]        Learner detail (timeline, evidence, passport, notes, outcomes)
/org/review               Human review queue
/org/verify               Third-party verification requests (trainer confirms a skill)
/org/opportunities        Opportunities & employer partners
/org/reports              Report builder + donor templates + exports
/org/assessments          Assessment library (enable/disable per cohort)
/org/settings             Org profile, branding (logo on passports), team & roles
/org/settings/billing     Plan, usage, invoices
/org/settings/data        DPA, retention settings, audit log (org-scoped)
```

### 2.5 Employer portal (`/employer`)
```
/employer                 Dashboard (open roles, pipeline, time-to-hire, 90-day retention)
/employer/roles           Role specs
/employer/roles/new       Reverse JD wizard (paste job ad → AI skill spec → assessment)
/employer/roles/[id]      Role detail: skill spec, assessment, candidate pipeline (kanban)
/employer/candidates/[id] Candidate view (anonymized until shortlist; evidence-first)
/employer/hires           Hires + retention check-ins (30/90/180)
/employer/settings        Company, team, branding, billing
```

### 2.6 Public
```
/p/[slug]                 Public Skills Passport
/verify/[credentialId]    Cryptographic verification result
```

### 2.7 Platform admin (`/admin`, internal only, IP-allowlisted + MFA)
```
/admin                    Platform health, usage, AI cost, error rates
/admin/tenants            Organizations & employers
/admin/taxonomy           Skills & occupations (ESCO / Lightcast / local layer), mapping review
/admin/rubrics            Rubrics (versioned BARS)
/admin/assessments        Assessment builder & item bank
/admin/prompts            Prompt registry (versioned, diff view, rollout %)
/admin/evals              Eval runs, golden sets, model–human agreement trends
/admin/fairness           Fairness audits across tenants
/admin/audit              Global audit log
/admin/flags              Feature flags
```

---

## 3. DESIGN SYSTEM

### 3.1 Creative direction: "Signal & Zellige"
- **Concept:** Evidence is a *signal* that cuts through noise. The visual language is a **living skills graph**: nodes (skills) connected by fine lines (evidence), arranged on a subtle **zellige-inspired geometric lattice** (8-point star geometry) that roots the brand in Morocco without folklore clichés.
- **Feel:** Deep confident blues, generous whitespace, crisp typography, and motion where things *connect, light up, and settle*. Premium fintech meets modern civic tech.
- **Avoid:** Stock photos of handshakes, generic purple AI gradients, robot imagery, glassmorphism overload, emoji-heavy UI.
- **Signature elements:**
  1. **The Lattice:** an SVG background pattern of 8-point stars built from thin lines at 4–6% opacity. It appears on hero, passport, and empty states.
  2. **The Evidence Dot:** a small circular indicator with 4 fill states (claimed → tested → verified → proven-on-job). It is used everywhere a skill appears.
  3. **The Signal Line:** a thin animated gradient line (blue → cyan) that "draws" between related elements during transitions.

### 3.2 Color tokens (blue is primary)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand-950` | #0A1A4A | — | Deep backgrounds, hero |
| `--brand-900` | #0F2A73 | — | Headings on light, footer |
| `--brand-700` | #1D47C9 | #8FB0FF | Hover/pressed primary |
| `--brand-600` | #2457F5 | #5B86FF | **Primary** (buttons, links, focus) |
| `--brand-500` | #3B6EFF | #3B6EFF | Charts series 1 |
| `--brand-300` | #8FB0FF | #1D47C9 | Borders on brand surfaces |
| `--brand-100` | #E6EEFF | #12245C | Tinted surfaces |
| `--brand-50` | #F3F7FF | #0C1838 | Page tint |
| `--signal` | #22D3EE | #22D3EE | Accent: signal line, live states, highlights (never body text on white) |
| `--sand` | #F4E9D8 | #2A2418 | Warm accent surfaces (testimonials, youth pages) |
| `--ink` | #0B1220 | #E8ECF5 | Body text |
| `--muted` | #5B6475 | #9AA3B5 | Secondary text |
| `--surface` | #FFFFFF | #0B1226 | Cards |
| `--canvas` | #F7F9FC | #070D1C | App background |
| `--border` | #E3E8F0 | #1C2742 | Dividers |
| `--success` | #12B76A | #32D583 | Verified, placed |
| `--warning` | #F79009 | #FDB022 | Needs review |
| `--danger` | #F04438 | #F97066 | Errors, destructive |

- Contrast: white on `--brand-600` ≈ 5.6:1 (passes AA). All text pairs must pass **WCAG 2.2 AA** (4.5:1 body, 3:1 large text/UI). Add an automated contrast test.
- **Evidence-level colors:** claimed `--muted`, tested `--brand-500`, verified `--success`, proven-on-job `--signal` with a soft glow ring. Every level also gets an icon and a label, so color is never the only signal.
- Dark mode: full support, follows system by default, toggle in settings. The marketing hero is always dark (`--brand-950`).

### 3.3 Typography (IBM Plex family only)
- **Latin:** IBM Plex Sans (400, 500, 600, 700). **Arabic and Darija:** IBM Plex Sans Arabic (400, 500, 600, 700). **Numbers in data and code, credential IDs:** IBM Plex Mono (400, 500).
- Load with `next/font`, subset, `display: swap`, and preload only weights used above the fold.
- Font stack: `"IBM Plex Sans", "IBM Plex Sans Arabic", system-ui, sans-serif`. When `dir="rtl"`, put Arabic first.
- **Type scale (rem, 1rem = 16px; fluid with clamp on marketing):**

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `display-xl` | clamp(2.75rem, 6vw, 4.5rem) / 1.05 | 700 | Home hero |
| `display` | clamp(2.25rem, 4vw, 3.25rem) / 1.1 | 700 | Section heroes |
| `h1` | 2rem / 1.2 | 600 | Page titles |
| `h2` | 1.5rem / 1.3 | 600 | Section titles |
| `h3` | 1.25rem / 1.4 | 600 | Card titles |
| `body-lg` | 1.125rem / 1.6 | 400 | Marketing body |
| `body` | 1rem / 1.6 | 400 | App body |
| `small` | 0.875rem / 1.5 | 400/500 | Meta, labels |
| `micro` | 0.75rem / 1.4 | 500, +2% tracking, uppercase in Latin only | Eyebrows, badges |
| `kpi` | 2.5rem / 1 | 600, Plex Mono, tabular-nums | Dashboard numbers |

- Arabic needs +0.1 line-height compared with Latin. Apply this via `:lang(ar)`.

### 3.4 Layout, spacing, shape, elevation
- **Spacing scale (px):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- **Grid:** marketing max-width 1200px, 12 columns, 24px gutter. App uses a 240px sidebar (collapsible to 72px) and fluid content capped at 1280px.
- **Breakpoints:** `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Design mobile-first, starting at 360px.
- **Radius:** `sm` 6, `md` 10, `lg` 14, `xl` 20, `2xl` 28, `full`. Cards use `lg` and modals use `xl`.
- **Elevation:** `e0` none; `e1` 0 1px 2px rgba(11,18,32,.06); `e2` 0 4px 12px rgba(11,18,32,.08); `e3` 0 12px 32px rgba(11,18,32,.12); `glow` 0 0 0 4px rgba(36,87,245,.15) for focus and active.
- **Focus ring:** 2px `--brand-600` plus a 2px offset. Always visible on keyboard focus.

### 3.5 Iconography & illustration
- **Icons:** Lucide, 1.5px stroke, sizes 16/20/24. Mirror directional icons in RTL (arrows, chevrons) but never mirror logos, media controls, or checkmarks.
- **Illustrations:** abstract geometric only (lattice, nodes, signal lines). No faces. Youth pages may use real photography *only* if it is properly licensed and shows real Moroccan contexts with consent. The default is abstract.
- **Logo:** wordmark "Bayyina" in Plex Sans 600 plus a mark of 3 nodes forming a check inside an 8-point star outline. `[TODO-DESIGN: final logo]`

### 3.6 Motion system
**Principles:** motion explains causality (A caused B), shows connection (evidence links to skill), and rewards progress. It never delays the user.

| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 80ms | linear | Color and opacity micro-feedback |
| `fast` | 160ms | cubic-bezier(0.2, 0, 0, 1) | Hover, press, toggles |
| `base` | 240ms | cubic-bezier(0.2, 0, 0, 1) | Dropdowns, tabs, toasts |
| `slow` | 400ms | cubic-bezier(0.3, 0, 0, 1) | Modals, drawers, page transitions |
| `story` | 700–1200ms | spring(stiffness 120, damping 20) | Hero, results reveal, passport issue |

- **Library:** Motion (Framer Motion) for React; CSS transitions for simple states; SVG + `requestAnimationFrame` (or Canvas 2D) for the hero graph. No heavy WebGL by default. An optional WebGL layer is allowed only if it can be lazy-loaded behind capability detection.
- **Reduced motion:** when `prefers-reduced-motion: reduce` is on, swap every transform animation for an opacity fade of 120ms or less, stop looping animations, and show the end state immediately.
- **Performance:** animate only `transform` and `opacity`. No layout thrash. Keep 60fps on a mid-range Android device (test on a throttled Moto G Power–class profile).

**Signature animations (exact behavior):**
1. **Hero "Constellation → Passport":** about 40 skill nodes float slowly on the lattice (drift ±6px, 8–14s loops). When the user scrolls 0–40% of the hero, the signal lines draw between 7 nodes (stroke-dashoffset, staggered 60ms). The 7 nodes then glide into a vertical stack that morphs into a Skills Passport card (shared-layout animation). Each Evidence Dot then fills in sequence (claimed → verified), with a soft cyan pulse on the last one. Scrolling up reverses everything. On mobile there is a simplified 16-node version, autoplayed once on load, with no scroll-scrub.
2. **Number tickers:** KPIs count up from 0 over 900ms (easeOut) when they first enter the viewport. They use tabular-nums so the width never jitters.
3. **Evidence Dot fill:** a radial fill over 400ms. Reaching "verified" triggers a 1-cycle ring ripple of 600ms.
4. **Assessment voice orb:** while the AI speaks, a circle scales with audio amplitude (0.96–1.08) and shows a slow gradient rotation. While the learner speaks, the orb shows a waveform ring. While processing, three dots orbit the circle.
5. **Results reveal:** the overall card fades up (y: 16 → 0). Skill bars then grow from 0 with a 80ms stagger. Each evidence quote slides in and highlights the phrase that justified the score (background sweep of 300ms).
6. **Passport issue moment:** the card flips in 3D (rotateY 90 → 0, 600ms spring) and a lattice shimmer runs across the surface once. The haptic `navigator.vibrate(20)` fires only on supported devices with a user setting enabled. **No confetti.** The tone is dignified, not childish.
7. **Page transitions (app):** content crossfades plus an 8px slide in the reading direction (flipped in RTL). Skeletons appear only after 300ms, which avoids a flash of skeleton.
8. **Kanban (employer):** cards lift (`e3`, scale 1.02) while dragged, and columns highlight on drag-over.
9. **Toasts:** slide in from the top (mobile) or bottom-end (desktop), auto-dismiss after 5s, and pause on hover.
10. **Lattice parallax:** the background lattice moves at 0.2× scroll speed on marketing pages. It is disabled with reduced motion.

### 3.7 Component library (build on shadcn/ui, restyled with these tokens)
For each component, implement these states: default, hover, focus-visible, active, disabled, loading, error, and (where relevant) empty. Each must work in RTL and in dark mode.

- **Primitives:** Button (primary, secondary, ghost, outline, destructive, link; sizes sm/md/lg; icon-only with aria-label), IconButton, Input, Textarea, Select, Combobox (async search, used for skills), Checkbox, Radio, Switch, Slider, DatePicker, PhoneInput (+212 default), OTPInput (6 digits, autofill `one-time-code`), FileDropzone (CSV and PDF), Tag, Badge, Avatar (initials only by default), Tooltip, Popover, DropdownMenu, Tabs, Accordion, Dialog, Drawer (bottom sheet on mobile), Toast, Alert/Banner, Progress (linear + ring), Skeleton, Stepper, Breadcrumbs, Pagination, EmptyState, ErrorState, Kbd.
- **Data:** DataTable (sorting, filtering, column visibility, row selection, sticky header, virtualized for >500 rows, CSV export, saved views), StatCard (KPI + delta + sparkline), Chart wrappers (line, bar, stacked bar, funnel, heatmap), FilterBar.
- **Domain components:**
  - `EvidenceDot` (level, size, tooltip explaining the level)
  - `SkillChip` (skill label, level 1–5, EvidenceDot)
  - `SkillBar` (level bar, confidence shown as a band, evidence count)
  - `PassportCard` (compact and full, with lattice background, org branding, QR)
  - `VoiceOrb` (states: idle, ai-speaking, listening, processing, error)
  - `TranscriptBubble` (with highlighted evidence spans)
  - `RubricViewer` (BARS levels, with the current level highlighted)
  - `ReviewPanel` (side-by-side model scores from 2 runs, transcript, override form)
  - `FunnelChart` (cohort stages)
  - `SkillHeatmap` (learners × skills)
  - `FairnessPanel` (pass rates by group, adverse-impact ratio, threshold line at 0.8, warning state)
  - `PathwayStep` (resource, estimated time, status, re-assessment link)
  - `RetentionCheck` (30/90/180-day status chips)
  - `ConsentCard` (versioned, plain language, expandable details)
  - `LanguageSwitcher` (العربية / الدارجة / Français / English)

### 3.8 Accessibility (WCAG 2.2 AA minimum)
- Full keyboard navigation and logical focus order, including in RTL. Add "Skip to content" links.
- Every voice assessment has an equivalent text mode, and text mode has a read-aloud option.
- Captions for all AI speech. The transcript is visible in real time.
- Touch targets ≥ 44×44px. Support font scaling up to 200% without breaking layout.
- Use ARIA live regions for assessment state changes and toasts.
- Screen-reader labels exist in all 4 languages.
- Automated checks: axe-core in CI, plus manual tests with NVDA, VoiceOver, and TalkBack.

### 3.9 Voice & tone (copy guidelines)
- **To youth:** warm, direct, respectful, never patronizing. Use short sentences and second person. Celebrate effort and evidence, and never promise jobs. In Darija, use Arabic script and everyday words (not heavy MSA). Never use slang that could feel mocking.
- **To institutions:** precise, outcome-focused, evidence-based, with numbers first.
- **To employers:** efficient, risk-reducing, and cost and time oriented.
- **Banned:** "revolutionary", "guaranteed job", "100% accurate", "AI decides", fear-based copy.

---

## 4. INTERNATIONALIZATION & RTL
- **Locales:** `ar` (Modern Standard Arabic, RTL), `ary` (Moroccan Darija in Arabic script, RTL), `fr` (default for org and employer surfaces), `en`.
- **Defaults:** learner surfaces default to `ary`; org and employer surfaces default to `fr`; marketing pages detect from the browser with a manual switcher.
- **Library:** `next-intl`. Message files go in `/messages/{locale}.json` with ICU plurals. Locale prefix in routes (`/ar/...`, `/fr/...`) on marketing pages; on app pages the locale comes from the user setting.
- **RTL:** set `dir` on `<html>`, use only CSS logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-end`), use Tailwind logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`), and mirror directional icons and transitions.
- **Numbers:** Western digits (0–9) everywhere for consistency with Moroccan usage on screens. Dates use `Intl.DateTimeFormat` per locale.
- **Assessment content** is authored per locale, not machine-translated at runtime. Machine translation is allowed only for drafts that a human then reviews.

---

## 5. PAGE-BY-PAGE SPECIFICATION

Format for each page: **Purpose · Layout & sections · Components · Data · States · Motion · Acceptance criteria.**

### 5.1 Home `/`
**Purpose:** in 5 seconds, each audience understands what Bayyina does and clicks its path. In 60 seconds, an institution books a demo.

**Sections (top to bottom):**
1. **Nav (sticky, transparent over the dark hero, then solid `--surface` with `e1` after 24px of scroll, 240ms):** logo; links: Institutions, Employers, Youth, How it works, Responsible AI, Pricing; LanguageSwitcher; "Sign in" (ghost); "Book a demo" (primary). Mobile: a hamburger opens a full-height drawer with a staggered link reveal.
2. **Hero (dark `--brand-950`, lattice background, min-height 92vh):**
   - Eyebrow (`micro`, `--signal`): "SKILLS INTELLIGENCE FOR YOUTH EMPLOYMENT"
   - H1 (`display-xl`, white): "Proof of skills, not promises."
   - Sub (`body-lg`, `--brand-300`): "Bayyina assesses what young people can really do, in Darija, French or Arabic, and turns it into verified proof that employers trust. Institutions see the outcome that matters: jobs that last."
   - CTAs: "Book a demo" (primary, large), "See a sample passport" (outline white, opens a modal with an interactive PassportCard).
   - Audience switch row: 3 pill links: "I run a training program →", "I hire →", "I'm looking for work →".
   - Right side or below on mobile: the **Constellation → Passport** animation (3.6 #1).
   - Trust strip under the fold edge: "Built for Law 09-08 · Human oversight · Fairness audited" with small icons.
3. **The problem (light):** 3 StatCards with tickers, sourced, each with a footnote link:
   - "29.2%" — "youth unemployment (15–24), Q1 2026" — source: HCP via press.
   - "3M+" — "young people not in employment, education or training" — source.
   - "1 in 700" — "hires actually changed by 'skills-based hiring' pledges" — source: Burning Glass Institute & HBS 2024.
   - Line below: "The problem isn't only skills. It's that nobody can see them."
4. **How it works (4 steps, horizontal on desktop with the Signal Line drawing between steps on scroll; vertical on mobile):** Assess → Verify → Share → Track outcomes. Each step has an icon, a title, a 2-line description, and a mini UI snapshot.
5. **Evidence model (the differentiator):** an interactive EvidenceDot ladder: claimed → tested → verified → proven on the job. Hovering or tapping each level shows an example and its "Trust weight". Caption: "Every skill on a Bayyina passport shows how we know."
6. **For institutions (split section):** left: copy + 4 bullets (cohort tracking, donor-ready reports, fairness panel, outcome-based pricing); right: an animated dashboard mock (funnel animating, KPI tickers). CTA: "Explore for institutions".
7. **For employers (split, reversed):** Reverse JD demo. A messy job ad on the left morphs into a structured skill spec on the right (typewriter plus chip pop-in). CTA: "Explore for employers".
8. **For youth (warm `--sand` section):** voice assessment preview with VoiceOrb and Darija copy: "هضر بالدارجة. وري شنو كتعرف دير." CTA: "I'm looking for work".
9. **Evidence from research:** a card citing the South Africa RCT: "Credible skill certificates raised employment by 5 points and earnings by 34% (AER 2022)." Link to /how-it-works.
10. **Responsible AI strip:** 4 icons + links: Human review · No names in scoring · Fairness audits · Your data, your control.
11. **Impact counters (only when real data exists; behind a feature flag):** "Assessments completed", "Passports issued", "Verified placements", "Still employed at 90 days". If a counter has no data yet, **hide the section entirely**. Never show fake numbers.
12. **Final CTA (dark, lattice):** "Make skills visible." + "Book a demo" + "Talk to us on WhatsApp".
13. **Footer:** 4 columns (Product, Audiences, Company, Legal), language switcher, social links, "© Bayyina", and "Made in Morocco".

**Acceptance:** Lighthouse mobile ≥ 90 performance, 100 accessibility, 100 SEO; LCP < 2.5s on 4G; hero animation lazy-loads after LCP; all stats link to sources; works in all 4 locales with RTL.

### 5.2 `/institutions`
Hero ("Show funders the outcomes, not the activity.") → pain points (manual reporting, losing track of graduates, no proof of skills) → feature deep-dives (Cohorts, Assessments, Passports co-branded with the institution's logo, Reports with donor templates, Fairness panel, Outcome tracking via WhatsApp check-ins) → interactive report preview → pricing teaser → FAQ (data hosting, CNDP, languages, integration, how verification works) → CTA "Book a demo".

### 5.3 `/employers`
Hero ("Hire on proof. Keep people longer.") → Reverse JD interactive demo (paste an ad and get a real AI result, rate-limited to 3 tries per IP per day, with no data stored except anonymized analytics) → candidate view preview (anonymized, evidence-first) → retention tracking → "Use your own branded assessment" → FAQ → CTA "Post a role".

### 5.4 `/youth`
Defaults to Darija. Hero: "ورّي شنو كتعرف دير، وخود الدليل" ("Show what you can do, and get proof."). Steps in 3 simple visuals. "It's free for you." (true in the B2B2C model; the institution pays). A "Join via WhatsApp" button opens a `wa.me` link with a prefilled join message. Short FAQs: Is it free? Who sees my results? Can I delete my data? Do you guarantee a job? (Answer: "No. We give you proof and a plan. The job is yours to win.")

### 5.5 `/how-it-works`
A long-form explainer: the evidence ladder, how AI scoring works (dual scoring, rubrics, human review), what the AI never sees, how the passport is verified (credential signatures), and how outcomes improve the model. Include a diagram (SVG) of the core loop.

### 5.6 `/responsible-ai`
Sections: Human oversight; Fairness (methodology, adverse-impact ratio, how often audits run, latest aggregate results once available); Privacy (Law 09-08, data minimization, retention periods, where data is stored); Transparency (AI notice, model cards per assessment); Contestability (how a learner requests human review); Changelog of model and rubric versions.

### 5.7 `/pricing`
Three cards plus a custom tier. Prices stay `[TODO-PRICING]` and must be configurable from the admin, not hardcoded.
- **Starter (training centers):** per learner per cohort; assessments, passports, basic reports.
- **Program (NGOs, donor programs):** adds donor report templates, outcome tracking, fairness panel, co-branding.
- **Employer:** per role or per assessed candidate; Reverse JD, branded assessments, pipeline, retention.
- **Enterprise / Public:** custom; SSO, data residency, SLA, API.
Below: a usage calculator (slider: learners per year → estimated cost), an FAQ, and "Outcome-based pricing available for qualifying programs."

### 5.8 `/impact`
Live counters (only real data, see 5.1 #11) + case studies (only real, with written permission) + methodology notes. If there are no case studies yet: "We publish outcomes as soon as our first cohorts reach 90 days. Want to be a founding partner?" + CTA.

### 5.9 `/about`, `/contact`
**About:** mission, why Morocco, team (real people only), advisors, partners (logos only with permission).
**Contact:** form (name, org, role, email, phone optional, audience type, message, consent checkbox) protected by Cloudflare Turnstile and rate limiting. Includes an embedded scheduling link `[TODO: Cal.com URL]` and a WhatsApp button. Submitting creates a `leads` row and sends a notification email.

### 5.10 `/verify` and `/verify/[credentialId]`
Input: credential ID, or a QR scan through the camera (ask permission; uses a JS QR library). The result shows **Valid / Revoked / Expired / Not found** with issuer, holder initials only (unless the holder made the passport public), skills, evidence types, issue date, and signature check details (expandable, Plex Mono). **Motion:** a 600ms check-mark draw for Valid; Revoked shows a red banner with a reason code.

### 5.11 Legal pages
Privacy policy (Law 09-08: controller identity, purposes, legal bases, recipients, transfers, retention, rights, CNDP declaration number `[TODO]`, contact), Terms, AI notice (Art. 50-style transparency language plus a plain-language summary), Cookies (essential only by default; analytics only with consent through a banner that offers equal "Accept" and "Reject" buttons). Every legal page is available in all 4 locales. **A lawyer must review these. Mark each page "Draft — pending legal review" until that happens.**

### 5.12 Auth
- **Learners:** phone + SMS/WhatsApp OTP (Supabase Auth phone provider or a custom OTP over WhatsApp). A magic link through WhatsApp is optional.
- **Org/employer:** email + password with zxcvbn strength meter, or magic link, plus optional Google/Microsoft SSO. MFA (TOTP) is required for `org_admin` and `platform_admin`.
- **Invite flow:** a token link opens a prefilled screen, the user sets credentials, and lands in the right surface.
- **States:** wrong OTP (shake 200ms + message), expired OTP (resend after 30s countdown), rate limited (friendly message), and account locked.

### 5.13 Learner onboarding `/onboarding/learner`
Steps (Stepper, one question per screen, big touch targets):
1. **Language:** 4 big cards with text in their own language and a play-audio sample.
2. **Welcome:** a 20-second voice + text explanation: what Bayyina is, that it's free, and that the AI evaluates answers and humans can review.
3. **Consent (ConsentCard):** plain-language bullets with "Read full notice" expandable. Separate toggles: (a) required processing for assessments; (b) share passport with my organization (default on, required in a cohort); (c) WhatsApp messages (optional); (d) use my anonymized data to improve assessments (optional, default off); (e) employer outcome check-ins (optional). Store the consent version and timestamp for each toggle. The user can't proceed without (a).
4. **Basics:** birth year (age gate: 18–29 in v1; under 18 is blocked with a kind message), region (dropdown of the 12 regions), education level, current status, target job areas (multi-select chips; max 3).
5. **Mic check:** record 3 seconds and play it back, with a noise warning if needed. Fallback: "Use text instead".
6. **First step:** "Your first assessment takes ~12 minutes" → Start now or remind me later (WhatsApp reminder).
**Motion:** steps slide in the reading direction; the progress bar fills smoothly.
**Acceptance:** completes in < 3 minutes; works offline-tolerant (state is saved after each step); fully usable at 360px width.

### 5.14 Learner Home `/app`
- Header: greeting by **first name only** (never full name), language switch, notification bell.
- **"Your next step" card** (one primary action at a time): e.g., "Complete: Customer communication assessment (12 min)".
- **Progress ring:** passport strength (0–100) = weighted share of target-occupation skills that have evidence ≥ tested.
- **Passport preview** (compact PassportCard) → "Share".
- **Pathway snippet:** the next 2 steps.
- **Opportunities:** up to 3 cards (if any).
- **Bottom nav (mobile):** Home, Assessments, Passport, Coach, More.
**Empty state** (new user): illustration (lattice + single node) + "Let's create your first proof."

### 5.15 Assessments list `/app/assessments`
Tabs: Available, In progress, Completed. Each card shows the title, skills covered (chips), duration, mode (voice/text/simulation), and status. Completed cards show the result summary and a "Retake available in X days" cooldown (default 14 days, configurable per assessment).

### 5.16 Assessment intro `/app/assessments/[id]/intro`
What we measure (skills + rubric summary in plain words), how long, the format, tips ("Answer like you would at work. There are no trick questions."), the integrity note ("Answer yourself; we may ask follow-up questions."), the AI notice, mode selection (Voice recommended / Text), mic check status, and a "Start" button.

### 5.17 Assessment session `/app/assessments/[id]/session` (the hero experience)
- **Layout (mobile):** top bar with progress ("Question 3 of 7"), a timer (soft, not stressful; hidden by default; toggle), and a pause/exit menu; center VoiceOrb; bottom live transcript (collapsible) + controls (hold-to-talk or tap-to-toggle, "Repeat question", "Switch to text").
- **Flow:**
  1. The AI interviewer introduces itself and the scenario (TTS + caption).
  2. For each item: the question is delivered, the learner answers (voice → streaming STT, or text), and the AI may ask **at most 1 follow-up per item**, chosen by the follow-up policy (Section 8.4.3) to deepen evidence. The follow-up is never a hint.
  3. **Simulation items:** e.g., a role-play with an "angry customer" voice persona (the AI plays the customer for up to 4 turns), or a task card ("Sort these 6 orders by priority" with a drag-and-drop UI), or an email-reply task.
  4. Integrity signals are collected silently: paste events, tab switches, response latency anomalies, and very long pauses followed by fluent long answers. These are **flags for human review only, never automatic penalties**.
- **Autosave:** every answer is saved immediately; resumes after disconnection from the last completed item.
- **Network resilience:** if streaming fails, fall back to record-then-upload (chunked, retried with backoff).
- **Exit:** a confirm dialog saves progress; the user can resume within 72h.
- **Acceptance:** voice round-trip (end of speech → AI reply starts) under 1.5s p50 and 3s p95 on 4G; works on Android Chrome 100+ and iOS Safari 16+; text mode has full parity.

### 5.18 Assessment done `/app/assessments/[id]/done`
Calm confirmation animation (a node connects to the lattice). "Your answers are being scored. Results in about 2 minutes (or up to 48h if a human reviewer checks them)." Option to get notified on WhatsApp. Suggests the next step.

### 5.19 Results `/app/results/[attemptId]`
- An overall summary card (no single "score out of 100"; show the levels per skill instead).
- For each skill: a SkillBar (level 1–5 with a confidence band), the BARS description of the achieved level and of the next level ("To reach level 4: ..."), **2 evidence quotes** from the learner's own answers with highlighted spans, and the EvidenceDot (tested).
- "Was this fair?" → a "Request human review" button (creates a review task; status visible).
- CTAs: "Add to my passport" (default on), "See my pathway".
- **Motion:** results reveal (3.6 #5).
- **If the result is still pending human review:** a "Under review" state showing an estimated time.

### 5.20 Passport `/app/passport`
- A full PassportCard: header with an initials avatar, first name + last initial (full name only if the learner opts in), target occupations, issuing org logo(s), and the lattice background.
- Skills grouped by occupation relevance and sorted by evidence strength; each shows a SkillChip with its EvidenceDot.
- **Visibility controls:** for each skill, show or hide. The whole passport is Private, Link-only, or Public.
- **Share:** copy link, WhatsApp share, QR code (downloadable PNG), PDF download (server-rendered, A4, with embedded QR and credential ID), and LinkedIn "Add to profile" (certification URL).
- **Credential:** each issued skill evidence is signed as a Verifiable Credential (Open Badges 3.0 / W3C VC data model). Show the credential ID in Plex Mono with a "Verify" link.
- **Motion:** passport issue moment (3.6 #6) the first time.
- **Acceptance:** PDF renders identically in all locales (Arabic shaping correct, RTL layout); a QR scan opens `/verify/[id]`.

### 5.21 Pathway `/app/pathway`
- Target occupation selector (from the learner's targets) → gap view: required skills vs. current evidence (a radial chart or a stacked list).
- Ordered steps (PathwayStep): "Practice: ...", "Learn: [free resource]", "Prove: retake the X assessment", "Get verified: ask your trainer to confirm Y".
- Each resource shows the language, duration, cost (free first), and source. Resources come from the curated `learning_resources` table, **never invented by the LLM**.
- Weekly goal + WhatsApp nudges (if consented).

### 5.22 Opportunities `/app/opportunities`
Opportunity cards (shared by the org or employer partners) show the title, employer, location, contract type, required skills with a "your match" indicator (shown as "You have proof for 4 of 6 required skills", never as a percentage score), deadline, and an "Apply with passport" button (one tap; it shares the link-only passport with the employer). Includes an applications tracker (applied → viewed → interview → offer → hired / not selected).

### 5.23 Coach `/app/coach`
A chat + voice interface (same VoiceOrb). Capabilities: explain results, interview practice (mock interview using the role spec), pathway questions, motivation and check-ins. **Hard limits:** no job guarantees, no medical/legal/financial advice, and for distress signals a safe, kind escalation message with human support contacts configured per org `[TODO: org-configured contacts]`. Conversation history is visible and deletable.

### 5.24 Outcomes `/app/outcomes`
"Did you find a job?" form (employer name optional, start date, contract type, salary band optional, how Bayyina helped). Retention check-ins at 30/90/180 days (prefilled through WhatsApp). A small thank-you animation. This data powers the moat, so make it **effortless (≤ 3 taps)**.

### 5.25 Settings & My data `/app/settings`, `/app/settings/data`
Language, notifications, WhatsApp link/unlink, accessibility (text size, reduced motion override, captions always on), theme. **My data:** consent history with toggles (withdrawal takes effect immediately), download my data (JSON + PDF summary), request correction, and delete account (a 7-day grace period, then hard delete of identity data plus anonymization of evidence kept for aggregate statistics only if consent (d) was given; otherwise delete everything).

### 5.26 Org dashboard `/org`
- **KPI row (StatCards with tickers and 30-day deltas):** Verified placements retained at 90 days (North Star, emphasized with a `--signal` ring), Placement rate, Employer response rate, Avg. time-to-job, Assessments completed, Passports issued.
- **Funnel chart** across all active cohorts: Enrolled → Assessed → Passport issued → Applied → Hired → Retained 90d.
- **Alerts panel:** "12 scores awaiting review", "Cohort B: 40% haven't started", "Fairness warning: pass-rate ratio 0.74 for region group".
- **Cohort cards** grid.
- Quick actions: New cohort, Import learners, Generate report.
- **Empty state** (new org): a 4-step setup checklist with progress.

### 5.27 Cohorts `/org/cohorts`, `/org/cohorts/new`, `/org/cohorts/[id]`
- **List:** DataTable with name, program, dates, size, stage progress bar, placement rate, and status.
- **New (wizard):** name & program → dates → target occupations (from taxonomy) → assessments to include → learners (CSV import with column mapping + validation preview + error rows download, or invite link / QR to join) → review & create.
- **Detail:** header with KPIs; tabs: Overview (funnel, timeline), Learners (DataTable: initials/name per role permission, status, passport strength, last activity, flags), Skills (SkillHeatmap learners × skills, sortable; click a cell to open the evidence), Fairness (FairnessPanel by gender, region, language, education level; shows the adverse-impact ratio; groups smaller than n<20 are not shown, to prevent re-identification and noise), Outcomes (placements, retention chart), Settings.

### 5.28 Learner detail `/org/learners/[id]`
Profile summary (identity visible only to roles with permission), timeline (all events), evidence list (filter by skill and type), passport preview, pathway status, coach notes (private to staff), outcome records, "Request trainer verification" action, and an audit trail of who viewed or changed what.

### 5.29 Review queue `/org/review`
- Queue table: priority (disagreement size, learner request, integrity flag), assessment, skill, wait time, and assignee.
- **Review screen (ReviewPanel):** left: transcript with audio player (waveform, 1×/1.5×/2× speed, click a transcript line to jump to its audio); right: the rubric (RubricViewer), model run A and run B (level, justification, quotes), integrity flags, and a decision form (Agree with A / Agree with B / Override level [1–5] with a required note). Keyboard shortcuts: `1–5` set level, `A`/`B` agree, `Enter` submit, `J`/`K` next/previous.
- **Reviewer blinding:** no name, photo, region, or gender shown.
- **Calibration mode:** 10% of items are randomly re-sent to a second reviewer to measure inter-rater agreement.

### 5.30 Third-party verification `/org/verify`
A trainer gets a request ("Confirm Yasmine K. can do: Excel – pivot tables, level 3"). The trainer sees the evidence and confirms, adjusts, or declines, with an optional comment. Confirmation upgrades the evidence type to `third_party_verified` and signs it. Also available as a one-tap WhatsApp flow for trainers (link plus OTP).

### 5.31 Opportunities & partners `/org/opportunities`
Add opportunities (manually or from employer partners), share them with cohorts or selected learners, and track applications. The employer partners list shows hires and retention per employer.

### 5.32 Reports `/org/reports`
- **Templates:** Cohort Outcome Report, Donor Report (configurable sections and logo), Skills Gap Report, Fairness Report.
- **Builder:** pick a template, cohorts, date range, sections, and language → live preview → export PDF (server-rendered, branded) or XLSX (raw tables).
- Scheduled reports (monthly email to stakeholders).
- **Every number in a report links to its definition** (metric dictionary, Section 11).

### 5.33 Org settings
Profile, branding (logo, primary color override restricted to accessible contrast, passport co-branding preview), team & roles (invite, change role, remove, MFA status), billing (plan, usage meters: learners, assessments, AI minutes; invoices; payment method via the payment provider `[TODO: choose: Stripe-supported entity / CMI for Moroccan cards]`), data (DPA download, retention settings within platform limits, org-scoped audit log, data export).

### 5.34 Employer dashboard `/employer`
KPIs: open roles, candidates assessed, time-to-shortlist, hires, retention at 90 days, and cost saved (estimated, with a shown formula). Pipeline overview. Retention check-ins due.

### 5.35 Reverse JD wizard `/employer/roles/new` (key "wow" feature)
1. **Paste** a job ad (or upload a PDF/DOCX) in any language.
2. **AI analysis (streaming, ~10s):** a skeleton skill spec fills in live with a chip pop-in animation. Output: role title (normalized to an occupation), must-have skills (with minimum level), nice-to-have skills, flagged problematic requirements ("'good appearance' is not a job-related skill and may be discriminatory: remove?"; "'young' is age discrimination: remove?"), and a suggested assessment (from the library) with an estimated duration.
3. **Edit:** drag skills between must-have and nice-to-have, adjust levels, add skills through the taxonomy combobox.
4. **Publish:** generates a shareable apply link (QR + WhatsApp text), or an invite list.
**Acceptance:** problematic requirement detection covers at least age, gender, appearance, marital status, religion, origin, and photo requirements, in FR, AR, Darija, and EN; each suggestion has a "why" tooltip.

### 5.36 Role detail & candidate pipeline `/employer/roles/[id]`
- Kanban columns: Invited → Assessed → Shortlisted → Interview → Offer → Hired / Not selected. Drag and drop, with bulk actions.
- **Candidate cards are anonymized** until "Shortlisted" (show a candidate code, evidence summary, and match "4/6 required skills proven"). Identity is revealed only after shortlisting and only if the candidate has consented to share it with that employer.
- Sorting by evidence strength is allowed; **ranking by a single opaque AI score is not provided**.
- Each move logs who did it and when (audit).

### 5.37 Candidate view `/employer/candidates/[id]`
Evidence-first: skills vs. the role spec (proven / partially / missing), evidence quotes, audio snippets (if the candidate consented), third-party verifications, and passport link. A notes panel (private to the employer). Actions: Shortlist, Invite to interview (message template via WhatsApp/email), Reject (with an optional reason; the learner gets a kind, generic message and a pathway suggestion).

### 5.38 Hires & retention `/employer/hires`
A list of hires with check-in status. At 30/90/180 days the employer gets a 1-click check-in: "Still employed? [Yes / No]" + an optional 1–5 performance rating on the role's must-have skills. This data closes the loop and feeds validity analysis.

### 5.39 Admin pages (`/admin/*`)
- **Taxonomy:** browse and search skills (ESCO/Lightcast/local); a mapping review queue for local→ESCO mappings proposed by the embeddings and LLM; approve or reject; versioning.
- **Rubrics:** a BARS editor (levels 1–5 with behavioral anchors per locale), version history with diff, and "publish" creating an immutable version.
- **Assessments:** a builder (items, item types: open voice, role-play, SJT, task-sort, email-reply; per-item rubric links; follow-up policy; cooldowns), an item bank with exposure counts, and a preview-as-learner mode.
- **Prompts:** a registry (name, version, template, model, temperature, JSON schema), diff view, eval results per version, and rollout percentage (A/B).
- **Evals:** golden sets (upload or label in the UI), run evals (choose prompt and model versions), and metrics (exact agreement, within-1 agreement, quadratic weighted kappa, run-to-run consistency, cost per item, latency), with trend charts and regressions highlighted.
- **Fairness:** cross-tenant aggregate audits (only aggregated, minimum group sizes).
- **Audit:** searchable immutable log.
- **Flags:** feature flags per tenant and globally.

### 5.40 Global states (apply everywhere)
- **Loading:** skeletons that match the final layout, shown after 300ms.
- **Empty:** a lattice illustration, a one-line explanation, and one primary action.
- **Error:** a human message, a retry button, a support code (request ID), and no stack traces.
- **Offline (PWA):** a banner "You're offline. We'll save your progress." Queue mutations and replay them on reconnect.
- **Permission denied:** an explanation plus how to request access.
- **404/500:** branded, with a link home and the lattice animation in reduced form.

---

## 6. FRONTEND ARCHITECTURE

### 6.1 Stack
- **Framework:** Next.js (latest stable, App Router), React Server Components by default, Client Components only where interactive.
- **Language:** TypeScript strict.
- **Styling:** Tailwind CSS with design tokens as CSS variables (Section 3.2) mapped in the Tailwind config; shadcn/ui primitives restyled; `class-variance-authority` for variants; `tailwind-merge`.
- **Animation:** Motion (Framer Motion) + CSS; a custom SVG/Canvas hero.
- **Data fetching:** server actions + route handlers; TanStack Query on the client for live data (review queue, session state).
- **Forms:** react-hook-form + zod (schemas shared with the server).
- **Charts:** Recharts (or visx for the heatmap), themed with tokens.
- **Tables:** TanStack Table + virtualization.
- **i18n:** next-intl.
- **Audio:** Web Audio API + MediaRecorder; WebRTC/WebSocket for the realtime voice session.
- **PWA:** installable, offline shell, background sync for queued mutations.
- **QR:** a lightweight QR generation library plus a scanner library.
- **PDF:** server-side rendering (React-PDF or a headless browser) with embedded Plex fonts (Arabic shaping verified).

### 6.2 Project structure
```
/app
  /(marketing)/[locale]/...       public pages
  /(auth)/auth/...                auth
  /(learner)/app/...              learner app
  /(org)/org/...                  org console
  /(employer)/employer/...        employer portal
  /(public)/p/[slug], /verify/... public passport & verify
  /(admin)/admin/...              internal admin
  /api/...                        route handlers (webhooks, uploads, realtime tokens)
/components
  /ui        primitives (shadcn-based)
  /domain    EvidenceDot, PassportCard, VoiceOrb, ReviewPanel...
  /charts    chart wrappers
  /motion    shared animation variants & hooks (useReducedMotion wrapper)
  /marketing hero constellation, sections
/lib
  /db        supabase clients (server, browser, service-role restricted to server)
  /ai        model router, prompt registry client, schemas, scorers, evals
  /voice     STT/TTS adapters, realtime session manager
  /whatsapp  Cloud API client, templates, webhook handlers
  /credentials  VC signing/verification
  /auth      role guards, permissions matrix
  /i18n      config, formatters
  /analytics event tracking (privacy-safe)
  /validation zod schemas
/messages    ar.json, ary.json, fr.json, en.json
/prompts     versioned prompt templates (.md + .schema.json)
/evals       golden sets, runner scripts, reports
/supabase    migrations, seed, policies, functions
/tests       unit, integration, e2e (Playwright), a11y, visual
```

### 6.3 Performance budgets
- Marketing: JS ≤ 170KB gzipped on the initial route (hero animation code-split); LCP < 2.5s; CLS < 0.05; INP < 200ms.
- App: route JS ≤ 250KB gzipped; first interaction < 3s on 4G at mid-range.
- Images: next/image, AVIF/WebP, explicit sizes.
- Fonts: subset; at most 4 weights preloaded.

### 6.4 SEO
Metadata per page and locale, `hreflang` alternates, OpenGraph images generated per page (lattice + title), sitemap.xml, robots.txt (block `/app`, `/org`, `/employer`, `/admin`, and `/p/*` unless the passport is public and the owner enabled indexing; default `noindex`), and structured data (Organization, FAQPage).

---

## 7. BACKEND

### 7.1 Platform
- **Database & auth & storage:** Supabase (Postgres + pgvector + Auth + Storage + Realtime).
- **Server logic:** Next.js route handlers/server actions for request-response work; **background jobs** through a durable job runner (Inngest or Trigger.dev) for scoring, transcription, report generation, WhatsApp campaigns, retention check-ins, and evals.
- **Caching & rate limiting:** Upstash Redis (or an equivalent) for rate limits, idempotency keys, and hot caches (taxonomy lookups).
- **Email:** a transactional provider (e.g., Resend/Postmark) with locale templates.
- **Observability:** Sentry (errors, no PII), OpenTelemetry traces, LLM tracing (Langfuse or equivalent), uptime monitoring.
- **Data residency:** the region is configurable. Document where each processor stores data (Section 12.2). Public-sector tenants may require hosting in Morocco: design the storage and DB access through an abstraction so the region can move.

### 7.2 Database schema (Postgres)
All tables have `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, and `updated_at` maintained by trigger. Soft delete (`deleted_at`) where noted.

```sql
-- ===== Tenancy & users =====
create table organizations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('training_center','ngo','university','public_agency','employer','platform')),
  name text not null, slug text unique not null, country text default 'MA',
  logo_url text, brand_color text, plan text default 'trial', settings jsonb default '{}',
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);
create table profiles (            -- one per auth user
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text default 'fr', display_first_name text, mfa_enabled boolean default false,
  created_at timestamptz default now()
);
create table memberships (
  user_id uuid references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  role text not null check (role in ('org_admin','coach','trainer','reviewer','recruiter','viewer')),
  primary key (user_id, org_id)
);
create table platform_admins (user_id uuid primary key references auth.users(id));

-- ===== Learners (identity separated) =====
create table learners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id),
  birth_year int check (birth_year between 1990 and 2010),
  region_code text, education_level text, current_status text,
  locale text default 'ary', target_occupation_ids uuid[] default '{}',
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);
create table learner_identity (    -- PII, restricted access, never sent to LLM scoring
  learner_id uuid primary key references learners(id) on delete cascade,
  first_name text, last_name text, phone_e164 text, email text,
  gender text, -- optional, self-declared, used ONLY for aggregate fairness audits
  created_at timestamptz default now()
);
create table learner_orgs (        -- a learner can belong to several orgs
  learner_id uuid references learners(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  cohort_id uuid, status text default 'active',
  share_passport boolean default true, joined_at timestamptz default now(),
  primary key (learner_id, org_id)
);
create table consents (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references learners(id) on delete cascade,
  purpose text not null check (purpose in ('core_processing','share_with_org','whatsapp','model_improvement','outcome_checkins','share_identity_with_employer')),
  granted boolean not null, notice_version text not null, locale text not null,
  granted_at timestamptz default now(), withdrawn_at timestamptz
);

-- ===== Cohorts =====
create table cohorts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null, program text, starts_on date, ends_on date,
  target_occupation_ids uuid[] default '{}', assessment_ids uuid[] default '{}',
  status text default 'active', created_at timestamptz default now()
);

-- ===== Taxonomy =====
create table skills (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('esco','lightcast','local')),
  external_id text, label jsonb not null,        -- {"fr":"..","ar":"..","ary":"..","en":".."}
  description jsonb, skill_type text,            -- 'transversal','technical','language','tool'
  embedding vector(1536),                        -- dimension must match the chosen embedding model
  esco_mapping_id uuid references skills(id), status text default 'active',
  taxonomy_version text, created_at timestamptz default now()
);
create index on skills using hnsw (embedding vector_cosine_ops);
create table occupations (
  id uuid primary key default gen_random_uuid(),
  source text, external_id text, isco_code text, label jsonb not null, description jsonb
);
create table occupation_skills (
  occupation_id uuid references occupations(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  importance text check (importance in ('essential','optional')),
  min_level int check (min_level between 1 and 5),
  primary key (occupation_id, skill_id)
);
create table skill_relations (
  skill_id uuid references skills(id), related_skill_id uuid references skills(id),
  relation text check (relation in ('broader','narrower','adjacent')), weight real,
  primary key (skill_id, related_skill_id, relation)
);

-- ===== Rubrics, assessments, items =====
create table rubrics (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid references skills(id), version int not null,
  levels jsonb not null,  -- [{level:1, anchors:{fr,ar,ary,en}, examples:[...]}, ...]
  status text default 'draft' check (status in ('draft','published','retired')),
  published_at timestamptz, unique (skill_id, version)
);
create table assessments (
  id uuid primary key default gen_random_uuid(),
  slug text unique, title jsonb, description jsonb, version int not null,
  modes text[] default '{voice,text}', est_minutes int, cooldown_days int default 14,
  target_skill_ids uuid[] not null, status text default 'draft', owner_org_id uuid -- null = platform library
);
create table assessment_items (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments(id) on delete cascade,
  position int, type text check (type in ('open_voice','roleplay','sjt','task_sort','email_reply','short_text')),
  content jsonb not null,           -- per-locale prompt, persona, options, task data
  skill_ids uuid[] not null, rubric_ids uuid[] not null,
  followup_policy jsonb, max_followups int default 1, exposure_count int default 0
);

-- ===== Attempts & evidence =====
create table assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments(id), learner_id uuid references learners(id),
  org_id uuid references organizations(id), mode text, locale text,
  status text default 'in_progress' check (status in ('in_progress','submitted','scoring','needs_review','scored','invalidated','expired')),
  started_at timestamptz default now(), submitted_at timestamptz, scored_at timestamptz,
  integrity_flags jsonb default '[]'
);
create table attempt_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references assessment_attempts(id) on delete cascade,
  item_id uuid references assessment_items(id), turn int,
  speaker text check (speaker in ('ai','learner')),
  text text, audio_path text, audio_expires_at timestamptz,
  started_at timestamptz, ended_at timestamptz, meta jsonb
);
create table score_runs (           -- each independent AI scoring run
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references assessment_attempts(id) on delete cascade,
  skill_id uuid references skills(id), run_label text,   -- 'A','B'
  level int, confidence real, justification text, evidence_quotes jsonb,
  model text, prompt_version text, rubric_version int, latency_ms int, cost_usd numeric(10,5),
  created_at timestamptz default now()
);
create table human_reviews (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references assessment_attempts(id), skill_id uuid references skills(id),
  reviewer_id uuid references auth.users(id), reason text, -- 'disagreement','learner_request','integrity','calibration','low_confidence'
  decision text check (decision in ('agree_a','agree_b','override')),
  final_level int, note text, created_at timestamptz default now(), completed_at timestamptz
);
create table skill_evidence (       -- the canonical, aggregated truth shown in passports
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references learners(id), skill_id uuid references skills(id),
  level int check (level between 1 and 5), confidence real,
  evidence_type text check (evidence_type in ('claimed','inferred','tested','work_sample','interview','third_party_verified','on_job')),
  source_attempt_id uuid, source_verification_id uuid, issuer_org_id uuid,
  scored_by text check (scored_by in ('model','human','hybrid')),
  assessed_at timestamptz, expires_at timestamptz, visible boolean default true,
  credential_id uuid, revoked_at timestamptz, revoke_reason text
);
create table verifications (        -- third-party (trainer) confirmations
  id uuid primary key default gen_random_uuid(),
  learner_id uuid, skill_id uuid, requested_by uuid, verifier_user_id uuid, org_id uuid,
  status text check (status in ('pending','confirmed','adjusted','declined')),
  level int, comment text, created_at timestamptz default now(), resolved_at timestamptz
);

-- ===== Passports & credentials =====
create table passports (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid unique references learners(id) on delete cascade,
  slug text unique not null,            -- random, non-guessable (>= 22 chars)
  visibility text default 'private' check (visibility in ('private','link','public')),
  show_full_name boolean default false, allow_indexing boolean default false,
  updated_at timestamptz default now()
);
create table credentials (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid references skill_evidence(id), issuer_org_id uuid,
  vc_json jsonb not null, signature text not null, key_id text not null,
  status text default 'valid' check (status in ('valid','revoked','expired')),
  issued_at timestamptz default now()
);

-- ===== Employers, roles, applications, outcomes =====
create table roles (
  id uuid primary key default gen_random_uuid(),
  employer_org_id uuid references organizations(id), title text, occupation_id uuid,
  source_text text, location text, contract_type text,
  skill_spec jsonb not null,  -- [{skill_id, importance, min_level}]
  flagged_requirements jsonb default '[]', assessment_id uuid, status text default 'draft',
  apply_slug text unique, created_at timestamptz default now()
);
create table opportunities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid, role_id uuid, title text, employer_name text, location text,
  details jsonb, deadline date, audience jsonb, status text default 'open'
);
create table applications (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid, role_id uuid, opportunity_id uuid, employer_org_id uuid,
  stage text default 'applied' check (stage in ('invited','applied','assessed','shortlisted','interview','offer','hired','not_selected','withdrawn')),
  identity_shared boolean default false, notes_private text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table placements (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid, employer_org_id uuid, employer_name text, occupation_id uuid,
  start_date date, contract_type text, wage_band text,
  source text check (source in ('learner_report','employer_report','org_report')),
  verified boolean default false, created_at timestamptz default now()
);
create table retention_checks (
  id uuid primary key default gen_random_uuid(),
  placement_id uuid references placements(id) on delete cascade,
  day int check (day in (30,90,180)), due_on date,
  still_employed boolean, performance jsonb, reported_by text, reported_at timestamptz
);

-- ===== Labor market =====
create table job_postings (
  id uuid primary key default gen_random_uuid(),
  source text, source_ref text, region_code text, sector text, title text,
  raw_text text, posted_at date, occupation_id uuid, ingested_at timestamptz default now()
);
create table posting_skills (posting_id uuid, skill_id uuid, confidence real, primary key (posting_id, skill_id));

-- ===== Learning =====
create table learning_resources (
  id uuid primary key default gen_random_uuid(),
  skill_ids uuid[], title jsonb, url text, provider text, locale text,
  est_minutes int, cost text default 'free', quality_rating real, status text default 'active'
);
create table pathways (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid, target_occupation_id uuid, steps jsonb, generated_by text, prompt_version text,
  created_at timestamptz default now()
);

-- ===== Coach =====
create table coach_threads (id uuid primary key default gen_random_uuid(), learner_id uuid, channel text, created_at timestamptz default now());
create table coach_messages (
  id uuid primary key default gen_random_uuid(), thread_id uuid references coach_threads(id) on delete cascade,
  role text, content text, audio_path text, safety_flags jsonb, created_at timestamptz default now()
);

-- ===== Governance =====
create table ai_decision_log (
  id bigint generated always as identity primary key,
  org_id uuid, entity text, entity_id uuid, task text, model text, prompt_version text,
  input_hash text, output jsonb, tokens_in int, tokens_out int, cost_usd numeric(10,5),
  latency_ms int, created_at timestamptz default now()
);
create table fairness_audits (
  id uuid primary key default gen_random_uuid(),
  scope text, org_id uuid, cohort_id uuid, assessment_id uuid, attribute text, group_value text,
  n int, pass_rate real, mean_level real, impact_ratio real, period_start date, period_end date,
  created_at timestamptz default now()
);
create table audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid, org_id uuid, action text, entity text, entity_id uuid,
  diff jsonb, ip_hash text, created_at timestamptz default now()
);
create table prompt_versions (
  id uuid primary key default gen_random_uuid(),
  name text, version text, model text, params jsonb, template text, output_schema jsonb,
  status text default 'draft', rollout_pct int default 0, created_at timestamptz default now(),
  unique (name, version)
);
create table eval_runs (
  id uuid primary key default gen_random_uuid(),
  prompt_name text, prompt_version text, model text, golden_set text,
  metrics jsonb, created_at timestamptz default now()
);
create table leads (id uuid primary key default gen_random_uuid(), data jsonb, created_at timestamptz default now());
create table usage_meters (org_id uuid, period date, metric text, value numeric, primary key (org_id, period, metric));
```

### 7.3 Row Level Security (pattern, mandatory on every table)
```sql
alter table cohorts enable row level security;

create or replace function is_org_member(target_org uuid, roles text[] default null)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships m
    where m.user_id = auth.uid() and m.org_id = target_org
      and (roles is null or m.role = any(roles))
  );
$$;

create policy "org members read cohorts" on cohorts
  for select using (is_org_member(org_id));
create policy "org admins/coaches write cohorts" on cohorts
  for all using (is_org_member(org_id, array['org_admin','coach']))
  with check (is_org_member(org_id, array['org_admin','coach']));

-- learner_identity: only the learner, or staff of an org the learner shares with, with role permission
create policy "learner reads own identity" on learner_identity
  for select using (learner_id in (select id from learners where user_id = auth.uid()));
create policy "staff read identity of their learners" on learner_identity
  for select using (exists (
    select 1 from learner_orgs lo
    where lo.learner_id = learner_identity.learner_id
      and is_org_member(lo.org_id, array['org_admin','coach','trainer'])
  ));
-- reviewers have NO policy on learner_identity (blinding enforced at DB level)
```
**Required tests:** for every table, automated tests prove that (1) user A in org X cannot read or write org Y rows, (2) a reviewer cannot read `learner_identity`, and (3) an anonymous user can read only `passports` with visibility ≠ private and only the allowed columns (expose them through a `public_passport_view` security-barrier view).

### 7.4 Storage buckets
- `audio-private` (assessment audio): private, signed URLs valid 5 minutes, **auto-deleted after the retention period (default 90 days after scoring; configurable 30–180)**.
- `uploads-private` (CSV, job-ad PDFs): private, deleted after processing plus 7 days.
- `reports-private` (generated PDFs/XLSX): private, signed URLs.
- `public-assets` (org logos, OG images): public.

### 7.5 API surface (route handlers / server actions)
All endpoints validate input with zod, check permissions through `/lib/auth`, use idempotency keys on POST where retries are possible, and return a typed error format `{ error: { code, message, requestId } }`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/attempts` | Start an attempt (checks cooldown, consent) |
| POST | `/api/attempts/:id/responses` | Save a text response / chunk metadata |
| POST | `/api/attempts/:id/audio` | Chunked audio upload (resumable) |
| POST | `/api/attempts/:id/submit` | Submit → enqueue scoring |
| GET | `/api/attempts/:id/status` | Polling fallback (Realtime is primary) |
| POST | `/api/voice/session` | Mint an ephemeral token for the realtime voice session |
| POST | `/api/reviews/:id/decision` | Submit a human review |
| POST | `/api/verifications` | Request trainer verification |
| POST | `/api/verifications/:id/resolve` | Confirm, adjust, or decline |
| POST | `/api/passport/share` | Update visibility / generate a link |
| GET | `/api/passport/:slug/pdf` | Render the PDF |
| GET | `/api/verify/:credentialId` | Public verification JSON |
| POST | `/api/roles/reverse-jd` | Analyze a job ad (streaming) |
| POST | `/api/roles/:id/publish` | Publish a role, create an apply link |
| PATCH | `/api/applications/:id` | Move pipeline stage |
| POST | `/api/placements` | Report a placement |
| POST | `/api/retention/:id` | Retention check-in |
| POST | `/api/cohorts/:id/import` | CSV import (validate → preview → commit) |
| POST | `/api/reports` | Generate a report (job) |
| POST | `/api/coach/messages` | Coach message (streaming) |
| POST | `/api/webhooks/whatsapp` | WhatsApp Cloud API webhook (signature-verified) |
| POST | `/api/webhooks/payments` | Payment webhook (signature-verified) |
| POST | `/api/me/export` · `/api/me/delete` | Data rights |

### 7.6 Background jobs (durable, retried, idempotent)
- `score.attempt` → for each skill: run scorer A and scorer B in parallel → compare → if |A−B| > 1, or confidence < threshold, or integrity flags exist, or it falls in the 10% calibration sample: create `human_reviews`; else aggregate into `skill_evidence` (level = rounded mean; confidence = min) → issue credentials → notify the learner.
- `transcribe.audio` → STT, with word timestamps stored in `attempt_responses.meta`.
- `aggregate.evidence` → recompute the canonical `skill_evidence` per learner and skill when new evidence arrives (the strongest evidence type wins; same type → most recent; expired evidence is excluded).
- `generate.pathway` → see 8.4.6.
- `issue.credential` / `revoke.credential`.
- `report.generate` → PDF/XLSX.
- `retention.schedule` → creates check-ins at 30/90/180 days and sends WhatsApp templates on due dates.
- `fairness.audit.nightly` → computes audits per cohort, assessment, and attribute (with minimum n=20); alerts if the impact ratio is below 0.8.
- `audio.retention.sweep` → deletes expired audio.
- `taxonomy.sync.monthly` → pulls taxonomy updates and queues mappings for review.
- `eval.on_prompt_change` → runs the golden set when a prompt version is created; blocks publish if metrics regress beyond the thresholds in 8.6.

### 7.7 Realtime
Supabase Realtime channels: `attempt:{id}` (scoring progress), `org:{id}:review` (queue updates), and `user:{id}:notifications`. Authorization is enforced on channel join.

### 7.8 Notifications
Channels: in-app, WhatsApp (templates, consent-gated), email (org and employer). Each notification type has a per-locale template, a per-user opt-out where legally optional, and quiet hours (21:00–08:00 local; no marketing messages ever).

---

## 8. AI SYSTEM

### 8.1 Model routing (vendor-agnostic adapter)
Implement `/lib/ai/router.ts` with a provider-agnostic interface. Choose models by **task tier**, not by brand; model names live in config and in `prompt_versions`, never hardcoded in business logic.

| Task | Tier | Notes |
|---|---|---|
| Rubric scoring (A/B runs) | Strong reasoning model | Strict JSON schema, temperature 0–0.2 |
| Interview follow-up generation | Strong, low-latency | Streaming |
| Role-play persona (angry customer, etc.) | Fast conversational | Streaming, persona constraints |
| Reverse JD analysis | Strong | Streaming partial JSON |
| Skill extraction & normalization rerank | Small/cheap | Batchable |
| Embeddings | Embedding model | Dimension must match `skills.embedding` |
| Coach | Fast conversational + safety layer | Tool-calling |
| STT | STT with Darija/French/Arabic support | **Benchmark on Darija before choosing** (8.5) |
| TTS | Natural voices for Darija/FR/AR | Benchmark intelligibility with real users |

Every call: timeout, retry with exponential backoff (max 2), a fallback model per tier, a token budget, logging to `ai_decision_log`, and tracing.

### 8.2 Prompt registry
Prompts live in `/prompts/{name}/{version}.md` with a matching `{version}.schema.json`, and are synced to `prompt_versions`. Runtime loads by `name` + active version (respecting `rollout_pct`). **Changing a prompt means creating a new version, never editing one in place.**

### 8.3 Global system rules (prepended to every learner-facing or scoring prompt)
```
- You are part of Bayyina, a skills assessment platform. Be respectful, neutral, and concise.
- Never ask for or use: name, gender, age, religion, ethnicity, origin, marital status, health, photo, address, or political views.
- Never promise jobs or outcomes.
- If the user expresses distress or risk of harm, stop the task and follow the SAFETY protocol (return safety_flag=true).
- Respond in the requested locale. For 'ary' write Moroccan Darija in Arabic script, everyday vocabulary.
- Output must strictly follow the provided JSON schema when one is given. No extra keys, no prose outside JSON.
```

### 8.4 Core prompts (specifications)

#### 8.4.1 `rubric_scorer` (the most important prompt)
**Input (identity-free):**
```json
{
  "locale": "ary",
  "skill": {"id": "…", "label": "Customer communication", "definition": "…"},
  "rubric": {"version": 3, "levels": [{"level":1,"anchor":"…"}, …, {"level":5,"anchor":"…"}]},
  "item_context": "Role-play: customer received a wrong order and is angry.",
  "transcript": [{"turn":1,"speaker":"ai","text":"…"},{"turn":2,"speaker":"learner","text":"…"}]
}
```
**Instructions (core):**
```
Score ONLY the learner's demonstrated behavior in the transcript against the rubric anchors.
Process:
1) Quote the exact learner sentences that are evidence (max 4 quotes, verbatim, with turn numbers).
2) For each candidate level, check whether its anchor behaviors are present. Choose the HIGHEST level
   whose anchor behaviors are clearly demonstrated. If evidence is between two levels, choose the lower one.
3) Language fluency, accent, grammar, or which language the learner uses must NOT affect the score
   unless the skill itself is a language skill.
4) Length of answer is not evidence by itself.
5) If there is not enough evidence to score, return level=null and insufficient_evidence=true.
6) confidence ∈ [0,1]: how clearly the evidence matches ONE level (not how good the learner is).
```
**Output schema:**
```json
{
  "type":"object","additionalProperties":false,
  "required":["level","confidence","insufficient_evidence","evidence_quotes","justification","next_level_gap"],
  "properties":{
    "level":{"type":["integer","null"],"minimum":1,"maximum":5},
    "confidence":{"type":"number","minimum":0,"maximum":1},
    "insufficient_evidence":{"type":"boolean"},
    "evidence_quotes":{"type":"array","maxItems":4,"items":{"type":"object","additionalProperties":false,
      "required":["turn","quote"],"properties":{"turn":{"type":"integer"},"quote":{"type":"string"}}}},
    "justification":{"type":"string","maxLength":600},
    "next_level_gap":{"type":"string","maxLength":300}
  }
}
```
**Post-validation in code:** every quote must be an exact substring of the referenced learner turn (otherwise reject and retry once, then send to human review). The level must be null or 1–5. Log everything.

#### 8.4.2 `interviewer` (assessment conductor)
Drives the session: delivers items, keeps time, decides whether to ask the single allowed follow-up, and stays neutral (no praise and no hints that reveal the rubric). Output per turn: `{say: string, action: "next_item"|"followup"|"end", followup_reason?: string}`.

#### 8.4.3 Follow-up policy
Ask a follow-up only if the answer is (a) too short to score (< 15 words for an open item), (b) vague about *what the learner would do*, or (c) off-topic. Allowed follow-up types: "What exactly would you say?", "What would you do next?", "Why that choice?". **Forbidden:** leading questions, hints, or repeating rubric words.

#### 8.4.4 `roleplay_persona`
Plays characters (angry customer, busy manager) with a defined persona card: goal, emotional intensity (1–5), information hidden until asked, and a maximum of 4 turns. It must stay in character, must not insult, and must not escalate beyond the configured intensity. Output: `{say, emotion, reveal_info?: string, end: boolean}`.

#### 8.4.5 `reverse_jd`
Input: the raw job ad text. Output schema: `{normalized_title, occupation_candidates[{label, esco_uri?, confidence}], must_have[{skill_text, suggested_level, rationale}], nice_to_have[...], flagged[{text, category: "age"|"gender"|"appearance"|"marital"|"religion"|"origin"|"photo"|"other", why, suggestion}], suggested_assessment_tags[]}`. Skill texts then go through **normalization** (8.4.7) to map onto taxonomy IDs; unmapped skills are shown as "custom" and queued for taxonomy review.

#### 8.4.6 `pathway_planner`
Input: target occupation skill requirements, current `skill_evidence`, and a **candidate list of resources retrieved from `learning_resources`** (the model may only choose from this list, by ID). Output: an ordered list of up to 6 steps `{type: "practice"|"learn"|"prove"|"verify", skill_id, resource_id?, assessment_id?, est_minutes, why}`. Validate that every ID exists.

#### 8.4.7 `skill_normalizer`
Two stages: (1) embed the raw skill phrase and take the top-10 nearest skills by cosine similarity (pgvector); (2) a small model chooses the best match ID or `"none"`, with a confidence. Accept if confidence ≥ 0.7, otherwise route to the admin mapping review. Cache the results by normalized phrase.

#### 8.4.8 `coach`
Tools available (function calling): `get_my_results`, `get_my_pathway`, `start_mock_interview(role_id?)`, `get_opportunities`, `report_outcome`, `handoff_to_human`. Safety layer: classify each message for distress, abuse, or out-of-scope content before responding. For distress, return a supportive message plus the org-configured human contacts and set a safety flag for staff follow-up (only with the learner's prior consent to staff contact; otherwise give resources only). The coach never re-scores assessments and never edits evidence.

#### 8.4.9 `integrity_analyzer`
Input: event signals (paste counts, focus losses, latency patterns) plus an answer-style comparison between the warm-up answer and later answers. Output: `{flags[], severity: "none"|"low"|"medium"|"high", explanation}`. **Used only to route to human review; never changes a score automatically.**

### 8.5 Voice pipeline
- **Realtime mode (preferred):** WebRTC or WebSocket session with streaming STT → interviewer LLM → streaming TTS; barge-in supported (the learner can interrupt); server-side VAD with end-of-utterance at 700ms silence (tunable).
- **Fallback mode:** record per answer → upload → batch STT → LLM → TTS file.
- **Benchmark before committing to vendors:** build a test set of ≥100 Darija, ≥50 French, and ≥50 Arabic utterances from consenting testers (different regions, genders, noise levels); measure WER/CER per group and choose the vendor with the best accuracy *and the smallest gap between groups*. Re-run quarterly.
- **Code-switching** (Darija + French in one sentence) is normal and must be handled. Store the raw transcript plus a normalized version.
- **Audio retention:** see 7.4. Transcripts are kept for the evidence lifetime; the audio is not.

### 8.6 Evals & calibration (quality gates)
- **Golden set:** ≥300 learner transcripts per skill family, each scored independently by 2 trained human raters (with adjudication on disagreement), stratified by locale, gender, and region.
- **Metrics:** exact agreement, within-1 agreement, quadratic weighted kappa (QWK), A/B run consistency, insufficient-evidence rate, group-wise mean level difference vs. human scores (bias check), cost per item, and p95 latency.
- **Publish gates for a new scorer prompt or model:** QWK ≥ 0.70 vs. human adjudicated scores; within-1 agreement ≥ 90%; no group with a mean (model − human) difference greater than 0.25 levels; cost per item within budget. If any gate fails, publishing is blocked.
- **Production monitoring:** model–human agreement on the 10% calibration sample (weekly), drift alerts.

### 8.7 Cost controls
Per-org monthly AI budget with 80% and 100% alerts; per-learner caps (e.g., max attempts per assessment per 30 days); caching of normalization and of the Reverse JD for identical inputs; batch embeddings; cheaper models for extraction; and cost shown in the admin per task, tenant, and model.

### 8.8 Guardrails summary
Schema validation, quote verification, PII redaction before LLM calls (regex + NER for names, phones, emails, and national ID patterns), prompt-injection defense (learner text is wrapped as data and never treated as instructions; system rules are restated after user content), output moderation for the coach and role-play, and rate limits.

---

## 9. WHATSAPP CHANNEL
- **API:** WhatsApp Business Platform (Cloud API). Verified business, approved message templates per locale.
- **Opt-in:** explicit (consent purpose `whatsapp`), stored with a timestamp; "STOP" in any language unsubscribes immediately.
- **Flows:**
  1. **Join:** a QR or link opens a prefilled message ("JOIN <cohort code>"), then OTP verification, then a link to the web onboarding (consent must be completed on the web for v1).
  2. **Reminders:** next assessment, pathway step (max 2 per week).
  3. **Results ready:** a template with a deep link.
  4. **Coach:** text and voice notes (voice notes go through STT; replies in text plus optional TTS voice note).
  5. **Outcome check-ins:** an interactive message with buttons ("Yes I'm working" / "Not yet" / "Stopped working").
  6. **Trainer verification:** a link plus OTP, then a one-tap confirm.
- **Webhook:** signature verification, idempotent processing by message ID, and an inbound rate limit.
- **No assessments run inside WhatsApp in v1** (integrity and UX reasons); WhatsApp links into the web app.

---

## 10. VERIFIABLE CREDENTIALS
- Data model: W3C Verifiable Credentials / Open Badges 3.0 `AchievementCredential`.
- **Issuer:** the issuing org's DID (did:web under the Bayyina domain, e.g., `did:web:bayyina.example:orgs:{slug}`).
- **Signing:** Ed25519 keys stored in a KMS or secrets manager (never in the database or client); key rotation supported through `key_id`.
- **Claims:** skill (ID plus label), level, evidence type, assessment (ID plus version), rubric version, issued date, expiry (default 24 months for tested skills, 36 for verified), and holder reference (a pseudonymous ID; name only if the holder opted in).
- **Verification endpoint:** validates the signature, revocation status, and expiry.
- **Revocation:** when evidence is invalidated (e.g., confirmed cheating after human review, or learner deletion), a revocation reason is recorded.

---

## 11. ANALYTICS & METRIC DICTIONARY

### 11.1 Event tracking (privacy-safe)
- Self-hosted or EU/consent-compliant analytics (e.g., PostHog with IP anonymization). Analytics run only after consent on marketing pages; in the app, first-party product analytics cover only essential events defined in the privacy notice.
- **Events are never sent with PII.** Use pseudonymous `user_id` hashes.
- **Core events:** `onboarding_step_completed{step}`, `consent_updated{purpose,granted}`, `assessment_started{assessment_id,mode,locale}`, `assessment_item_answered{item_type,duration_s}`, `assessment_submitted`, `results_viewed`, `human_review_requested`, `passport_shared{channel}`, `passport_viewed_public`, `credential_verified{result}`, `pathway_step_completed{type}`, `application_created`, `application_stage_changed{stage}`, `placement_reported{source}`, `retention_check_completed{day,still_employed}`, `reverse_jd_run`, `report_generated{template}`.

### 11.2 Metric definitions (used in dashboards and reports; one source of truth in `/lib/metrics.ts`)

| Metric | Definition |
|---|---|
| Activation rate | learners with ≥1 submitted attempt ÷ learners enrolled (same cohort, same period) |
| Passport issued rate | learners with ≥1 visible evidence ≥ `tested` ÷ enrolled |
| Employer response rate | applications that reached stage ≥ `assessed`/`shortlisted` by employer action ÷ applications sent |
| Placement rate (6 months) | learners with a placement within 180 days of cohort end ÷ learners who completed |
| Retention 90d | placements with a 90-day check `still_employed = true` ÷ placements whose 90-day check is due **and answered** (also show the response rate; never hide unanswered checks) |
| North Star | count of placements with 90-day retention confirmed, per month |
| Time-to-job | median days from enrollment to placement start |
| Model–human agreement | share of calibration items where the final human level equals the model level (also within-1) |
| Adverse impact ratio | min group pass rate ÷ max group pass rate (pass = level ≥ role/occupation min_level), groups with n ≥ 20 only |

---

## 12. SECURITY, PRIVACY & COMPLIANCE

### 12.1 Security
- OWASP ASVS Level 2 as the target. CSP with nonces, HSTS, secure cookies (HttpOnly, SameSite=Lax), and CSRF protection on mutations.
- The service-role key is used only on the server, inside narrowly scoped functions; it is never imported in client bundles (add a lint rule).
- MFA for admins. Session timeout: 12h for the app and 30 min idle for `/admin`.
- Rate limits: auth (5 per minute per phone/IP), Reverse JD public demo (3 per day per IP), coach (30 messages per hour per user), uploads (size limits: audio chunks 5MB, CSV 10MB, PDF 10MB).
- Upload scanning: MIME validation, magic-byte check, CSV formula-injection sanitization on export (prefix `'` to cells starting with `= + - @`).
- Secrets live in environment or secret managers; the repo has secret scanning in CI.
- Dependency scanning and Dependabot; a monthly security review.
- Backups: daily, with point-in-time recovery; restore tested quarterly.
- An incident response runbook with a breach notification procedure.

### 12.2 Privacy (Law 09-08 + GDPR-style good practice)
- **Before launch:** declare processing to the CNDP (and obtain authorization where required); `[TODO: legal counsel]`.
- Maintain a **record of processing** and a **processor list** (hosting, LLM, STT/TTS, WhatsApp, email, analytics) with data location and transfer basis. The `/legal/privacy` page shows this list.
- **Data minimization:** no photos, no national ID numbers, no religion, no health data. Gender is optional and self-declared, used only for aggregated fairness audits.
- **Retention:** audio 90 days after scoring (default); transcripts and evidence while the account is active plus 24 months (or until deletion); leads 12 months; logs 12 months (with PII stripped).
- **Data subject rights:** export, correct, delete, withdraw consent, and object, all self-serve (5.25) with SLA tracking for manual requests.
- **Minors:** v1 accepts only ages 18–29.

### 12.3 AI governance
- A model card per assessment (`/responsible-ai`): purpose, skills measured, languages, golden-set results, known limitations, fairness results, human oversight process, and version history.
- A transparency notice on every AI interaction ("You are talking with an AI system").
- Human oversight: no automated hiring decisions; humans can override any score; learners can contest.
- Logging sufficient for audit (`ai_decision_log`, `score_runs`, `human_reviews`, `audit_log`).
- **Readiness for EU AI Act high-risk obligations** (employment and access to training are Annex III areas; the standalone high-risk deadline is 2 Dec 2027): keep technical documentation, a risk management file, data governance notes, and post-market monitoring in `/docs/compliance/`.

---

## 13. TESTING & QUALITY

| Layer | Tooling | Must cover |
|---|---|---|
| Unit | Vitest | metrics, aggregation logic, permission checks, schema validators, quote verification |
| DB/RLS | pgTAP or SQL tests | cross-tenant isolation on every table; reviewer blinding; public passport view columns |
| Integration | Vitest + local Supabase | scoring job end-to-end with mocked LLM; credential issue/verify; CSV import |
| E2E | Playwright | learner onboarding → assessment (text mode) → results → passport share → verify; org cohort creation → review → report; employer Reverse JD → pipeline → hire → retention |
| Accessibility | axe-core in Playwright + manual screen readers | all pages, all locales, RTL |
| Visual regression | Playwright screenshots | key pages × 4 locales × light/dark × mobile/desktop |
| Performance | Lighthouse CI | budgets in 6.3 |
| AI evals | `/evals` runner in CI | publish gates in 8.6 |
| Load | k6 | 500 concurrent assessment sessions; scoring queue throughput |
| Security | ZAP baseline scan, dependency audit | per release |

**Definition of Done (per feature):** spec acceptance criteria met; tests written and passing; works in 4 locales including RTL; accessible (axe clean); reduced motion verified; no PII in logs (checked); analytics events added; docs updated; self-audit list produced.

---

## 14. SEED & DEMO DATA (for a convincing demo, clearly labeled as demo)
- A demo tenant "Centre de Formation Démo" (marked DEMO in the UI with a banner) with 3 cohorts (Customer service – Tanger, Logistics assistant – Casablanca, Digital basics – Fès), 60 synthetic learners (synthetic names; obviously fictional), assessments in various states, a review queue with 8 items, placements and retention data, and a pre-generated donor report.
- A demo employer "Société Démo Offshoring" with 2 roles, a Reverse JD example including flagged requirements ("âge max 25 ans", "bonne présentation"), and a pipeline with 15 candidates.
- One demo learner account with a complete passport and pathway (for the "See a sample passport" modal).
- **Synthetic data must never be shown as real impact numbers on public pages.**
- 2 complete assessments shipped in the library for v1: **"Customer communication (voice role-play)"** and **"Workplace basics: organization & reliability (SJT + task sort)"**. Each has a published rubric per skill in all 4 locales.

---

## 15. ENVIRONMENT & DEVOPS
- **Environments:** local (Supabase CLI), preview (per pull request, seeded demo data), staging (production-like, synthetic data only), production.
- **CI:** typecheck, lint (ESLint + a rule banning the service key on the client + a rule banning hardcoded strings in JSX), unit and integration tests, RLS tests, e2e (smoke on PR, full on main), Lighthouse CI, an eval gate when `/prompts` changes, and migrations dry-run.
- **CD:** main → staging automatically; production through manual approval. Database migrations are forward-only and reviewed.
- **Feature flags** for: impact counters, coach, employer portal, WhatsApp flows, realtime voice.
- **Environment variables** (documented in `.env.example`, never committed): Supabase URL and keys, LLM provider keys per tier, STT/TTS keys, WhatsApp token, phone number ID, app secret, email provider key, Redis URL, job runner keys, signing key reference, Turnstile keys, Sentry DSN, analytics key, payment keys.

---

## 16. BUILD PHASES (execute in order; stop after each for review)

### Phase 1 — Foundation & Learner core (concierge MVP)
1. Repo setup, CI, design tokens, fonts, i18n (4 locales + RTL), base layout, component primitives with all states.
2. Database: tenancy, learners + identity split, consents, cohorts, taxonomy (seed: a subset of ESCO skills/occupations in FR + local layer), rubrics, assessments, attempts, responses, score runs, human reviews, skill evidence, AI log, audit log. All RLS policies plus tests.
3. Auth (phone OTP for learners, email for staff), invites, learner onboarding with consent.
4. Assessment engine in **text mode** first: intro, session, autosave, submit; the `interviewer` prompt; the `rubric_scorer` with A/B runs; quote verification; the scoring job.
5. Review queue (ReviewPanel) + aggregation into `skill_evidence`.
6. Results page + basic passport (link-only) + PDF.
7. Org console: dashboard (basic KPIs), cohort creation, CSV import, learners table, simple cohort report (PDF/CSV).
8. Eval harness + golden-set format + gates.
**Exit:** one real cohort can complete a text assessment end-to-end with human review, results, and passport; RLS tests are green; eval metrics are reported.

### Phase 2 — Voice, Passport credentials, Fairness
1. STT/TTS benchmark (8.5) → choose vendors.
2. Voice mode (fallback record-upload first, then realtime), VoiceOrb, role-play persona.
3. Verifiable credentials: signing, `/verify`, QR.
4. Fairness panel + nightly audits.
5. Integrity signals + analyzer → review routing.
6. Learner data rights (export, delete) + consent management UI.
**Exit:** voice assessment works on low-end Android over 4G within the latency targets; credentials verify; a fairness report is generated.

### Phase 3 — Marketing site & WhatsApp
1. Full marketing site (5.1–5.11) with signature animations; SEO; legal drafts.
2. WhatsApp: join flow, reminders, results-ready, outcome check-ins, trainer verification.
3. Outcomes module (placements + retention schedule).
**Exit:** Lighthouse targets met; WhatsApp flows are template-approved and tested; retention check-ins are being collected.

### Phase 4 — Employer portal
1. Reverse JD (with the public demo), role specs, publishing, apply links.
2. Pipeline kanban, anonymized candidate view, identity reveal with consent.
3. Hires and retention check-ins for employers.
**Exit:** one employer runs one role end-to-end.

### Phase 5 — Pathways, Coach, Reports, Billing, Admin
1. Learning resources curation, pathway planner, pathway UI.
2. Coach (web + WhatsApp) with tools and safety layer.
3. Report builder with donor templates, scheduled reports.
4. Billing and usage meters.
5. Full admin suite (taxonomy mapping review, rubric editor, prompt registry with rollout, eval dashboards).
**Exit:** all pages in Section 2 are implemented and pass the Definition of Done.

---

## 17. FINAL QUALITY BAR: "WOW" CHECKLIST
The product is ready only when **all** of these are true:
- [ ] A first-time visitor understands the product in 5 seconds on the home page, on a phone, in Darija or French.
- [ ] The hero animation runs at 60fps on a mid-range Android, and the page is still fast (LCP < 2.5s).
- [ ] A young person can finish onboarding plus the first voice assessment in Darija without help, on a cheap phone.
- [ ] Results feel *fair and explained*: every level has quotes from the learner's own words and a clear "how to reach the next level".
- [ ] The passport looks premium, verifies in one scan, and prints correctly in Arabic and French.
- [ ] An institution can go from signup to a donor-ready report without contacting support.
- [ ] An employer pastes a messy job ad and gets a clean skill spec plus discrimination flags in seconds.
- [ ] Every screen works in RTL and dark mode, with reduced motion, by keyboard, and with a screen reader.
- [ ] No cross-tenant data leak is possible (tests prove it). No PII reaches the LLM scoring calls (tests prove it).
- [ ] Every number on every dashboard has a definition and a source.
- [ ] Nothing fake: no invented testimonials, no synthetic numbers presented as real impact.

---

## 18. OPEN DECISIONS (resolve with the founder; do not guess)
1. Final product name and logo.
2. Pricing values and currency display (MAD/EUR).
3. Payment provider (international card processor vs. a Moroccan gateway such as CMI).
4. Hosting region and data residency requirements of the first public-sector partners.
5. STT/TTS vendors (after the benchmark).
6. LLM vendors per tier (after evals).
7. The first 2 target occupations/sectors (from customer discovery interviews).
8. Human reviewer staffing model (org staff vs. Bayyina reviewers).
9. Legal review of the privacy policy, terms, AI notice, and CNDP declaration.
