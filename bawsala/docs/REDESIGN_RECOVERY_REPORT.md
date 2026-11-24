# Redesign recovery report (4 November 2026)

## Git

| Item | Value |
|---|---|
| Verified baseline (unchanged) | `081abc8` (code) and `1f01d8f` (adds the owner report only) |
| Unfinished redesign | `ff69355` (53 files). `20e1d51` adds only `docs/eval/results-2026-11-04.json` on top of it. |
| Recovery branch | `claude/bawsala-redesign-recovery`, created from `20e1d51` |
| Recovery commits | `c43d41d` styles for the six screens (checkpoint) → `d566dc8` portal review data script, admin wrapping → `49fa886` accessibility fixes → `47db132` ESLint fix → the documentation commit |
| Untouched | `claude/nice-brahmagupta-ophs0a` (`20e1d51`), `claude/bawsala-phase1-ai-readiness` (`1f01d8f`, local only), `claude/mobile-repair-os-kpcoqi` (`b3501bd`, the repository's default branch) |
| Not done | No merge, no force-push, no reset, no deployment |

### Unusual repository structure (documented, not changed)

BAWSALA lives in the folder `bawsala/` of the repository `yassirjebbour/yassirjebbour`. That repository's default branch
(`claude/mobile-repair-os-kpcoqi`) belongs to a different project, Repair OS, and BAWSALA's branches start from it.
There is no `main` branch for BAWSALA.

**Safe future separation, for later and only with the owner's approval:**

1. Create an empty repository `bawsala` under the owner's account.
2. Extract the history of `bawsala/` with `git subtree split --prefix=bawsala -b bawsala-only`. This command creates a
   new branch and rewrites nothing that exists.
3. Push that branch as `main` of the new repository.
4. Point CI, the Dockerfile paths and any future deployment at the new repository.
5. Keep the old branches read-only until the owner confirms the new repository.

## What was broken and what was repaired

The redesign had rewritten the markup of six screens, but their stylesheet (`src/styles/flow.css`) was a single comment.
156 class names had no definition: about 135 were real styling needs, and about 20 were dynamic prefixes or hooks that
need no style.

| Screen | Component | Classes defined | Main repairs |
|---|---|---|---|
| Assistant | `components/app/chat.tsx` | 55 (`chat-*`, `conv-*`, `msg-*`, `av-*`, `a-*`, `tool-*`, `cite-*`, `composer-*`) | Avatar no longer a full-width black disc; history list with rename/delete; empty-state hero; numbered sources; action cards; composer with a single focus ring; mobile header and placeholder |
| Onboarding | `components/app/onboarding.tsx` | 36 (`ob-*`) | Numbered step track with fill; language cards with sized check marks; situation/kind tiles; richness meter; analysing state; constellation of found skills; target radio cards |
| Skill suggestions | `components/app/suggestions.tsx` | 11 (`sg-*`) | Cards that fold to a compact row after a decision |
| Institution portal | `app/institution/page.tsx`, `components/institution/copy-code.tsx` | 12 | Tiles reuse the shared `.tile`; join code; privacy note; distribution bars; ring |
| Admin console | `app/admin/page.tsx` | 14 | Funnel bars share the distribution pattern; data table; signals |
| Verification queue | `components/institution/queue.tsx` | 6 (`vq-*`) | Request cards |

All new rules use the existing tokens (colours, radii, elevation, motion). They are scoped to their components, with
no global overrides. Where possible they reuse existing components: `.tile`, `.icon-tile`, `.badge`, `.chip`, `.panel`
and `Ring`.

**Undefined classes remaining:** 23. None needs a style:

- dynamic prefixes `b-`, `st-`, `lvl-` and `is-`, which combine into defined classes;
- hooks: `vt-page`, `tilt`, `scr-*`, `lang-sec`, `foot-lang`, `pub-signin`, `demo`, `llm`, `verified`, `streaming`,
  `sky-mini`, `a-card` (always used with `.action-card`).

The inventory is reproducible with the script described in `UI_VERIFICATION_REPORT.md`.

## Accessibility and visual fixes

1. **Home contrast (real defect).**
   - *Problem:* in "How it works", inactive steps were faded with `opacity: .4`, giving about 2:1 contrast. Inactive
     trust-state rows used `opacity: .5`.
   - *Fix:* both now use the AA-safe `--muted` colour, and the rows a dashed border. The hierarchy is kept.
2. **Constellation labels.**
   - *Problem:* labels on the same side could overlap.
   - *Fix:* `layoutSky()` now returns label rows with a minimum gap. The gap is tighter only on a crowded side, and
     labels always stay inside the sky.
   - *Test:* covered for every skill-set size in `tests/unit/viz.test.ts`.
3. **Sign-in "failure" (timing, not a design defect).**
   - *Problem:* the scan ran during the card's entrance fade.
   - *Fix:* the test now waits for finite animations to finish. The rules are unchanged.
4. **Other defects found during verification and fixed:**
   - the assistant opened scrolled to the bottom on its empty state;
   - a double focus ring inside the composer;
   - the engine badge wrapped onto three lines on phones;
   - the onboarding counter read "4 / 1" in Arabic (now isolated LTR);
   - stars too small to see in the onboarding sky;
   - a focus frame drawn around the programmatically focused step heading;
   - tool names broke mid-word in the admin signals;
   - the ESLint warning in the command palette.

## Behaviour changes

There are no API, database or business-logic changes. The server calls in every repaired component are identical to
the verified baseline: the only difference is one type annotation in onboarding. There are three small presentation
changes in code:

| File | Change |
|---|---|
| `chat.tsx` | Scroll to the latest message only when there are messages |
| `viz.tsx` | Label positions (pure layout) |
| `command-palette.tsx` | The data export uses a download link instead of `window.location.assign`; same file, same endpoint |

## Files changed on the recovery branch

| File | Change |
|---|---|
| `src/styles/flow.css` | New styles for the six screens (about 314 lines) |
| `src/styles/home.css` | Contrast-safe dimming |
| `src/components/viz.tsx` | Label rows |
| `src/components/app/chat.tsx` | Scroll condition |
| `src/components/app/command-palette.tsx` | Download link |
| `tests/unit/viz.test.ts` | New unit tests |
| `tests/e2e/journey.spec.ts` | `settle()` before the axe scans |
| `scripts/dev-portal-demo.ts` | Local review data only |
| `docs/REDESIGN_RECOVERY_REPORT.md`, `docs/UI_VERIFICATION_REPORT.md`, `docs/KNOWN_ISSUES.md` | New documents |
| `docs/screens/recovery/*` | 12 screenshots |

## Test results

See `UI_VERIFICATION_REPORT.md` for the details.

| Check | Result |
|---|---|
| TypeScript | 0 errors |
| ESLint | 0 errors / 0 warnings |
| Vitest | 91/91 |
| Production build | OK |
| Playwright | 5/5 (desktop and mobile) |
| Accessibility (committed test) | 0 serious/critical violations on 8 pages |
| Accessibility (review sweep) | 84/84 scans with 0 serious/critical violations |

## Deployment recommendation

**Do not deploy yet.** The six screens are repaired and every available test passes, but the branch is not ready for
real users:

- the redesign of passport, opportunities, path, profile, settings and notifications was never done (K7 in
  `KNOWN_ISSUES.md`);
- the AI assistant has never run on the real model;
- all opportunities are demo data;
- F-05 and F-17 are still open.

Next step: the owner reviews the screenshots and decides the design direction before any further UI work.
