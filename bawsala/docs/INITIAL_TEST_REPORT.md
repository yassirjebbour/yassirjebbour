# Initial test report (prototype, before the rebuild — 2026-11-01)

Run in headless Chromium against `BAWSALA.1.html` (identical to `BAWSALA.html`):

- Loads with 0 JavaScript errors, 0 external requests, no horizontal overflow at 1366 px and 390 px; ~3 s load.
- AI: `window.claude` absent outside Claude artifacts → rules engine only; no backend calls exist (`fetch` count 0).
- Persistence: browser `localStorage` only; clearing the browser loses the passport.
- Skill detection measurements: see `PROJECT_AUDIT.md` (Arabizi 1/3, French 1/3).
- Existing repository tests: the Repair OS project has `node --test server/` (unrelated to BAWSALA; not modified).
