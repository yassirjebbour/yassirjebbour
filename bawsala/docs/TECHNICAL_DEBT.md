# Technical debt (known, prioritised)

| Item | Impact | Pri |
|---|---|---|
| `src/server/domain/catalog.ts` is generated JSON-in-TS from the prototype; skills/roles should move to admin-editable tables only | Two sources of truth (catalogue + DB) | P2 |
| `src/lib/skill-names.ts` duplicates skill names for the client | Must be regenerated when skills change | P2 |
| Admin console is one large client component | Maintainability | P3 |
| Ranking loads all opportunities per request | Fine to a few thousand rows | P2 |
| Rules-engine regexes are hand-written and evaluated on a team-written set | Real-world accuracy unknown | P1 |
| No conversation summarisation (history window only) | Long threads lose early context | P2 |
| PDF parsing in-process | Residual DoS risk (F-05) | P2 |
| App role owns the tables (F-17) | Less defence in depth | P1 |
| Pending-action cards in old conversations show "pending" again after reload | Minor UX confusion (confirm returns "already done") | P3 |
| Arabic `يوماً` wording is only correct for 11+ days (paths can be 7–10 days) | Minor grammar | P3 |
| Repair OS shares the repository root | Confusing for new engineers | P2 (split repos) |
