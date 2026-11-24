# BAWSALA — Cost analysis

**Not the same budget:** the Claude Cloud Session credits used to *build* BAWSALA are a development expense and have
no relation to BAWSALA's *operating* costs below. Prices are list prices known as of late 2026 and must be re-checked
on each provider's pricing page before committing; nothing has been purchased.

## 1. Model (LLM) costs — the variable cost that matters

Per-token prices used by `src/server/ai/config.ts` (USD per million tokens): Claude Opus 5.5 $4 input / $20 output /
$0.20 cache read; Claude Sonnet 5.5 $2 / $10 / $0.20; Claude Haiku 5.5 $0.10 / $0.50.

**Estimated tokens per assistant turn (not yet measured — no API key in the build environment):**
system prompt ≈ 900 + 15 tool schemas ≈ 2,500 (cached after the first call) · student context ≈ 300 · history ≈ 1,500 ·
tool results ≈ 1,500 per tool round · output ≈ 450. A typical turn = 2 model calls (tool call + answer):
≈ 5,100 uncached input, ≈ 6,800 cached input, ≈ 550 output tokens.

| Model (effort low) | Cost per turn | Skill extraction per experience |
|---|---|---|
| Opus 5.5 (default) | ≈ $0.033 | ≈ $0.012 |
| Sonnet 5.5 | ≈ $0.017 | ≈ $0.006 |
| Haiku 5.5 | ≈ $0.001 | ≈ $0.0005 |

**Usage assumption per monthly active student:** 15 assistant turns + 3 experience analyses.

| MAU | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
|---|---|---|---|
| 100 | ≈ $53 / month | ≈ $27 | ≈ $1.5 |
| 1,000 | ≈ $530 | ≈ $270 | ≈ $15 |
| 10,000 | ≈ $5,300 | ≈ $2,700 | ≈ $150 |

Controls already built: per-student daily message window (`AI_DAILY_MESSAGES_PER_USER`, default 60), platform daily
budget (`AI_DAILY_BUDGET_USD`, default $20 → basic mode above it), prompt caching, effort `low`, cost per call stored in
`ai_usage` and shown in the admin console. **Recommendation:** start the pilot on Opus 5.5 with a $20/day budget, run
`npm run eval:ai -- --llm` for Sonnet 5.5 and Haiku 5.5 on the same sets, and switch the `extract` route (and possibly
chat) to the cheapest model that matches quality on the Darija/Arabizi cases. Replace these estimates with real
`ai_usage` data after the first week.

## 2. Infrastructure

| Component | Option A (lowest cost) | Option B (managed, more headroom) | Notes |
|---|---|---|---|
| App container (≥1 GB RAM: embedding model ≈ 650 MB RSS) | Small VPS (e.g. 2 vCPU / 2–4 GB) ≈ $5–12/mo | PaaS container (Fly.io / Render / Railway) 1–2 GB ≈ $10–30/mo | Serverless functions are a poor fit (model size, ~550 MB native runtime) |
| PostgreSQL 16 + pgvector | Same VPS (self-managed, must run backups) ≈ $0 extra | Supabase Pro ≈ $25/mo or Neon ≈ $19+/mo (PITR, pgvector included) | Managed DB recommended once real users join |
| File storage (CVs) | In Postgres (bytea) | S3-compatible private bucket ≈ $1–5/mo at pilot scale | Move when > a few GB |
| Email | Resend free tier (≈3,000/mo) | Resend paid ≈ $20/mo | Only transactional + opt-in reminders |
| Error tracking | Logs only | Sentry developer tier (free) / team ≈ $26/mo | Not wired yet |
| Domain + TLS | ≈ $10–15/year + free TLS (Let's Encrypt / platform) | same | |

| MAU | Infra (A) | Infra (B) |
|---|---|---|
| 100 | ≈ $6–15/mo | ≈ $35–60/mo |
| 1,000 | ≈ $12–25/mo | ≈ $60–100/mo |
| 10,000 | ≈ $40–80/mo (2 app instances, bigger DB VM) | ≈ $150–300/mo |

## 3. Total monthly estimate (infra B + Sonnet 5.5-class model)

| MAU | Estimate |
|---|---|
| 100 | ≈ $60–90 |
| 1,000 | ≈ $330–370 |
| 10,000 | ≈ $2,850–3,000 (model cost dominates; Haiku-class routing for simple turns could cut this by an order of magnitude if evaluation allows) |

## 4. Cost risks

- Long conversations grow input tokens; history is windowed to 16 messages but not summarised.
- Regenerations count toward the per-user window; abusive accounts are capped, and the platform budget is a hard stop.
- Embedding locally avoids per-query fees but ties RAM to every app instance.
