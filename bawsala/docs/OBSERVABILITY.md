# Observability

This document covers what the code emits today, recommended alerts, and the incident runbook. **Alerting is not implemented in the repository.** The thresholds in §2 are recommendations to configure in the host's log or metrics tooling, or as scheduled SQL.

## 1. What exists

### 1.1 Structured logs (`src/server/log.ts`)

- **Format:** one JSON object per line: `{"t": ISO time, "level", "event", ...fields}`. `error` goes to stderr, `warn` to `console.warn`, `info` to stdout; `debug` is dropped in production.
- **Errors:** `err` fields are serialised as `{name, message, stack}` with the first 8 stack lines.
- **Rule** (from the code comment): never log passwords, tokens or student-written content; log ids and sizes instead. The exception is `email.dev_preview`, which is non-production only.
- **Sentry:** `log.ts` mentions `SENTRY_DSN` and `src/instrumentation.ts`, but **that file does not exist**, so nothing is forwarded to an error tracker.

| Event | Level | Source | Fields |
|---|---|---|---|
| `api.unhandled` | error | `route()` wrapper, `src/server/http/api.ts` | `ref` (also returned to the client in the 500 body), `path`, `method`, `ms`, `err` |
| `ai.usage` | info | `src/server/ai/usage.ts`, one per model call | `feature`, `engine`, `model`, `in`, `out`, `cr`, `ok`, `ms`, `cost`, `err` |
| `ai.usage.write_failed` | warn | usage.ts | `err` |
| `ai.extract.failed` | warn | `src/server/ai/analysis.ts` | `err` (falls back to the rules engine) |
| `chat.llm_fallback_basic` | warn | `src/server/ai/chat.ts` | `conv`, `code` (provider outage → basic engine) |
| `chat.basic_failed` | warn | chat.ts | `err` |
| `chat.failed` | warn | chat.ts | `conv`, `err` |
| `tool.ok` | info | `src/server/ai/tools/registry.ts` | `tool`, `user`, `ms` |
| `tool.invalid_input` | info | registry.ts | `tool`, `user`, `message` |
| `tool.invalid_output` | error | registry.ts | `tool`, `issues` (a bug) |
| `tool.failed` | warn | registry.ts | `tool`, `user`, `code`, `err` |
| `retrieval_log.failed` | warn | `src/server/rag/retrieve.ts` | `err` |
| `notify.failed` | warn | `src/server/notify.ts` | `kind`, `err` |
| `email.dev_preview` | info | notify.ts, **non-production only** | `to`, `subject`, `text` |
| `upload.extract_failed` | warn | `src/server/repo/files.ts` | `mime`, `bytes`, `err` |
| `event.write_failed` | warn | `src/server/events.ts` | `name`, `err` |
| `cron.daily` | info | `POST /api/v1/cron/daily` | `due`, `sent`, `failed`, `skipped` |
| `client.error` | warn | `POST /api/v1/events` | `user`, `client` {sanitised `message` (≤ 80 chars), `page`} |
| `health.db_failed` | error | `GET /api/health/ready` (raw `console.error`, no `t` field) | `err` |

The app writes no access log and no per-request line. Request counts, status codes and latency come only from the host or proxy. 500s are visible as `api.unhandled` only for `route()`-wrapped handlers. Failures in `/cron/daily`, `/unsubscribe`, the health routes, and errors inside the chat SSE stream after headers are sent appear only in Next.js's own output.

### 1.2 Database telemetry

