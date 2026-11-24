# BAWSALA design system (v2)

The brand idea: **your skills are stars; BAWSALA is the compass that draws the constellation to your next role.**
Paper and ink for reading, deep "night" green with gold stars for signature moments, motion that explains
(things grow, connect and point somewhere), never decoration for its own sake.

## Tokens (`src/app/globals.css`)

| Group | Tokens | Notes |
|---|---|---|
| Surfaces | `--paper` `--surface` `--surface2` `--sunk` `--sunk2` | Light and dark sets; never hard-code colours in components |
| Text | `--ink` `--ink2` `--muted` | `--muted` passes WCAG AA on `--paper` and `--surface` |
| Brand | `--g` `--g-ink` `--g200` `--g300` `--g600` `--g700`, `--gold` `--gold-d` `--gold-dd` `--gold-l` `--gold-xl` | Gold text uses `--gold-dd` (AA) |
| Night | `--night*`, `--grad-night`, `--star`, `--night-ink*`, `--night-muted` | Signature surfaces (`.night`) in both themes |
| Status | `--ok` `--warn` `--err` (+ `-l` backgrounds) | |
| Elevation | `--e1`…`--e4` | |
| Radius | `--r1` 10, `--r2` 14, `--r3` 20, `--r4` 28 | |
| Motion | `--ease-out`, `--ease-io`, `--spring`, `--spring-soft`, `--d1`…`--d4` | `--spring*` use CSS `linear()` |
| Direction | `--origin-start`, `--flip` | Flip with `[dir=rtl]` automatically |

Typography is IBM Plex Sans / IBM Plex Sans Arabic / Noto Sans Tifinagh only, self-hosted. RTL body text is 16px with a
line height of 1.75. Headings use `text-wrap: balance`.

## Components

- **Buttons:** `.btn` plus a variant: `-primary`, `-secondary`, `-ghost`, `-danger`, `-gold` (night surfaces), `-glass`
  (night), or `-light` (night). Sizes are `-sm`, `-lg` and `-icon`. An `<svg class="arrow">` inside a button nudges
  forward on hover (RTL aware).
- **Surfaces:** `.panel`, `.panel-flat`, `.night` (signature gradient), `.lift` (hover elevation) and `.glow` (a pointer
  spotlight; needs `position: relative`).
- **Data:**
  - `Ring` and `Count` from `components/viz.tsx`. `Ring` draws an animated circular progress; `Count` counts up with CSS
    only and keeps the real number for screen readers.
  - `.meter`.
  - Badges: `.badge` with `b-suggested`, `b-inferred`, `b-evidenced`, `b-verified` (seal), `b-demo`, `b-verified-src`
    or `b-unverified`.
- **Sky:** `Constellation` places a student's skills as stars by category around a compass. The needle points to their
  strongest direction. It is used on the landing page (live, from the visitor's sentence), on the dashboard and in the
  auth panel. `StarField` and `CompassRose` are its decorative companions.
- **Forms:** `.input`, `.select` (custom chevron, RTL aware), `.textarea`, `.chip`, and `.seg` (segmented control).
- **Overlays:** `Modal` (native `<dialog>` with an `@starting-style` entrance), the command palette (Ctrl/⌘ K), and toasts.

## Motion rules

1. **CSS first, no animation library.** The available tools are:
   - `.enter`, `.enter-scale` and `.enter-fade` for the first paint, staggered with `--i`;
   - `data-reveal` for scroll reveals (armed by `MotionRuntime`);
   - `@starting-style` for elements that appear;
   - React `<ViewTransition>` for page changes (`template.tsx`) and shared elements.
2. **Content never depends on JavaScript.** `data-reveal` hides elements only after `html.io-ok` is set. The count-up
   and ring animations need only `html.m-ok`, which the head script sets.
3. **`prefers-reduced-motion: reduce`.** Nothing moves; state changes remain visible.
4. **Durations.**
   - Micro feedback: 120–220 ms.
   - Entrances: 400–700 ms.
   - Hero choreography: up to about 2.5 s, and never blocking input.
5. **Easing.** Use `--ease-out` for entrances, `--spring-soft` for hover and press, and `--spring` only for playful
   moments: stars, needle, toast.

## Rules every screen follows

- **Five locales.**
  - Every string goes through `t()`.
  - New strings live in `src/i18n/messages/ext/*.ts`, typed against English.
  - Tamazight is written in Tifinagh. A Latin word of 4 or more letters fails the tests unless it is a brand name.
    Uncertain lines are marked `// review`.
- **Logical CSS properties only.** Use `inline-start`/`inline-end`, never `left`/`right`, except inside geometric
  visuals. Mixed-script text gets `.bidi`.
- **Honesty.**
  - Demo data is always labelled.
  - Skills show their source sentence.
  - No invented statistics, logos or testimonials.
- **Accessibility.**
  - WCAG 2.2 AA contrast in both themes.
  - Visible focus.
  - 44 px touch targets.
  - Decorative visuals are `aria-hidden`; meaningful ones have `role="img"` and a label.
- **Quality bar.**
  - No console errors.
  - No horizontal scroll at 390 px.
  - Correct in light and dark mode and in RTL and LTR.
  - No new runtime dependencies without a written reason.
