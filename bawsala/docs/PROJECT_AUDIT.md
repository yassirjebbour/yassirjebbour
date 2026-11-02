# BAWSALA — Project audit (initial state, 2026-11-01)

## Repository at start

- Branch `claude/nice-brahmagupta-ophs0a`, one commit (`b3501bd`): **Repair OS**, an unrelated Express + Postgres PWA
  for a phone-repair business. No BAWSALA code was in the repository.
- BAWSALA existed only as files shared by the founders (inventory with hashes: `legacy/MANIFEST.md`):
  three generations of single-file HTML prototypes, brand marks/icons, an Arabic product-quality guide, and saved
  pages of the design conversation.

## Prototypes compared

| File | Size | What it is |
|---|---|---|
| `bawsala-prototype (2).html` | 122 KB | First linear 7-station flow (Oct 7) |
| `bawsala-platform (1).html` / `bawsala-public.html` | 824 KB | Platform build: student, institution and operations portals (two copies differing by a build flag) |
| `BAWSALA.html` = `BAWSALA.1.html` | 1.47 MB | v0.9 build |
| **`BAWSALA_Prototype_v2 (1).html`** | 1.48 MB | **Reference**: same lineage as v0.9 with v2 labels; most complete |

Reference chosen: v2 — it contains the richest catalogue (20 skills, 12 roles with requirements and Day-30 projects,
resources, drills), a five-language UI dictionary (~1,945 keys; 1,712 in Darija and in Tamazight), the rules engine,
and the most polished UX.

## How the prototypes work (verified by running and reading the code)

- All state in `localStorage` (`bawsala.v4`); no backend, no `fetch`.
- "AI" only inside Claude artifacts (`window.claude.use("sample")`); elsewhere a regex rules engine.
- Institution/operations consoles, verification, certificates and analytics run on demo data generated in the browser.
- The 12 opportunities name fictional organisations (e.g. "Tanmia B2B", "Boughaz Logistics").
- Runs without console errors at 1366 px and 390 px.

## Initial defects measured (prototype, 2026-11-01)

| Input | Expected skills | Prototype found |
|---|---|---|
| English sentence (shop/Instagram/club) | 5 | 5 |
| Darija, Arabic script | ≥4 | 4 |
| **Darija, Latin script** ("kansa3ed baba f7anout, kanbi3 f instagram w organisit nashat dyal nadi") | 3 | **1** |
| **French** ("stage en comptabilité, caisse, trois langues") | 3 | **1** |

## Conclusion

Keep the product thinking, copy, data and brand; rebuild the system with a real backend, database, authentication,
a provider-neutral AI layer and retrieval. See `EXISTING_FEATURES_INVENTORY.md` for what was carried over, and
`IMPLEMENTATION_PLAN.md`.
