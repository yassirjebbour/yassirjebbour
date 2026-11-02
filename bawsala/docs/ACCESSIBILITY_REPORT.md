# BAWSALA — Accessibility report (2026-11-02)

Target: WCAG 2.2 AA.

## Automated checks

axe-core (via `@axe-core/playwright`, tags wcag2a, wcag2aa, wcag21aa, wcag22aa) on `/`, `/signin`, `/app/onboarding`,
`/app`, `/app/passport`, `/app/opportunities`, `/app/assistant`, `/app/settings`: **0 serious or critical violations**
(`tests/e2e/journey.spec.ts`, runs in CI). Lint rules `jsx-a11y` pass.

Defects found and fixed: warning-colour text 4.41:1 on its background (now ≥ 5:1); links inside text distinguished by
colour only (now underlined); progress meter shared its accessible name with the text area it measures (renamed).

## Design measures in place

- Semantic landmarks (`header`, `nav`, `main#main`, `footer`), "Skip to content" link, one `h1` per page.
- All inputs have visible labels; errors are announced (`role="alert"`) and linked to fields; `aria-invalid`.
- Visible focus ring on every interactive element (`:focus-visible`, 2 px, brand colour).
- Touch targets ≥ 40–44 px for buttons, chips and navigation.
- Native `<dialog>` for modals (focus trap and Escape handled by the browser).
- `aria-live` regions for streaming answers, toasts and try-it results; `aria-busy` while streaming.
- `prefers-reduced-motion` disables animations; `prefers-color-scheme` plus a manual theme toggle.
- RTL: logical CSS properties throughout; `dir` and `lang` set on `<html>`; mixed-script paragraphs use
  `unicode-bidi: plaintext` so French/English passages read correctly inside Arabic pages.
- Tifinagh: Noto Sans Tifinagh is self-hosted and verified to be used by the browser (E2E `document.fonts.check`).
- Numbers use Latin digits in all locales (Moroccan usage); dates are localised.

## Not yet done

- Manual screen-reader testing (NVDA/JAWS on Windows, VoiceOver on iOS/macOS, TalkBack) — required before launch.
- Keyboard-only walkthrough of the whole journey by a person (automated tests use keyboard for chat only).
- Zoom to 200%/400% reflow review, and long-string overflow review in every language on the smallest screens.
- Cognitive accessibility review of the Darija/Tamazight copy with native speakers.
