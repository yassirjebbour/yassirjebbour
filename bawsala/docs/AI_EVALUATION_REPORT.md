# BAWSALA — AI evaluation report (2026-11-02)

Reproduce: `DATABASE_URL=… npm run eval:ai` (add `-- --llm` when `ANTHROPIC_API_KEY` is set). Raw results:
`docs/eval/results-2026-11-02.json` (final) and `docs/eval/results-2026-11-02-baseline.json` (before the changes
described below). Datasets: `tests/fixtures/retrieval.ts` (42 queries), `tests/fixtures/skill-extraction.ts` (21 cases).
The same thresholds run in CI as regression tests.

## 1. Retrieval (RAG)

Metric definitions (document level, k = 5): **hit@1** = a correct document is ranked first; **recall@5** = a correct
document is among the top 5; **MRR** = mean reciprocal rank of the first correct document. Latency = server-side
retrieval incl. query embedding, warm model, local Postgres.

### Ablation (final corpus)

| Configuration | hit@1 | recall@5 | MRR | p50 latency |
|---|---|---|---|---|
| Vector only (pgvector, e5-small) | **0.833** | 0.929 | 0.881 | 6 ms |
| Keyword only (full-text + trigram) | 0.595 | 0.786 | 0.667 | 7 ms |
| Hybrid RRF 1:1, no stopwords | 0.762 | 0.952 | 0.839 | 11 ms |
| **Hybrid RRF 1:1 + stopwords (default)** | 0.810 | **1.000** | 0.886 | 11 ms |
| Hybrid RRF 1:0.5 + stopwords | 0.833 | 0.976 | **0.890** | 11 ms |

### Default configuration by language

| Language | n | hit@1 | recall@5 | MRR | Vector-only recall@5 |
|---|---|---|---|---|---|
| English | 11 | 0.818 | 1.000 | 0.882 | — |
| French | 11 | 1.000 | 1.000 | 1.000 | — |
| Modern Standard Arabic | 8 | 0.750 | 1.000 | 0.854 | — |
| Darija, Arabic script | 4 | 0.750 | 1.000 | 0.875 | — |
| **Darija, Latin script (Arabizi)** | 7 | 0.571 | 1.000 | 0.738 | **0.571** |
| Tamazight, Tifinagh | 1 | 1.000 | 1.000 | 1.000 | — |

**Decision.** Hybrid RRF 1:1 with stopwords: it is the only configuration with recall@5 = 1.0, and the gain is
concentrated where BAWSALA's users are (Latin-script Darija 0.571 → 1.0). The LLM receives the top 5 passages, so
recall@5 matters more than hit@1.

**What changed between baseline and final.** (1) Stopword filtering for the keyword channel (EN/FR/MSA/Darija);
(2) RRF weights; (3) English summaries added to the ANAPEC and OFPPT documents (a real content gap: English questions
about vocational training found nothing). Point (3) improves the content the test measures, so the final numbers are
partly a content fix, not only an algorithm fix — both runs are kept for transparency.

**Limitations.** Queries were written by the team (optimistic bias; no real student logs yet). Tifinagh has one query,
which succeeded only via the Latin word "ANAPEC": **Tamazight retrieval should be treated as unsupported**. Darija
script coverage is small (4 + 7 queries). Next step: collect ~200 real, anonymised questions in the pilot.

## 2. Skill extraction

### Deterministic engine (always on; used alone when no LLM key)

| Language | Precision | Recall | Forbidden suggestions (negations/wishes) |
|---|---|---|---|
| English | 1.00 | 1.00 | 0 |
| French | 1.00 | 0.875 | 0 |
| MSA | 0.75 | 1.00 | 0 |
| Darija, Arabic script | 0.909 | 1.00 | 0 |
| Darija, Latin script | 1.00 | 1.00 | 0 |
| Tamazight (Tifinagh) | 1.00 | 1.00 | 0 |
| Mixed FR/Darija | 1.00 | 1.00 | 0 |
| **Overall (21 cases)** | **0.943** | **0.980** | **0** |

**Caveat.** The cases and the rule patterns were written by the same team in the same session; these numbers are an
upper bound for in-domain phrasing, not an estimate of real-world accuracy. Before the session's improvements, the
v2 prototype's rules found 1/3 skills in an Arabizi sentence and 1/3 in a French sentence (measured on
2026-11-01 in the prototype); the same sentences now return all expected skills.

### LLM extraction

**Not run** — no `ANTHROPIC_API_KEY` in this environment. Implemented safeguards that will be measured by
`npm run eval:ai -- --llm`: structured output schema, catalogue-only skill ids, quote grounding (an LLM quote that
does not occur in the student's text is discarded and counted as `ungrounded_quotes_discarded`), max 8 skills,
union with the rules engine. Report fields: precision/recall/forbidden violations per language, discarded quotes,
p50 latency, estimated cost.

## 3. Hallucination controls (tested)

| Control | Test |
|---|---|
| Ungrounded extraction quotes discarded | `tests/unit/domain.test.ts` (quoteIsGrounded) |
| Rules engine quotes are substrings of the input | `tests/unit/skills-engine.test.ts` |
| Numbers (fit, gaps, progress) computed by tools, not the model | tool tests + orchestrator test |
| Demo opportunities always labelled in tool output | `tests/integration/tools.test.ts` |
| Citations shown only for sources the answer used | `tests/integration/chat.test.ts` |
| No skill becomes "verified" without an institution admin | `tests/integration/institution.test.ts` |

## 4. Tool execution reliability

All 15 tools executed successfully against real Postgres for real test users; invalid inputs are rejected before
execution (`tests/integration/tools.test.ts`). The orchestrator's loop bound (≤5 rounds, ≤8 tool calls) and the
injection scenario (model asks for another user's plan → gets the caller's own empty plan) are tested with a
scripted provider.

## 5. Latency and cost

| Measure | Value | Source |
|---|---|---|
| Retrieval p50 (hybrid, warm) | 11 ms in-process eval; 29–59 ms over HTTP | eval + `PERFORMANCE_REPORT.md` |
| First retrieval after restart (model load) | ~1.05 s | measured over HTTP |
| Basic-engine chat turn (full SSE stream) | 39 ms | measured |
| LLM chat turn | not measured (no key) | estimate in `COST_ANALYSIS.md` |
| Cost per LLM turn | not measured; estimate $0.02–0.04 with Opus 5.5 at effort low | `COST_ANALYSIS.md` |

## 6. Multilingual quality of the interface

All five catalogues have exactly the English keys, keep every placeholder, and Arabic/Darija plurals have all six
forms (tests). French and MSA were translated by one workstream, Darija and Tamazight by another using the
prototype's reviewed dictionary as terminology reference. **69 Tamazight strings are marked `// review` in
`src/i18n/messages/zgh.ts`** and the whole Tamazight and Darija catalogues need native-speaker review before launch.
