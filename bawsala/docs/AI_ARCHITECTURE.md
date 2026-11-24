# BAWSALA — AI architecture

The AI is a set of controlled capabilities around a deterministic core, not a chatbot wrapper.

## Components

| Component | File | What it does | Status |
|---|---|---|---|
| Provider interface | `src/server/ai/providers/types.ts` | `streamTurn()` (streaming, tool calls) and `structured()` (schema-validated JSON). Typed errors (`rate_limited`, `unavailable`, `auth`, `timeout`, `cancelled`). | Implemented, tested with a scripted provider |
| Anthropic provider | `src/server/ai/providers/anthropic.ts` | Messages API via `@anthropic-ai/sdk`: streaming, client tools with `eager_input_streaming`, prompt caching on the system prompt, `output_config.effort`, server-side refusal fallback (`fallbacks: "default"`), structured outputs with zod, 2 SDK retries, 90 s timeout. | Implemented; **not exercised against the live API in this environment (no key)** |
| Model routing | `src/server/ai/config.ts` | Model per task (`chat`, `extract`, `title`) from env; price table for cost estimates; prompt versions. | Implemented |
| Orchestrator | `src/server/ai/chat.ts` | Student context (compact, no email/ids), history window (16 messages), bounded tool loop (≤5 rounds, ≤8 calls), parallel tool execution, SSE events, citations limited to sources actually used, follow-up suggestions, persistence, stop, regenerate, fallback to basic engine on provider outage. | Implemented, integration-tested |
| Basic engine | `src/server/ai/basic.ts` | Deterministic intent routing (EN/FR/MSA/Darija both scripts) → same tools → localised Markdown. Used without a key, when `ai.llm` is off, over budget, or when the provider is down. | Implemented, tested |
| Tools | `src/server/ai/tools/*` | 15 tools, each with zod input/output schemas, permission class, validation, logging. | Implemented, each tested |
| Skill extraction | `src/server/ai/analysis.ts` | Rules engine + LLM structured extraction; every LLM quote must be found in the student's text or it is discarded. | Rules path tested; LLM path tested only through the interface |
| RAG | `src/server/rag/*` | See `RAG_PIPELINE.md`. | Implemented, evaluated |
| Usage & cost | `src/server/ai/usage.ts`, table `ai_usage` | Tokens (incl. cache reads/writes), estimated USD, latency, model, prompt version, error code per call; per-user daily window; platform daily budget. | Implemented |
| Kill switches | `feature_flags` | `ai.assistant`, `ai.llm`, `ai.analysis`, `rag.search` (admin UI, effect within 15 s). | Implemented |

## Tools

| Tool | Permission | Effect |
|---|---|---|
| `analyze_skills` | suggest | Creates skill *suggestions* the student must accept |
| `analyze_cv` | read | Structure/contact/numbers/action verbs/sensitive-data checks + skills with quotes |
| `discover_careers` | read | Roles ranked by fit with reasons |
| `match_opportunities` | read | Ranked opportunities with source, date and data status (verified/unverified/demo) |
| `analyze_skill_gap` | read | Have/missing in priority order, free resources, readiness (evidenced vs claimed) |
| `create_learning_roadmap` | **confirm** | Drafts a plan and creates a pending action; saved only when the student presses Confirm |
| `find_learning_resources` | read | Catalogue resources for given skills or current gaps |
| `interview_simulation` | read | Role questions; transparent STAR rubric scoring |
| `application_assistant` | read | Maps requirements to the student's own evidence; checklist; facts for a letter |
| `analyze_progress` | read | Plan completion, overdue, streak, evidence, next task |
| `compare_options` | read | Career decision support: side-by-side fit, gaps, learning hours |
| `improve_profile` | read | Prioritised profile actions with links |
| `search_knowledge` | read | Hybrid retrieval with numbered, attributed passages |
| `save_opportunity` | reversible | Bookmark (undoable in the UI) |
| `get_my_plan` | read | Current plan and tasks |

The user id always comes from the session (`ToolContext`); tools have no user parameter, so a model (or an injected
document) cannot target another account — tested in `tests/integration/chat.test.ts`.

## Context management and privacy

- The student context sent to the model: first name, interface language, situation, field, level, city (if given),
  languages, goal (≤300 chars), target role, passport skill names+states+evidence counts, counts of suggestions and
  experiences, plan progress, today's date. Never: email, password, ids other than the target opportunity id.
- It travels inside the user turn as data (`<student_context>`), not as system text, so student-written content never
  gains operator authority.
- History: last 16 non-error messages, 6,000 characters each. Tool results capped at 30,000 characters.
- The system prompt is byte-stable for prompt caching; per-student data comes after it.

## Prompt-injection defences

1. The system prompt states that student context, tool results and knowledge passages are data.
2. Tools enforce authorization independently of the model.
3. Consequential effects require a human confirmation through a separate endpoint (`/api/v1/actions/:id`).
4. Knowledge documents are sanitised at ingestion (tags, scripts, bidi controls removed) and only admins can add them.
5. Markdown output is rendered without raw HTML; external links open with `noopener noreferrer nofollow`.

## LLMOps

- **Prompt versions** recorded on every message and usage row (`chat-2026-11-02.1`, `extract-2026-11-02.1`).
- **Model versions** recorded per call (`ai_usage.model`, `messages.engine`).
- **Evaluation before change:** `npm run eval:ai` (retrieval + rules) and `npm run eval:ai -- --llm` (adds LLM
  extraction metrics, cost and latency) produce `docs/eval/results-<date>.json`; compare before switching model/prompt.
- **Human feedback:** 👍/👎 per assistant message (`messages.feedback`), visible in the admin overview.
- **Limits:** 12 chat requests/min and `AI_DAILY_MESSAGES_PER_USER` per 24 h per student (counts regenerations);
  `AI_DAILY_BUDGET_USD` platform-wide, above which the assistant answers in basic mode.
- **Not implemented yet:** conversation summarisation for very long threads (history is windowed instead), response
  caching (answers are personalised; only the system prompt is cached), a second LLM provider implementation.

## What requires the API key to verify

The live behaviour of `AnthropicProvider` (streaming events, tool-use round trips, structured outputs, refusal
fallback, cost numbers) is implemented from the SDK's documented interfaces and type-checks, but has not been
executed against the API in this environment. First step after adding the key: `npm run eval:ai -- --llm` and one
manual conversation per language; record results in `AI_EVALUATION_REPORT.md`.
