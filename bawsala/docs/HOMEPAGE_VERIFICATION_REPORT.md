# Homepage restoration — verification report

**Scope.** The public homepage `/` only. No change to student pages, the institution portal, authentication, the
database, APIs or business logic. **Reference:** `legacy/prototypes/BAWSALA.html` (the owner's prototype).
How it is built: [`HOMEPAGE_RESTORATION_SPEC.md`](HOMEPAGE_RESTORATION_SPEC.md).

## 1. How the result was compared

| Check | Method | Result |
|---|---|---|
| Full-page look | Prototype and app captured with Playwright, same viewport, side by side: `docs/screens/home/*.jpg` | Section for section the same, in all 5 languages |
| Page height | Desktop 1366 px, light | en −2 px, fr −2, ar −2, ary −2, zgh −2 (the removed "Watch how it works" button, inside rounding) |
| Page height | Mobile 390 px | −250 to −310 px: only the hidden links to pages that do not exist yet (§3) |
| Section heights | Each of the 12 sections measured in both | Desktop: identical except engine −48 px. Mobile: same, plus try-it +39 to +122 px (the "Sample data" label, §3) |
| Direction and fonts | `lang` / `dir` of `<html>`; computed fonts | ar and ary RTL; en, fr, zgh LTR; Tifinagh renders with the Tifinagh font (E2E test) |
| Horizontal overflow, console | Every capture | None; 0 console errors or warnings |

## 2. Behaviour, checked against the prototype (Playwright, dev server)

| Behaviour | Result |
|---|---|
| Hero timeline | Final state first, fade out at 2.6 s, then: typing → word marks → 3 chips fly in → counter 0→3 → ring 0→18→82 → path 0→7 → captions `lv_c1…3` → final state. The order and timings match the prototype frame by frame |
| Step-caption progress bars | Animate in step order, as in the prototype (fixed during verification, see §4) |
| Pause / resume | Pause shows the final state with the "Play animation" label and its icon; play restarts the story |
| Off screen | When the hero leaves the viewport, the story stops (`data-idle`, text frozen). Back on screen, it replays from step 1 |
| Language switch mid-animation | Switching to Arabic while the story plays: page re-renders in Arabic, `dir=rtl`, story restarts cleanly (final → play). Arabic caption and button label; no errors |
| Marquee | Runs (`lsmove`; `lsmove-r` in RTL); the pause button toggles `paused` / `aria-pressed`. Hover and keyboard focus also pause it, as in the prototype |
| Theme | Header toggle; footer light / dark / system (system removes the stored choice) |
| Reduced motion (`prefers-reduced-motion`) | Story static in its final state; marquee stopped and its second row hidden; road mover hidden; every reveal visible; counters at their final values. Identical to the prototype |
| "Data saver" (lite) | Same static state, plus the toast in the page language |
| Text size | A / A+ / A++ zoom |
| Mobile menu | Opens (10 links), closes with Escape |
| Language menu | Opens with 5 languages, positioned for RTL, closes with Escape or an outside click |
| Scroll reveals, bars, counters | Reveal on entry; bars fill; counters count up (e.g. 11.6 % → 16.7 %) |
| Try-it | Read on the device by the production rules engine: **0 network requests** while typing (160 ms debounce). Example, starters and clear work |

**Try-it, compared with the prototype for the same example sentence:**
- **en, ar, ary:** identical skills, order and role scores (4/5, 5/7, 4/6).
- **fr, zgh:** the production engine finds one more skill, "Comptabilité" (accounting), from "suivre les ventes" / its Tamazight equivalent.
  - The roles and scores are the same.
  - This is the real engine's answer. It was not edited to match the drawing.
  - In zgh this skill's name shows in French, because the prototype's Tamazight name list has no entry for it.

## 3. Intentional differences from the prototype

| # | Difference | Reason |
|---|---|---|
| 1 | Links hidden: Vision, Accessibility ("Ask for accompaniment"), Example passport, What's new, Institution sign-in, "Explore with sample data" / "See the institution view", plus "Watch how it works", "How your data is handled" and "More about trust" where they point at the section they sit in | Those pages do not exist in the app. A visible button that does nothing is not allowed |
| 2 | "Request a pilot" opens `/help` | The real contact form |
| 3 | "Save to my passport" (try-it) opens `/signup` | The app cannot carry the homepage draft into the composer yet |
| 4 | Try-it role rows add "Sample data" | They are demonstration roles, not live offers |
| 5 | One extra skill in fr / zgh try-it | Production engine result (§2) |
| 6 | Signed-in visitors see "Open my space" in place of "Get started" | Prototype string `pub_open`; the button goes to their space |
| 7 | Prototype demo bar, "skip" demo control and command palette removed | Prototype-only tools; the app has its own skip link |
| 8 | Sound effects not ported; confetti not used on the homepage | Off by default in the prototype; not part of the homepage |
| 9 | Accessible names of the language buttons and the brand start with their visible text ("EN — English") | WCAG 2.5.3 (Label in Name). Nothing visible changes |
| 10 | Prototype CSS is scoped to the homepage (`.bwh`); language selectors also match the app's codes `ary` and `zgh-Tfng`; fonts are the same files served from `/fonts` | Technical: keeps the rest of the app unaffected |

## 4. Defects found and fixed during this verification

- **Baked-in reduced-motion class.** The extractor captures the prototype in its settled state, which put the `static` class on the story for everyone. As a result, the step-caption progress bars never animated. The extractor now removes it, and the runtime adds it back only for reduced motion / data saver.
- **Label in Name.** See §3, item 9.
- **Extractor.** It is now an ES module and passes the repository lint rules. Regenerating gives byte-identical output.

## 5. Tests

| Suite | Result |
|---|---|
| `tsc --noEmit` | Pass |
| `eslint` | Pass (0 problems) |
| `vitest` (unit + integration) | 91 / 91 pass |
| `next build` | Pass |
| axe, homepage, 5 languages × light/dark × desktop/mobile (all rules), dev server | 19 / 20 clean. zgh desktop: `label-content-name-mismatch` on the brand. The name does contain the visible text; axe joins the two spans without a space |
| Playwright E2E (production build) | **4 passed, 1 failed** — see §6 |

## 6. Open item: needs the owner's decision

**Failed test:** `accessibility: no serious or critical axe violations` — one `color-contrast` node on `/`, and only on `/`.

**Cause.**
- During steps 1–2 of the hero story, the prototype dims the cards not reached yet (`opacity: .55`).
- In the third card, the small "DM" logo (white on green, 12 px) then measures 2.09 : 1.
- The prototype does exactly the same; it was measured in both.
- The test was not changed.

**Why it is not fixed silently.**
- With a 0.55 parent opacity, no colour pair for that logo reaches 4.5 : 1. Any real fix changes the design.
- WCAG 1.4.3 exempts text that is part of a picture. The story stage is `role="img"` with a text alternative, and the dimmed state is temporary.
- The pause button and reduced motion both show the fully lit final state.

**Options.**
- **(A)** Keep the design and record the WCAG "incidental text" exception in the test, for the story stage only.
- **(B)** Change the inactive-card effect, e.g. full opacity with a lighter border and shadow instead of fading. This makes the step-by-step emphasis less pronounced.

**Recommendation: A.** It keeps the design and is the correct WCAG reading. It needs approval, because it scopes an existing test.

## 7. Not verified / to do before going public

- The problem-section statistics (HCP, EMO 2026 Q2) are shown as in the design, with their printed source. They have **not** been checked against the published HCP release.
- Tamazight names for skills missing from the prototype's list (e.g. "Comptabilité") fall back to French. This needs a native Tamazight review.
- The old landing components from the earlier redesign (`hero-studio`, `story`, `states-demo`, `lang-band`) are now unused. They were left in place, not deleted.