| Source | What it records | Typical use |
|---|---|---|
| `ai_usage` | one row per model call (each chat round, each skill extraction): `feature` (`chat` \| `skill_extraction`), `engine`, `model`, `prompt_version`, input/output/cache tokens, `est_cost_usd`, `ok`, `latency_ms`, `error_code` (`refusal`, `timeout`, `unavailable`, …) | cost, error rate, latency per feature |
| `retrieval_log` | one row per knowledge retrieval (public search and the assistant's `search_knowledge`): `mode` (`hybrid` \| `keyword`), `latency_ms`, `results` (`[{chunk, doc, v, kw, s}]`) | empty-result rate, latency, embedder outage (`keyword` mode) |
| `events` | product analytics (ANALYTICS.md), including `tool.executed` {tool, ok} and `client.error` | tool failure rate, front-end errors, sign-up anomalies |
| `messages.status` | `complete` / `stopped` / `error` per assistant answer; `engine` = model id or `basic` | chat error rate, share of basic answers |
| `email_outbox.status` | `queued` / `sent` / `failed` / `skipped`, `attempts`, `last_error` | email delivery |
| `rate_limits` | current window counters per key | brute force and abuse |
| `feature_flags` | current switches, `updated_by`, `updated_at` | what was changed during an incident |
| `audit_log` | admin and security actions | who did what |

### 1.3 Client error reporting

`src/components/client-errors.tsx` listens for `window` `error` and `unhandledrejection` (at most 6 reports per page load). `src/app/error.tsx` reports error-boundary renders. Both send `POST /api/v1/events {name:"client.error", props:{message, page}}`. The server logs `client.error` and stores the event (message cut to 80 chars, no stack).

### 1.4 Health endpoints

| Endpoint | Meaning |
|---|---|
| `GET /api/health` | liveness: `{status:"ok", time}`. Used by the Dockerfile `HEALTHCHECK` (every 30 s, 3 retries). |
| `GET /api/health/ready` | readiness: runs a database query (skills count + latest migration). 503 if it fails; DB error details are logged, not returned. Also reports `llm.configured`, `embeddings.configured/model`, `version` (`APP_VERSION`). |

### 1.5 Admin overview (`GET /api/v1/admin/overview`, `src/server/repo/admin.ts`)

| Metric | Definition |
|---|---|
| `funnel` | of users with an `account.signed_up` event in the last 30 d: onboarded, any skill, target set, any plan, any completed task (ANALYTICS.md §2) |
| `wau` | distinct `events.user_id` in the last 7 d |
| `northStar` | distinct users with a completed `prove`/`project` task in the last 7 d |
| `users` | total and students |
| `ai` | per feature × engine, last 30 d: calls, errors, cost, p50 latency, tokens in/out |
| `tools` | `tool.executed` runs and failures per tool, last 30 d |
| `retrieval` | count, p50 latency, empty-result count, last 30 d |
| `feedback` | assistant thumbs up/down, last 30 d |
| `outbox` | email_outbox rows per status (all time) |

## 2. Recommended alerts

Run the SQL as a monitoring role inside a transaction that first runs `SELECT set_config('app.role','system',true);`, because RLS is forced on every table. The log queries are written for `jq` over JSON lines; adapt them to the host's log search.

| Signal | Recommended threshold | Query |
|---|---|---|
| 5xx rate | page if ≥ 5 `api.unhandled` in 5 min, or host 5xx ratio > 2 % over 10 min | `jq -r 'select(.event=="api.unhandled") \| .t[0:15]' app.log \| uniq -c` (10-min buckets); host HTTP metrics for the ratio |
| Readiness | page if `/api/health/ready` is non-200 on 2 consecutive checks (1 min apart) | external uptime check |
| Chat error rate | warn > 5 % of assistant answers in 1 h (with ≥ 20 answers) | `SELECT count(*) FILTER (WHERE status='error')::float / nullif(count(*),0) FROM messages WHERE role='assistant' AND created_at > now() - interval '1 hour';` |
| Provider errors | warn > 10 % failed chat calls in 15 min; info on any `chat.llm_fallback_basic` burst (> 10 in 15 min) | `SELECT count(*) FILTER (WHERE NOT ok)::float / nullif(count(*),0) FROM ai_usage WHERE feature='chat' AND created_at > now() - interval '15 minutes';` |
| Share of basic answers | info when > 50 % of answers in 1 h are `basic` while AI is configured (budget hit, flag off, or outage) | `SELECT count(*) FILTER (WHERE engine='basic')::float / nullif(count(*),0) FROM messages WHERE role='assistant' AND created_at > now() - interval '1 hour';` |
| AI cost vs budget | warn at 80 % of `AI_DAILY_BUDGET_USD`; at 100 % chat switches to basic automatically, but `skill_extraction` (`POST /experiences/:id/analyze`) is **not** gated by the budget | `SELECT feature, sum(est_cost_usd) FROM ai_usage WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' GROUP BY ROLLUP (feature);` |
| AI latency | warn if chat round p95 > 30 s or extraction p95 > 20 s over 1 h | `SELECT feature, percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms) p50, percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) p95 FROM ai_usage WHERE ok AND created_at > now() - interval '1 hour' GROUP BY feature;` |
| Retrieval latency | warn if p95 > 800 ms over 1 h | `SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms), percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) FROM retrieval_log WHERE created_at > now() - interval '1 hour';` |
| Retrieval empty results | warn > 25 % empty over 24 h (n ≥ 20); warn on any `keyword` mode when embeddings are expected | `SELECT count(*) n, count(*) FILTER (WHERE jsonb_array_length(results)=0)::float / nullif(count(*),0) empty_ratio, count(*) FILTER (WHERE mode='keyword') keyword FROM retrieval_log WHERE created_at > now() - interval '24 hours';` |
| Email failures | page on any `failed` in 24 h; warn on `skipped` in production (no `RESEND_API_KEY`) | `SELECT status, count(*) FROM email_outbox WHERE created_at > now() - interval '24 hours' GROUP BY status;` |
| Email backlog | warn if anything has been queued and due for > 26 h. Only `/auth/forgot` delivers immediately; every other email waits for the daily cron. | `SELECT count(*) FROM email_outbox WHERE status='queued' AND send_after < now() - interval '26 hours';` |
| Daily cron missing | page if no `cron.daily` log line in 26 h | `jq -r 'select(.event=="cron.daily") \| .t' app.log \| tail -1` |
| Sign-ups/hour anomaly | warn if the last hour is > 4× the 7-day hourly average and > 20 | `WITH h AS (SELECT date_trunc('hour', created_at) hr, count(*) n FROM users WHERE created_at > now() - interval '7 days' GROUP BY 1) SELECT (SELECT n FROM h WHERE hr = date_trunc('hour', now())) AS this_hour, avg(n) AS avg_hour FROM h;` |
| Credential stuffing | warn if any IP exceeds the sign-in limit, or > 20 accounts are locked in one window | `SELECT key, count FROM rate_limits WHERE (key LIKE 'signin:ip:%' AND count > 20) OR (key LIKE 'signin:fail:%' AND count >= 8) ORDER BY window_start DESC;` |
| Front-end errors | warn > 50 `client.error` per hour | `SELECT props->>'message' msg, count(*) FROM events WHERE name='client.error' AND created_at > now() - interval '1 hour' GROUP BY 1 ORDER BY 2 DESC;` |
| Tool failures | warn if any tool fails > 20 % over 24 h (n ≥ 10) | `SELECT props->>'tool' tool, count(*) runs, count(*) FILTER (WHERE props->>'ok'='false') failures FROM events WHERE name='tool.executed' AND created_at > now() - interval '24 hours' GROUP BY 1;` |

## 3. Request tracing status

There is **no correlation or request id**. No header is read or set, and log lines from the same request cannot be joined, except approximately by `user`/`conv` fields and timestamps. The only identifier the client sees is the `ref` in a 500 response, which matches one `api.unhandled` line. There is no OpenTelemetry or distributed tracing, and model calls are not linked to the HTTP request that caused them; `ai_usage` has no request or conversation id.

Recommended next step: generate a request id in the `route()` wrapper, return it as a response header, and include it in every log line and in `ai_usage`/`retrieval_log`.

## 4. Incident-response runbook

### 4.1 Triage (first 15 minutes)

1. **Confirm:** check `/api/health/ready` and the host's error rate, then run the §2 queries for the suspected area (AI, email, auth, database).
2. **Classify:** SEV1 = outage, data exposure or security incident. SEV2 = a major feature broken (chat, sign-in, uploads). SEV3 = degraded.
3. **Assign roles:** one incident lead and one note-taker. Keep a timestamped log.
4. **For a suspected data exposure or security incident:** preserve logs and `audit_log` before changing anything, then go to §4.2. Personal-data breaches may carry notification obligations (PRIVACY_AND_DATA_INVENTORY.md §7; counsel).

### 4.2 Kill switches (`feature_flags`)

Change flags with `PATCH /api/v1/admin/flags {key, enabled}` (platform admin). If the admin UI is unavailable, use SQL:
`BEGIN; SELECT set_config('app.role','system',true); UPDATE feature_flags SET enabled=false, updated_at=now() WHERE key='ai.llm'; COMMIT;`

Flags are cached for **15 s per server instance**. `setFlag` only clears the cache of the instance that handled the request, so allow up to 15 s for every instance to pick up the change.

| Key | Effect when off |
|---|---|
| `ai.assistant` | `POST /api/v1/chat` returns 503 `assistant_disabled` (all chat stops) |
| `ai.llm` | chat uses the deterministic `basic` engine; no LLM calls from chat, tools or analysis |
| `ai.analysis` | skill extraction uses the rules engine only (`/experiences/:id/analyze`, `analyze_skills`, `analyze_cv`) |
| `rag.search` | `GET /api/v1/search` returns 503 `search_disabled`; `search_knowledge` returns no passages |
| `signup.open` | `POST /api/v1/auth/signup` returns 403 `signup_closed` |
| `uploads.cv` | `POST /api/v1/files` returns 403 `uploads_disabled` |

Other levers:
- **Stop AI spend for chat:** set `AI_DAILY_BUDGET_USD=0` or unset `ANTHROPIC_API_KEY`, then redeploy. Removing the key also stops extraction.
- **Revoke sessions:** `DELETE FROM sessions` (everyone) or `WHERE user_id = …`, as system.
- **Revoke an admin:** `npm run admin:grant -- <email> --revoke`.
- **Rotate secrets:** `CRON_SECRET` (≥ 24 chars) and the provider API keys.

### 4.3 Rollback

- **Application:** redeploy the previous image or build (Next.js standalone, `Dockerfile`).
- **Database:** migrations are forward-only (`scripts/migrate.ts` has no down step), so roll back schema problems with a new corrective migration. Restoring from backup is the last resort, and the repository defines **no backup procedure** (PRIVACY_AND_DATA_INVENTORY.md §6). After any restore, re-apply account deletions recorded in `audit_log` (`action='account.deleted'`).
- **Content:** re-run `npm run kb:ingest` for the knowledge base and `npm run db:seed` for the catalogue (both idempotent).

### 4.4 Communication

- **Users:** state the impact and workaround on the status channel. There is no in-app broadcast API; the `announcement` notification kind is only written by verification reviews. For security incidents that affect accounts, email users through the outbox or provider. The `security` notification kind exists for password events.
- **Institutions and partners:** notify affected institution admins directly.
- **Internal:** post updates every 30 min while SEV1/SEV2 is open.

### 4.5 Post-mortem (within 5 working days, blameless)

Timeline (detection → mitigation → resolution) · impact (users, data, duration) · root cause · what worked / what did not (alerts, runbook, kill switches) · action items with owners and dates · whether personal data was involved and which notifications were made.
