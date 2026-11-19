---
name: extract-legacy
description: Programmatically extract i18n strings, data, prompts, tokens, icons and the offline reader from the SKILMA v0.9 prototype.
disable-model-invocation: true
---
Target: $ARGUMENTS (or everything if empty)

Source: prefer the readable sources in docs/legacy/src/ (app.js = the whole app, unminified; base.css + skilma.css = styles). docs/legacy/SKILMA_v0.9.html is the built v12 file (minified), for screenshots and parity checks only.

Rules: write extraction scripts in /scripts/legacy/ (Node or Python), never retype content by hand, keep outputs reproducible.

Extract:
1. i18n: entries shaped like `key:["en","fr","ar", ...]` → messages/en.json, fr.json, ar.json only (zgh/ary overlays were removed in v12; ignore any leftovers). Preserve ICU-like plurals `{n|one:#…|other:#…}` and convert them to ICU MessageFormat. Report count per locale and missing keys.
2. Data: SK (skills, ar/fr/en labels), RARE, HINT (regexes), OPPS (mark is_demo = true), ELIG, RES, CHANGES → supabase/seed/*.sql or JSON fixtures.
3. Prompts: every template literal starting with "You are" → /prompts/<task>/v1.md with variables documented; draft a .schema.json matching how the code parses the output; record the legacy PROMPT_V map.
4. Design tokens: :root CSS variables (light) and the dark theme variables → /styles/tokens.css + a typed tokens.ts.
5. Icons: inline SVG paths in the icon function → React components.
6. Offline reader: the rules-based skill detection (HINT + helpers like norm/negated/sentences) → /lib/offline-reader with unit tests using the sample stories found in the file AND docs/legacy/evals/*.json (the reader must keep ≥ 76% recall / ≥ 95% precision on eval_blind.json: run docs/legacy/evals/eval_reader.js for the baseline).
7. Fonts: do NOT keep base64 fonts; use self-hosted WOFF2 IBM Plex files via next/font.
Finish with a report: what was extracted, counts, anything ambiguous.
