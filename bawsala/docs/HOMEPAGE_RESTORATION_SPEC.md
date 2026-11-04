# Homepage restoration: specification (from the original prototype)

**Source of truth.** `legacy/prototypes/BAWSALA.html`, the file the owner sent, SHA-256 `2c596f15151dd9fe…`. The page is
rendered by its function `vPubHome()`, wrapped by `pubPage("home", …)`. Everything below was read from that file, not
written from memory.

**Languages.** Five: `en`, `fr`, `ar`, `ary`, `zgh`.
- Dictionary `T` holds `[en, fr, ar]` and has 1,945 keys.
- `ARY` (1,712 keys) and `ZGH` (1,713 keys) override it.
- Missing keys fall back: Darija → Arabic, Tamazight → French. This is the prototype's own rule `LK()`.

**Theme.** `data-theme="light|dark"` on `<html>`, plus `prefers-color-scheme`. This is the same mechanism the app
already uses.

## Page order: header, 11 sections, footer

| # | Element (prototype) | Content | Assets | Interactions (prototype `data-act` / runtime) |
|---|---|---|---|---|
| 0 | `header.pub-nav` | Official mark `bw-mark` and wordmark; nav links (How it works, Institutions, Vision); language picker; theme toggle; Sign in; Get started; mobile menu | Inline SVG mark | `pub:*`, `lang-pick` (popup `#pop.mpop` > `.lp-menu`), `theme-toggle`, `pub:signin`, `start`, `pub-menu` |
| 1 | `section.hero3` | Hero road SVG (`heroRoad()`); kicker; title with highlighted words (`heroTitle()`: `h4_a` + `<span class="h-hl">h4_b</span>` + `h4_c`); subtitle; CTAs; three facts; **live story** `#lv` (`liveHTML()`) | Road path, `animateMotion` mover, star with glow, gradient `#hrg` | `start`, `scroll-to#try`, `live-toggle`. Runtime `livePlay()`: typing (`liveType`), word marks (`markAll`), chips flying to slots (`liveFly`, Web Animations API), counter `#lvN`, ring `.lv-ring .g-val`, 7-step path, stamp, connecting wires (`liveWires`, recomputed on resize), step captions `lv_c1…3`, loop every ~15 s, reduced motion → final state |
| 2 | `section.life` | Marquee "experience → skill" (`lifeStrip()`, `LIFE` data), two rows (one reversed) | Icons per experience | `ls-toggle` (pause/play, icon `filmIcon`, `aria-pressed`) |
| 3 | `section#try` | Try it now: textarea, example and starter chips, local-processing note, result panel `#tryOut` (`tryOut()`) | — | `try-ex`, `try-st`, `try-clear`, `try-save`; input debounced 160 ms → `tryRefresh()` |
| 4 | `section#problem` | Four student questions; unemployment-by-diploma bars; two stat cards; source line (`pb_src`: HCP, EMO 2026 Q2) | — | Reveal; counters `data-cv` |
| 5 | `section#engine` | "One path, five steps" (`engineHTML()`, `ENGINE`): skills → roles → gaps → 30-day days → readiness ring | Gauge `ring()` | Reveal (`.engine` gets `in`); CTA "Watch how it works" (`pub:how`) |
| 6 | `section#get` | Feature tiles (`featTiles()`): passport, roles map, 30-day path, interview | Small illustrations | Reveal (`.rv-g` stagger); pointer spotlight (`spotlight()`) |
| 7 | `section#trust-h` | Four skill states; three privacy points; "More about trust" | — | Reveal; `pub:trust` |
| 8 | `section#impact` (`sec-ink`) | Ten dots → one star equation; text; three points; two CTAs | Star path | Reveal; `pub:access`, `pub:how` |
| 9 | `section#inst` | For institutions: text, two CTAs; console preview window labelled "Sample data", with an attention card and a funnel (`UNI.funnel`) | — | Reveal; bars `data-w` (`setBars`); `pub:institutions`, `portal:uni` |
| 10 | `section#faq` (`sec-sunk`) | FAQ list (`fq1, fq2, fq3, fq4, fq5, fq9`) | — | Native disclosure |
| 11 | `section.lp2-final` | Final call (`fin4_t`, `fin_d`) and CTA | — | `start` |
| 12 | `footer.pub-foot` | Link columns; accessibility tools (language, theme, listen, data saver, font size); notes | — | `lang`, `theme`, `listen` (Web Speech), `lite`, `fsize`, `pub:*`, `pilot` |

Global runtime (`pubMount()`):
- an `IntersectionObserver` adds `in` to `.rv, .chain, .jy, .xl, .feat, .engine, .imp`;
- `.rv-g` children are staggered by `(i % 4) × 80 ms`;
- `[data-w]` bars and `[data-cv]` / `[data-count]` counters start when they come into view;
- `spotlight()` on fine pointers;
- reduced motion or "calm/lite" shows the final states.

## How it maps into the app

| Prototype | App implementation |
|---|---|
| Markup of sections 0–12 in all 5 languages | Rendered by the prototype itself and captured by `scripts/proto-home/extract.mjs` into `src/components/public/proto-home/snap.<locale>.ts`. Class names get a `p-` prefix so app styles cannot change them. |
| CSS | The rules the homepage uses (and their `@keyframes` and `@media`), extracted from the prototype into `src/styles/proto-home.css` and scoped to `.bwh`. Prototype tokens are mapped from `:root` to `.bwh`; dark mode keeps `[data-theme]` and `prefers-color-scheme`. |
| Strings used at runtime (captions, labels, try-it texts, examples, starters, live story) | Taken from the prototype dictionaries into `src/components/public/proto-home/strings.ts`, with the prototype's fallback rule. |
| `livePlay` / `liveToggle` / `liveWires` / `liveFly` / `liveType` / `markAll` | Ported line by line into `src/components/public/proto-home/runtime.ts` (same timings and same Web Animations keyframes). |
| `pubMount` (reveals, bars, counters, spotlight) and `ls-toggle` | Ported into the same runtime. |
| Try-it engine (`tryRead` → `rulesDiscover`, regex rules on-device) | The app's production rules engine `detectSkills()`, run in the browser. It is the same pure, deterministic engine (no secrets, no user data, no network). That keeps the prototype's claim "Read on this device by the built-in reader" true and sends no request per keystroke. Role ranking ports `tryRead`'s `fitWith` on the app's real role requirements. Learning hours come from the app's catalog. |
| `start`, `pub:signin` | `/signup` (signed out) or the user's home (signed in, label `pub_open`); `/signin`. |
| Language picker, footer language, theme | The app's `/api/v1/locale` and its theme toggle. |
| `listen`, `lite`, `fsize` | Implemented in the browser, as in the prototype: Web Speech API, the `lite` class, and zoom. |

## Prototype elements with no real counterpart (reported, not faked)

| Element | Decision |
|---|---|
| Pages that do not exist yet: How it works, Vision, Institutions, Trust, Accessibility, Example, Changelog, Brand, Employers, Partners | Header and footer links to them are hidden. The in-page links "How it works", "Institutions" and "Trust" scroll to their homepage sections, which do exist. |
| "See the institution view" (`portal:uni`, sample console) | Hidden: there is no public sample portal in the app. The preview window itself stays; the prototype labels it "Sample data". |
| "Request a pilot" (`pilot`) | Points to `/help`, the real contact form. |
| `try-save` stores the draft and opens the composer | Opens `/signup`. The app has no draft hand-off from the homepage yet. |
| Problem-section statistics (HCP, EMO 2026 Q2) | Kept exactly as in the design, with its printed source. **They have not been verified** against the published HCP release; this must be done before going public. |
