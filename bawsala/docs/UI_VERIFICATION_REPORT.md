# UI verification report: redesign recovery (4 November 2026)

**What was tested:** branch `claude/bawsala-redesign-recovery`, code at commit `47db132`. Every result below comes from
a production build (`next build` and `next start` on port 3100) against the local PostgreSQL 16 database.
`next dev` was used only while repairing.

## 1. Automated checks

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | **0 errors** |
| ESLint | `npx eslint` | **0 errors, 0 warnings** (the redesign's one warning in `command-palette.tsx` was fixed in `47db132`) |
| Unit and integration tests | `npx vitest run` | **13 files, 91/91 passed** (89 baseline + 2 new in `tests/unit/viz.test.ts`) |
| Production build | `npx next build` | **succeeded, 0 errors, 0 warnings** |
| Browser tests | `npx playwright test` (desktop Chrome 1366×900 + Pixel 7) | **5/5 passed**: full student journey on desktop and mobile, RTL/LTR and Tifinagh, accessibility, authorization boundaries |
| Accessibility (committed test) | axe, tags `wcag2a, wcag2aa, wcag21aa, wcag22aa`, zero serious/critical | **0 violations** on `/`, `/signin`, `/app/onboarding`, `/app`, `/app/passport`, `/app/opportunities`, `/app/assistant`, `/app/settings` |
| Accessibility (review sweep, not committed) | same axe tags and threshold; 7 pages × en/ar/fr × light/dark × desktop/Pixel 7 = **84 scans** | **0 serious/critical violations in all 84** |

**Was the accessibility test changed?** Yes, in one respect. The scan now waits for finite entrance animations to
finish before measuring (`settle()` in `tests/e2e/journey.spec.ts`). The rules, the WCAG tags and the zero-violation
threshold are unchanged.

**How did the review sweep get valid results?** The first version signed in too often. The sign-in limiter blocked it,
so its mobile scans of logged-in pages actually measured the sign-in page. Those results were **discarded**, not
reported. The second version:

- signs in once per account and reuses the session;
- fails if any page redirects away from the page it means to scan.

The limiter was neither changed nor bypassed. The numbers above come from the second version.

## 2. Screens verified by eye

The same pages were also reviewed visually. The screenshots come from the sweep run and from repair passes, reviewed
one by one.

| Screen | Desktop | Mobile (390 px / Pixel 7) | Languages | Themes | Result |
|---|---|---|---|---|---|
| Assistant: empty state, conversation, sources, follow-ups, composer | ✓ | ✓ | en, ar, ary, fr | light, dark | Correct layout; avatar 32 px; composer usable; empty state starts at the top |
| Onboarding: all 5 steps with real API calls (fresh users) | ✓ | ✓ | en, ar | light | Separated steps; progress bar with numbered dots; readable language cards with sized check marks; analysing state; target cards |
| Skill suggestions: onboarding and passport | ✓ | ✓ | en, ar, fr | light, dark | Accept/reject fold the card into a compact row; quote and source visible |
| Institution portal | ✓ | ✓ | en, ar, fr | light, dark | Tiles, join code with copy, privacy note, distribution and ring, queue |
| Admin console | ✓ | ✓ | en, ar, fr | light, dark | Tiles, activation funnel, AI table, signals; the existing console tabs work as before |
| Verification queue | ✓ | ✓ | en, ar | light, dark | Card with avatar, request date, note, proof state, approve/decline |
| Home page | ✓ | ✓ | en, ar, fr | light, dark | Constellation labels no longer overlap; contrast fixed |
| Sign in | ✓ | ✓ | en, ar, fr | light, dark | — |

### Screenshots (`docs/screens/recovery/`)

| | |
|---|---|
| Before: assistant (`before-assistant.png`) | After: `after-assistant-en-desktop.png`, `after-assistant-ar-mobile-dark.png` |
| Before: onboarding (`before-onboarding.png`) | After: `after-onboarding-steps-en.png`, `after-onboarding-ar-desktop-dark.png` |
| Suggestions | `after-suggestions-onboarding-en.png`, `after-suggestions-passport-fr-desktop.png` |
| Institution portal | `after-institution-en-desktop.png`, `after-institution-fr-mobile.png` |
| Admin console | `after-admin-ar-desktop-dark.png` |
| Home constellation (en and ar) | `after-home-constellation-en-ar.png` |

## 3. Data used for review

All review data is local only.

| Data | How it was created |
|---|---|
| Student review account `salma.qa@example.test` | `scripts/demo-student.mjs` (through the API) |
| Onboarding walk-throughs | Fresh sign-ups via the API (`ob…@example.test`) |
| Review accounts `portal.admin@example.test` and `portal.inst@example.test` | Sign-up through the API; admin role granted with the operator CLI `npm run admin:grant` |
| Example institution's six students | `scripts/dev-portal-demo.ts`: repository functions (the integration-test path), refuses non-local databases, never calls HTTP endpoints or rate limiters |

## 4. Not tested

- Firefox and Safari (only Chromium is installed in this environment).
- Physical devices (only device emulation).
- Screen readers (labels and roles were checked by axe and in code review; no NVDA/VoiceOver session).
- Onboarding in French and Tamazight was not walked through step by step; only step 1 was scanned (fr) by axe.
- The real AI model (no API key); the assistant was exercised in basic mode only.
