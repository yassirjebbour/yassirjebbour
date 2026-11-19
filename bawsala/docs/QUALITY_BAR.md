# SKILMA — QUALITY BAR ("world-class" defined so it can be checked)

"Make it world-class" is not an instruction an agent can follow. This file turns it into **measurable criteria**.
A screen, feature or phase is not done until it passes the bar below. When in doubt, the stricter reading wins.

---

## 1. The 5 levels (grade every screen honestly)
| Level | Description |
|---|---|
| 1 — Broken | Bugs, layout breaks, missing states |
| 2 — Template | Works, but looks like a default component library or a generic AI-generated app |
| 3 — Good | Clean, consistent, no bugs; nothing memorable |
| 4 — Excellent | Distinct identity, refined details, fast, delightful in at least one moment |
| 5 — World-class | Feels inevitable: every detail intentional, zero friction, emotional moment, works perfectly in ar/fr/en, RTL, dark, mobile, slow network, screen reader |

**Target:** every user-facing screen ≥ 4; the 7 wow moments (Genius Layer Part 6) = 5. A screen graded below 4 is not done.

---

## 2. Visual design: the checklist
- [ ] **No default look:** shadcn/Tailwind defaults are restyled to SKILMA tokens (colors, radius, shadows, typography). Grey-on-white generic cards are a fail.
- [ ] **Typographic hierarchy:** max 3 text sizes per screen section; headings use weight and size contrast, not color only; line length 45–75 characters for body text; Arabic line-height ≥ 1.8.
- [ ] **Spacing rhythm:** only token spacing values; consistent vertical rhythm; generous whitespace on marketing (section padding ≥ 96px desktop / 64px mobile).
- [ ] **Alignment:** every element aligns to the grid; no "almost aligned" offsets of 1–3px.
- [ ] **Color discipline:** one primary action per view; brand color used for meaning, not decoration; contrast AA everywhere.
- [ ] **Identity motifs present:** passport-book metaphor, gold evidence highlights, the paper texture/feel, and the logo mark used consistently.
- [ ] **Imagery:** no stock photos of handshakes or robots; abstract or real (licensed, consented) Moroccan context only.
- [ ] **Empty, loading and error states are designed**, not afterthoughts: each has illustration or icon, one sentence, one action.
- [ ] **Dark mode is designed**, not inverted: check every screen.
- [ ] **RTL is designed**, not mirrored blindly: icons, charts, progress directions, number alignment.

## 3. Motion: the checklist
- [ ] Every animation has a purpose: show causality, connection, or progress. Decorative loops are removed.
- [ ] Durations from tokens (80/160/240/400 ms; story 700–1200 ms), easing from tokens.
- [ ] Only transform/opacity; measured 60 fps on a mid-range Android profile (Chrome DevTools CPU 4× slowdown).
- [ ] No layout shift caused by animation (CLS < 0.05).
- [ ] Reduced motion, Calm, and Lite each verified on the wow moments.
- [ ] Interaction feedback < 100 ms for every tap/click (pressed state, optimistic update or spinner).

## 4. Copy: the checklist
- [ ] Every sentence earns its place: no filler, no hype words ("revolutionary", "unlock your potential", "seamless").
- [ ] Students: warm, direct, short sentences, never patronizing. Institutions: numbers first. Employers: risk and time.
- [ ] Darija in Arabic script reads naturally to a Moroccan 19-year-old (validated by a native speaker, not machine-only).
- [ ] Numbers always have a source and a date; counts say what they count.
- [ ] Error messages say what happened and what to do next, never a code alone.

## 5. Frontend engineering: the checklist
- [ ] TypeScript strict, no `any` without a justification comment.
- [ ] Server Components by default; client JS only where interactive.
- [ ] Performance budgets met (Lighthouse mobile ≥ 90 performance, 100 accessibility, ≥ 95 best practices, 100 SEO on public pages; LCP < 2.5 s, INP < 200 ms, CLS < 0.05).
- [ ] Forms: zod validation shared with the server, inline errors, no lost input on error, keyboard submit.
- [ ] Every async UI: loading (skeleton after 300 ms), success, error with retry, empty.
- [ ] Offline: drafts never lost (autosave), clear offline banner.
- [ ] Components are reusable and documented (Storybook or a /dev/components page showing all states in ar/fr/en, light/dark).

## 6. Backend & data: the checklist
- [ ] Every table: RLS + tests. Every mutation: authorization check + input validation + audit log where sensitive.
- [ ] Idempotent jobs with retries; no silent failures (errors reach Sentry without PII).
- [ ] Migrations are forward-only, reviewed, and reproducible from zero (`supabase db reset` works).
- [ ] Seed data creates a complete, labeled demo in one command.
- [ ] Backups and restore procedure documented.

## 7. AI: the checklist
- [ ] Each AI feature has: a versioned prompt, a strict schema, code-side validation, a fallback (rules or graceful message), logging, a cost budget.
- [ ] Scorers pass eval gates on a golden set before publishing (QWK ≥ 0.70, within-1 ≥ 90%, group bias ≤ 0.25 level).
- [ ] Streaming for anything > 1.5 s, with visible progress that explains what's happening.
- [ ] AI never invents facts about the user: only exact quotes and DB records.
- [ ] Darija input works: tested on a set of real Darija samples (Latin and Arabic script, code-switching with French).

## 8. Trust & safety: the checklist
- [ ] Consent screens versioned; withdrawal works instantly.
- [ ] AI notice wherever AI talks or scores.
- [ ] "Request human review" exists on every score.
- [ ] No PII in URLs, logs, analytics.
- [ ] Demo data visibly labeled.

---

## 9. The quality loop (how the agent reaches level 4–5)
Quality comes from **iteration with evidence**, not from one prompt. For every screen:
1. **Build** to spec.
2. **Capture:** Playwright screenshots at 375px and 1440px, in ar (RTL) and fr, light and dark (8 shots).
3. **Critique:** run the `design-critic` subagent on the screenshots; it grades 1–5 and lists concrete fixes.
4. **Fix** the top issues.
5. **Repeat** until the grade is ≥ 4 (or 5 for wow moments). Max 3 loops, then report remaining issues to the founder.
6. **Verify** with tests (unit, e2e, a11y) and performance.
7. **Log** the final grade and screenshots path in docs/PROGRESS.md.

---

## 10. References for taste (study the qualities, never copy designs or assets)
- Clarity and calm data UI: Linear, Stripe Dashboard, Mercury.
- Warm, human, trustworthy onboarding: Duolingo (pacing only, not the gamification), Headspace (calm motion).
- Editorial typography and whitespace: Stripe Press, Apple product pages.
- Document-as-object metaphor (for the passport): physical passports, boarding passes, Apple Wallet passes.
Use these only to calibrate the *level* of polish. SKILMA's identity (green/gold, paper, passport book, Darija) must stay its own.
