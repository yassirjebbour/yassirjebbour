# BAWSALA HTTP API

Source of truth: the `route.ts` files under `src/app/api/`. Helpers live in `src/server/http/*` and `src/server/ratelimit.ts`. Paths below are relative to **`/api/v1`** unless they start with `/api/`.

## 1. Conventions

### 1.1 Transport, auth, CSRF

| Topic | Behaviour |
|---|---|
| Format | JSON in and out. JSON responses carry `Cache-Control: no-store` unless a route overrides it. Exceptions: `POST /chat` (SSE), `GET /me/export` and `GET /files/:id` (downloads), `/unsubscribe` (text/plain), `POST /files` (multipart request). |
| Session | Cookie **`bawsala_session`**: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` in production. The value is a random 32-byte base64url token; the server stores only its SHA-256. Lifetime is 30 days. When fewer than 15 days remain, any authenticated API call extends it to 30 days and re-sets the cookie. |
| Locale cookie | `bawsala_locale` (not HttpOnly, `SameSite=Lax`, 1 year). Set by sign-up, sign-in, `PATCH /me` and `POST /locale`. |
| Roles | `student`, `institution_admin`, `platform_admin`. **Auth** column values: `public` = no session needed; `optional` = the session is used if present; `user` = any signed-in role; a role name = only that role. |
| Auth errors | No or invalid session → `401 unauthorized` "Sign in required". Wrong role → `403 forbidden` "Not allowed". |
| CSRF | For every method except GET/HEAD/OPTIONS, the `route()` wrapper requires an `Origin` header. Its host must equal `X-Forwarded-Host` (or `Host`). Otherwise the response is `403 forbidden` ("Missing origin", "Bad origin", "Cross-origin request rejected"). This runs **before** auth. Routes not wrapped by `route()`: `/cron/daily`, `/unsubscribe`, `/api/health`, `/api/health/ready`. |
| Client IP | First `X-Forwarded-For` entry, else `X-Real-IP`, else `"local"`. Used for per-IP rate limits. |

### 1.2 Request bodies & validation

| Case | Result |
|---|---|
| `Content-Length` > 256 KiB (JSON bodies) | `400 bad_request` "Body too large" |
| Body is not valid JSON | `400 bad_request` "Invalid JSON" |
| Body fails its zod schema | `422 validation` "Invalid input", `details: [{path, message}]` |
| Malformed path parameter (uuid / skill id / slug) | `422 validation` with `details` (a thrown `ZodError`) |
| Strings | Fields marked *trimmed* are trimmed before length checks. Emails are trimmed, lower-cased, ≤ 254 chars. |

Shared types: `Locale` = `"ar" | "ary" | "fr" | "en" | "zgh"`. `Password` = string of 10–200 chars. `Url` = trimmed, valid URL, ≤ 2000 chars, `http(s)` only. `Localized` = `{en?, fr?, ar?, ary?, zgh?}`, each ≤ 4000 chars, with at least one non-blank. `SkillId` = `/^[a-z0-9_]{2,40}$/`.

### 1.3 Error envelope

```json
{ "error": { "code": "validation", "message": "Invalid input", "details": [{ "path": "email", "message": "Invalid email" }] } }
```

`details` is present only for schema failures. For most domain errors, `message` is a stable machine code such as `email_taken`. Unexpected errors are logged and return `500 {"error":{"code":"internal","message":"Something went wrong","ref":"<8 chars>"}}`. The `ref` value appears in the server log.

| `code` | HTTP | Notes |
|---|---|---|
| `bad_request` | 400 | |
| `unauthorized` | 401 | |
| `forbidden` | 403 | |
| `not_found` | 404 | |
| `conflict` | 409 | |
| `validation` | 422 | |
| `rate_limited` | 429 | sends a **`Retry-After`** header (seconds until the window ends) |
| `ai_quota` | 429 | daily AI message quota; no `Retry-After` |
| `internal` | 500 | |
| `ai_unavailable` | 503 | feature switched off by a flag |

Machine codes returned in `message`: `invalid_credentials`, `email_taken`, `join_code_invalid`, `signup_closed`, `reset_invalid`, `wrong_password`, `unknown_skill`, `evidence_empty`, `no_institution`, `plan_empty`, `assistant_disabled`, `daily_limit`, `conversation_required`, `nothing_to_regenerate`, `action_expired_or_done`, `unsupported_action`, `uploads_disabled`, `file_size`, `file_type`, `file_missing`, `search_disabled`, `query_length`, `cannot_change_own_role`, `institution_required`.

### 1.4 Rate limits

These are fixed windows stored in Postgres (`rate_limits`), so they hold across instances. Every attempt increments the counter, including attempts that are then rejected. Exceeding a limit returns `429 rate_limited` with `Retry-After`.

| Endpoint | Key | Limit |
|---|---|---|
| `POST /auth/signup` | IP | 5 / hour (checked before the body) |
| `POST /auth/signin` | IP + email | 20 / 15 min per IP **and** 8 / 15 min per email (checked after the body) |
| `POST /auth/forgot` | IP + email | 5 / hour per IP (before the body), 3 / hour per email |
| `POST /auth/reset` | IP | 10 / hour |
| `GET /me/export` | user | 10 / hour |
| `POST /me/password` | user | 5 / hour |
| `POST /me/institution` | user | 10 / hour |
| `POST /experiences` | user | 60 / hour |
| `POST /experiences/:id/analyze` | user | 30 / hour |
| `POST /chat` | user | 12 / minute, **plus** the daily quota (§2.9) |
| `POST /files` | user | 20 / hour |
| `GET /search` | IP | 60 / 10 min |
| `POST /try` | IP | 30 / 10 min |
| `POST /feedback` | IP | 10 / hour |
| `POST /events` | IP | 120 / minute |

No other route has a rate limit.

### 1.5 Pagination & list caps

Only `GET /opportunities` paginates (`?page=`, fixed `pageSize` 20, returns `total`). Other lists are capped: conversations 100, notifications 50, verification queue 100, admin users 100, admin audit 200, admin feedback 200.

## 2. Endpoints

### 2.1 Auth

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `POST /auth/signup` | public | `name` string 1–120 *trimmed*; `email`; `password` Password; `locale` Locale; `joinCode?` string ≤ 20 \| null; `consent` must be `true`; `website?` must be empty (honeypot) | **201** `{ok, redirect:"/app/onboarding"}`. Sets session + locale cookies, creates the profile, and assigns `platform_admin` if the email is in `ADMIN_EMAILS`. | 403 `signup_closed` (flag `signup.open`), 409 `email_taken`, 422 `join_code_invalid` |
| `POST /auth/signin` | public | `email`; `password` string 1–200 | `{ok, redirect}`: `/admin`, `/institution` or `/app` depending on role. Sets cookies. | 401 `invalid_credentials` (unknown emails are checked against a dummy hash, so timing is the same) |
| `POST /auth/signout` | public | – | `{ok, redirect:"/"}`. Deletes the session row and cookie. | |
| `POST /auth/signout-all` | user | – | `{ok}`. Deletes every **other** session of the user. | |
| `POST /auth/forgot` | public | `email` | Always `{ok:true}`. If the account exists, creates a reset token (valid 1 h) and queues the `reset` email with `${APP_URL}/reset?token=…`. | |
| `POST /auth/reset` | public | `token` string 20–200; `password` Password | `{ok, redirect:"/signin"}`. Single-use token. **Signs out all devices**, sends a `security` notification and a `password_changed` email. | 422 `reset_invalid` (unknown, used or expired) |

### 2.2 Account (`/me`) & locale

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /me` | user | – | `{user:{id,email,name,locale,role,institutionId}, ai:{messagesToday, dailyLimit}}` | |
| `PATCH /me` | user | `name?` 1–120 *trimmed*; `locale?` Locale | `{ok}` (a locale change also sets the cookie) | |
| `DELETE /me` | user | `password` 1–200 | `{ok, redirect:"/?deleted=1"}`. **Permanent**: cascades all student data (see DATABASE_SCHEMA.md §6) and clears the cookie. | 422 `wrong_password` |
| `GET /me/export` | user | – | JSON file download (`Content-Disposition: attachment; filename="bawsala-export-YYYY-MM-DD.json"`) containing `{exported_at, format:"bawsala-export/1", user, profile, experiences, skills, evidence, suggestions, saved_opportunities, plans, plan_tasks, conversations, messages}`. Writes an audit entry. | 429 |
| `POST /me/password` | user | `current` 1–200; `next` Password | `{ok}`. Sends a `security` notification and a `password_changed` email. Other sessions stay signed in. | 422 `wrong_password` |
| `POST /me/institution` | student | `joinCode` 4–20 *trimmed* (matched upper-case) | `{ok, institution:{id,name}}` | 422 `join_code_invalid` |
| `DELETE /me/institution` | student | – | `{ok}`. Clears `institution_id` and sets `share_with_institution=false`. | |
| `GET /me/notification-prefs` | user | – | `{in_app, email_reminders, email_security}` (row created on first read) | |
| `PATCH /me/notification-prefs` | user | `in_app?`, `email_reminders?`, `email_security?`: boolean | `{ok}` | |
| `POST /locale` | optional | `locale` Locale | `{ok}`. Sets `bawsala_locale`; when signed in, also updates `users.locale`. | |

### 2.3 Profile

| Endpoint | Auth | Request | Response |
|---|---|---|---|
| `GET /profile` | user | – | the full `profiles` row: `{user_id, situation, field_of_study, education_level, school, graduation_year, city, languages, goal, target_opportunity_id, share_with_institution, onboarded_at, updated_at}` |
| `PATCH /profile` | user | all optional (below) | `{ok}`. `onboarded:true` sets `onboarded_at` once. |

| Field | Type / limits |
|---|---|
| `situation` | `student` \| `graduate` \| `job_seeker` \| `employed` \| `other` \| null |
| `field_of_study` | string ≤ 160 *trimmed* \| null |
| `education_level` | `bac` \| `bac2` \| `licence` \| `master` \| `doctorate` \| `vocational` \| `other` \| null |
| `school` | string ≤ 200 \| null |
| `graduation_year` | int 1970–2100 \| null |
| `city` | string ≤ 120 \| null |
| `languages` | string[] (each 2–10 chars), ≤ 8 items |
| `goal` | string ≤ 600 \| null |
| `share_with_institution` | boolean |
| `onboarded` | boolean |

### 2.4 Experiences

`Experience` = `{id, kind, title, organization, description, started_on, ended_on, analyzed_at, created_at}`. Dates are returned as `YYYY-MM-DD` or null.

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /experiences` | user | – | `Experience[]`, newest first | |
| `POST /experiences` | user | ExperienceBody | **201** `Experience` | 429 |
| `PATCH /experiences/:id` | user | ExperienceBody (full replacement: all required fields again) | `Experience`. Resets `analyzed_at`. | 404 |
| `DELETE /experiences/:id` | user | – | `{ok}`. Also deletes that experience's suggestions. | 404 |
| `POST /experiences/:id/analyze` | user | – | `{engine:"ai+rules"\|"rules", created, candidates:[{skillId, quote, reason, source}], discarded}`. Stores new `pending` suggestions, skipping skills already in the passport, and sends a `skill_suggestions` notification when `created > 0`. The LLM runs only if flags `ai.llm` and `ai.analysis` are on and a provider is configured. LLM quotes not found in the text are discarded and counted in `discarded`. | 404, 429 |

**ExperienceBody**

| Field | Type / limits |
|---|---|
| `kind` | `job` \| `internship` \| `volunteer` \| `project` \| `family` \| `club` \| `education` \| `course` \| `other` |
| `title` | string 1–200 *trimmed* |
| `organization?` | string ≤ 200 \| null (empty → null) |
| `description` | string 10–4000 *trimmed* |
| `started_on?`, `ended_on?` | `YYYY-MM` or `YYYY-MM-DD` \| null (`YYYY-MM` is stored as day 01) |

### 2.5 Passport, suggestions, skills

For the skill states and how they change, see DATABASE_SCHEMA.md §3.

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /passport` | user | – | `{skills:[{id, skill_id, status, level, source, created_at, evidence:[{id,kind,text,url,experience_id,created_at}]}], suggestions:[{id, skill_id, experience_id, quote, reason, source, created_at}]}`. Skills are ordered verified → evidenced → inferred → declared. Suggestions are pending ones for skills not yet owned. | |
| `POST /suggestions/:id/accept` | user | – | `{ok, skillId}`. The skill becomes `inferred` and the quote is stored as evidence. | 404 (not pending) |
| `POST /suggestions/:id/reject` | user | – | `{ok}` | 404 |
| `GET /skills/catalog` | public | – | `[{id, category, names, learn_url, learn_title, learn_hours}]` with `Cache-Control: public, max-age=300` | |
| `POST /skills` | user | `skillId` SkillId | **201** `{ok}`. Adds the skill as `declared`; an existing skill keeps its higher status. | 422 `unknown_skill` |
| `DELETE /skills/:skillId` | user | – | `{ok}`. Removes the skill with its evidence and verification requests. | 404 |
| `POST /skills/:skillId/evidence` | user | `url?` Url \| null; `text?` ≤ 2000 *trimmed* \| null; `kind?` `project` \| `link` \| `certificate` (default `project`). Requires `url` or `text` of ≥ 5 chars. | **201** `{ok}`. The skill becomes `evidenced` (and is created if missing). | 422 `unknown_skill` / validation |
| `POST /skills/:skillId/verify-request` | student | `note?` ≤ 1000 *trimmed* | **201** `{ok}`. Upserts a request for the student's institution (re-requesting resets it to `pending`) and sets `share_with_institution=true`. | 422 `no_institution`, 404 (skill not in passport) |

### 2.6 Opportunities

`Opportunity` = `{id, slug, title, organization, city, remote, kind, description, project_brief, apply_url, source_name, source_url, is_sample, status, source_updated_at, expires_at, verification_status, last_verified_at, deadline, published_at, eligibility, requirements:[{skillId, required}]}`. `title`, `description`, `project_brief` and `eligibility` are Localized.

`Fit` = `{requiredTotal, requiredHave, niceTotal, niceHave, have[], missingRequired[], missingNice[], score}`. `score` is 0–100: required skills weigh 80 % and nice-to-have 20 %. Each owned skill earns credit by status: declared 0.6, inferred 0.8, evidenced or verified 1.

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /opportunities` | user | query `city?` (≤ 80; exact match, remote roles always included), `kind?` (≤ 20), `page?` (≥ 1) | `{total, page, pageSize:20, items:[Opportunity & {fit, saved}]}`. Only published, unexpired rows whose deadline has not passed. Sorted by score, then fewest missing required skills, then id. | |
| `GET /opportunities/:id` | user | – | `Opportunity & {fit}`. Not filtered by status. | 404 |
| `POST /opportunities/:id/save` | user | – | `{ok}`. Upserts with status `saved`. | 404 |
| `DELETE /opportunities/:id/save` | user | – | `{ok}` (idempotent) | |
| `POST /opportunities/:id/target` | user | – | `{ok}`. Sets `profiles.target_opportunity_id`. | 404 |

### 2.7 Plan, tasks, progress

`Plan` = `{id, opportunity_id, title, status, starts_on, ends_on, created_at, tasks:[{id, position, kind, title, detail, skill_id, resource_url, estimated_minutes, due_on, completed_at, proof_url, proof_note}]}`.

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /plan` | user | – | the active `Plan`, or `null` | |
| `POST /plan` | user | `opportunityId` uuid; `days?` int 7–90 (default 30) | **201** `{ok, id}`. Builds the deterministic plan: up to 4 missing skills, each with learn → practice → prove, then a project and an apply step (at most 40 tasks). Archives the previous active plan, sets the profile target and sends a `plan_ready` notification. | 404, 422 `plan_empty` |
| `DELETE /plan` | user | – | `{ok}`. Archives the active plan. | |
| `POST /plan/tasks/:id/complete` | user | `url?` Url \| null; `note?` ≤ 2000 *trimmed* \| null | `{ok, evidenced}`. For a `prove` or `project` task with a `skill_id` and a url or note, the proof becomes skill evidence (`evidenced:true`). The plan is marked `completed` once no task is open. | 404 |
| `POST /plan/tasks/:id/reopen` | user | – | `{ok}`. Clears `completed_at`; a `completed` plan returns to `active`. | 404 |
| `GET /progress` | user | – | `{plan:{id,title,starts_on,ends_on,total,done,overdue,due_today}\|null, streakDays, activeDays, skills:{total, evidenced}, next:{id,title,due_on,kind}\|null}`. `activeDays` counts distinct days with a completed task (last 60). `streakDays` counts consecutive UTC days ending today or yesterday. | |

### 2.8 Assistant: conversations, messages, actions

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /conversations` | user | query `q?` (≤ 100; ILIKE on title or any message content) | up to 100 `{id,title,created_at,updated_at}`, most recently updated first | |
| `POST /conversations` | user | `title?` ≤ 160 *trimmed* (default `""`) | **201** `{id,title,created_at,updated_at}` | |
| `GET /conversations/:id` | user | – | `{conversation, messages:[{id, role, content, tool_calls, status, feedback, engine, created_at}]}` (citations are not included) | 404 |
| `PATCH /conversations/:id` | user | `title` 1–160 *trimmed* | `{ok}` | 404 |
| `DELETE /conversations/:id` | user | – | `{ok}`. Deletes its messages and pending actions. | 404 |
| `POST /messages/:id/feedback` | user | `value`: `1` \| `-1` \| `null` | `{ok}` | 404 (not your assistant message) |
| `POST /actions/:id` | user | `decision`: `confirm` \| `cancel` | cancel → `{ok, status:"cancelled"}`. Confirming a `create_plan` action → `{ok, status:"confirmed", planId}`: saves the plan from the server-side payload (same effects as `POST /plan`). | 404 `action_expired_or_done` (not pending or older than 7 days), 400 `unsupported_action` (other kinds) |

### 2.9 Chat (SSE): `POST /chat`

**Auth:** user. `maxDuration` is 120 s. The checks run in this order and fail with a normal JSON error (not SSE):

1. Session → 401.
2. Flag `ai.assistant` → `503 ai_unavailable` `assistant_disabled`.
3. 12 requests / minute per user → `429 rate_limited` + `Retry-After`.
4. **Daily quota:** the number of the user's `role='user'` messages in the **last 24 h (rolling)** must be below `AI_DAILY_MESSAGES_PER_USER` (default **60**), otherwise `429 ai_quota` `daily_limit`. `GET /me` reports `ai.messagesToday` and `ai.dailyLimit`.
5. Body validation → 422.

**Body**

| Field | Type / limits |
|---|---|
| `conversationId?` | uuid \| null |
| `message?` | string ≤ 12 000 *trimmed*; required and non-empty unless `regenerate` |
| `regenerate?` | boolean |

- **New message:** if `conversationId` is given, it must be yours (404). Without it, a conversation is created and titled with the first 60 chars of the message. The user message is saved before generation starts.
- **Regenerate** (`regenerate:true`): requires `conversationId` (400 `conversation_required`). If the last message is an assistant message, it is deleted, and the latest user message is answered again (400 `nothing_to_regenerate` if there is none). No user message is added, so regenerating does not count against the daily quota, but it does count against the per-minute limit.
- **Stop:** the client closes the connection (aborts the fetch). Generation is cancelled and the partial answer is saved with `status:"stopped"`. Follow-ups are not produced.

**Response:** `200`, `content-type: text/event-stream; charset=utf-8`, `cache-control: no-store, no-transform`, `x-accel-buffering: no`. Each event is one line `data: <JSON>` followed by a blank line. There are no `event:` or `id:` fields; the JSON `type` field identifies the event.

| `type` | Fields | When |
|---|---|---|
| `meta` | `conversationId`, `engine`: `"llm"` \| `"basic"` | always first |
| `text` | `delta` string | streamed answer text (the basic engine sends one event with the whole text) |
| `tool_start` | `id`, `name` | a tool call begins |
| `tool_end` | `id`, `name`, `ok`, `output`, `ms` | `output` is the tool result, or `{code,message}` when `ok:false`; replaced by `{truncated:true,name}` if its JSON exceeds 20 000 chars |
| `citations` | `citations:[{n, title, source, url, status, verified_at}]` | only sources the answer used: `[n]` markers in LLM text, or passages n ≤ 3 for the basic engine |
| `followups` | `items` string[] (≤ 3, localized) | only when the turn completed |
| `error` | `code` | LLM failure (`rate_limited`, `unavailable`, `auth`, `bad_request`, `timeout`, `unknown`) or `internal` |
| `done` | `message:{id, role:"assistant", content, tool_calls, status, feedback, engine, created_at}` | after the assistant message is saved (`status`: `complete` \| `stopped` \| `error`) |

Event order: `meta` → (`text` \| `tool_start`/`tool_end`)\* → [`error`] → [`citations`] → [`followups`] → `done`. If an error escapes the generator (for example, saving fails), the route sends `{type:"error",code:"internal"}` and closes without `done`. A model refusal is saved with `status:"error"` and sends no `error` event.

**Engine:** `llm` when flag `ai.llm` is on for the user and `ANTHROPIC_API_KEY` is set (with `AI_PROVIDER` unset or `anthropic`); otherwise `basic`, a deterministic intent router over the same tools. An LLM failure does not switch to `basic`; it emits `error`. A turn allows at most 5 model rounds and 8 tool calls, and the last 16 messages are sent as history.

**Tools** (the `name` in `tool_*` events). The user id always comes from the session.

| Permission | Tools |
|---|---|
| read | `analyze_cv`, `discover_careers`, `match_opportunities`, `analyze_skill_gap`, `find_learning_resources`, `interview_simulation`, `analyze_progress`, `compare_options`, `improve_profile`, `search_knowledge`, `get_my_plan` |
| suggest | `analyze_skills` (writes pending skill suggestions only) |
| reversible | `save_opportunity` (status `saved`), `application_assistant` (sets saved status `preparing`) |
| confirm | `create_learning_roadmap`: output includes `pending_action_id` and `requires_confirmation:true`. Nothing changes until the user calls `POST /actions/:id`. |

### 2.10 Files

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /files` | user | – | `[{id, purpose, filename, mime, bytes, created_at, extract_error}]` | |
| `POST /files` | user | `multipart/form-data`: `file` (required), `purpose` (`"evidence"`; any other value means `"cv"`) | **201** `{id, filename, mime, bytes, created_at, extract_error: null\|"empty_text"\|"parse_failed", chars}`. Max 5 MiB. The type is decided by magic bytes: PDF, DOCX or UTF-8 text. Text is extracted (≤ 60 000 chars, 15 s timeout). | 403 `uploads_disabled` (flag `uploads.cv`), 422 `file_size` (empty, > 5 MiB, or `Content-Length` > 5 MiB + 64 KiB), 422 `file_type`, 422 `file_missing`, 429 |
| `GET /files/:id` | user | – | raw bytes with `content-type: <mime>`, `content-disposition: attachment`, `x-content-type-options: nosniff`, `content-security-policy: default-src 'none'; sandbox`, `cache-control: private, no-store` | 404 |
| `DELETE /files/:id` | user | – | `{ok}` | 404 |

### 2.11 Public: search, try, feedback, events

| Endpoint | Auth | Request | Response | Errors |
|---|---|---|---|---|
| `GET /search` | public | query `q` (trimmed, 2–300); `kinds?` comma list, filtered to `skill,occupation,pathway,resource,labor_market,institution,program,guide,policy` | `{mode:"hybrid"\|"keyword", latencyMs, results:[{text, heading, score, doc:{slug,title,kind,language,sourceName,sourceUrl,verificationStatus,verifiedAt,publishedAt,version}}]}`, top 8, active documents only. The query is logged as a hash. | 429, 503 `search_disabled` (flag `rag.search`), 422 `query_length` |
| `POST /try` | public | `text` 3–1500 *trimmed* | `{found:[{skillId, quote}]}`. Rules engine only; nothing stored except an analytics event. | 429 |
| `POST /feedback` | optional | `kind`: `bug`\|`idea`\|`question`\|`privacy_request`\|`other`; `message` 3–4000 *trimmed*; `page?` ≤ 200 | **201** `{ok}`. Attached to the user when signed in. | 429 |
| `POST /events` | optional | `name`: `page.viewed`\|`opportunity.apply_clicked`\|`client.error`; `props?` record of string\|number\|boolean | **202** `{ok}`. Props are sanitised: first 12 keys, keys must match `^[a-z_]{1,30}$`, strings cut to 80 chars. `client.error` is also written to the server log. | 429 |

### 2.12 Notifications

| Endpoint | Auth | Request | Response |
|---|---|---|---|
| `GET /notifications` | user | – | `{items:[{id, kind, data, read_at, created_at}] (newest 50), unread}`. `kind` is one of `task_due`, `plan_ready`, `skill_suggestions`, `security`, `announcement`, `opportunity`. |
| `POST /notifications/read` | user | `ids?` uuid[] ≤ 100 (omitted or empty marks all as read) | `{ok}` |

### 2.13 Institution (role `institution_admin`)

All three endpoints use the institution from the session and return `403 no_institution` when the admin has none. Only students of that institution with `share_with_institution=true` are included.

| Endpoint | Request | Response | Errors |
|---|---|---|---|
| `GET /institution/stats` | – | `{institution:{id,name,join_code,city}, sharing, minGroup:5, stats}`. `stats` is `null` when fewer than 5 students share; otherwise `{skills:[{skill_id, students, evidenced}] (top 12, only skills held by ≥ 5), totals:{skills, evidenced}, withPlan, tasksDone30}`. | |
| `GET /institution/verifications` | – | pending requests (≤ 100, oldest first): `[{id, student (name), skill_id, note, created_at, evidence:[{text,url}]}]` | |
| `POST /institution/verifications/:id` | `decision`: `approved`\|`rejected`; `note?` ≤ 1000 *trimmed* | `{ok}`. Approval sets the skill to `verified`. Writes an audit entry and sends the student an `announcement` notification. | 404 (not pending, or another institution's request) |

### 2.14 Admin (role `platform_admin`)

| Endpoint | Request | Response | Errors |
|---|---|---|---|
| `GET /admin/overview` | – | `{funnel:{signup,onboarded,skill,target,plan,task} (sign-ups in the last 30 d), wau, northStar (users completing prove/project tasks in 7 d), users:{total,students}, ai:[{feature,engine,calls,errors,cost,p50,tokens_in,tokens_out}] (30 d), tools:[{tool,runs,failures}], retrieval:{n,p50,empty}, feedback:{up,down}, outbox:[{status,n}]}` | |
| `GET /admin/users` | query `q?` ≤ 100 (`%`, `_`, `\` removed; ILIKE on email or name) | ≤ 100 `{id,name,email,role,locale,institution_id,institution,created_at,last_active_at}` | |
| `PATCH /admin/users/:id` | `role?` Role; `institutionId?` uuid \| null | `{ok}`. **Revokes all of that user's sessions.** Writes an audit entry. | 403 `cannot_change_own_role`, 422 `institution_required` (institution_admin without an institution), 404 |
| `GET /admin/institutions` | – | `[{id,name,city,join_code,created_at,members}]` | |
| `POST /admin/institutions` | `name` 2–200 *trimmed*; `city?` ≤ 120 \| null | **201** `{id,name,join_code}` | |
| `GET /admin/opportunities` | – | every `Opportunity`, including draft, archived and expired | |
| `POST /admin/opportunities` | OpportunityBody | **201** `{id}`. Always `is_sample=false`. | |
| `PATCH /admin/opportunities/:id` | OpportunityBody (full replacement; requirements are replaced) | `{ok}`. `last_verified_at` is set when saved as `verified`. | 404 |
| `GET /admin/flags` | – | `[{key,enabled,rollout,roles,description}]` (per-process cache of 15 s) | |
| `PATCH /admin/flags` | `key` `^[a-z0-9_.]{2,60}$`; `enabled?` bool; `rollout?` int 0–100; `roles?` Role[] | `{ok}`, also for an unknown key (no row updated). Writes an audit entry. | |
| `GET /admin/feedback` | – | ≤ 200 `{id,kind,message,page,status,created_at,email}` | |
| `PATCH /admin/feedback` | `id` uuid; `status` `open`\|`in_progress`\|`closed` | `{ok}` | |
| `GET /admin/audit` | – | the last 200 `{id,action,target,meta,created_at,actor (email)}` | |
| `GET /admin/knowledge` | – | `[{slug,title,kind,language,verification_status,verified_at,version,status,updated_at,source_name,source_url,chunks}]` | |
| `POST /admin/knowledge` | KbBody | **201** `{id, changed, chunks}` (`changed:false, chunks:0` when the content hash is unchanged). Sanitises, chunks and embeds (when an embedder is configured). | |
| `DELETE /admin/knowledge/:slug` | query `hard=1` for a hard delete | `{ok}`. Archives by default; `hard=1` deletes the document and its chunks. | |

**OpportunityBody**

| Field | Type / limits |
|---|---|
| `title`, `description` | Localized |
| `project_brief`, `eligibility` | Localized \| null (default null) |
| `organization` | string 2–200 *trimmed* |
| `city` | string ≤ 120 \| null (default null) |
| `remote` | boolean (default false) |
| `kind` | `job` \| `internship` \| `training` \| `volunteer` \| `program` |
| `apply_url` | Url \| null (default null) |
| `source_name` | string 2–200 *trimmed* |
| `source_url` | Url (**required**) |
| `verification_status` | `verified` \| `unverified` |
| `status` | `draft` \| `published` \| `archived` (default `draft`) |
| `deadline`, `published_at` | `YYYY-MM-DD` \| null |
| `expires_at` | ISO datetime \| null |
| `requirements` | ≤ 15 × `{skillId: SkillId, required: boolean}` |

**KbBody**

| Field | Type / limits |
|---|---|
| `slug` | `^[a-z0-9][a-z0-9-]{1,120}$` |
| `title` | string 2–300 *trimmed* |
| `kind` | `skill` \| `occupation` \| `pathway` \| `resource` \| `labor_market` \| `institution` \| `program` \| `guide` \| `policy` |
| `language` | `ar` \| `ary` \| `fr` \| `en` \| `zgh` \| `multi` |
| `geography` | string ≤ 10 (default `MA`) |
| `source_name` | string 2–300 *trimmed* |
| `source_url?` | http(s) URL \| null |
| `license?` | string ≤ 200 \| null |
| `published_at?`, `verified_at?` | `YYYY-MM-DD` \| null; `verified_at` is required when `verification_status = verified` |
| `verification_status` | `verified` \| `unverified` \| `editorial` |
| `confidence` | `high` \| `medium` \| `low` (default `medium`) |
| `body` | string 20–200 000. The 256 KiB request cap (§1.2) still applies, so a long non-ASCII body can be rejected before this limit. |

### 2.15 Cron, unsubscribe, health

| Endpoint | Auth | Behaviour | Response |
|---|---|---|---|
| `POST /cron/daily` | **`Authorization: Bearer <CRON_SECRET>`** (constant-time compare; also rejected when `CRON_SECRET` is unset). No Origin check, no session. | Creates `task_due` notifications for open tasks due today in active plans (dedupe `due:<taskId>`). Queues `reminder` emails for users with `email_reminders`. Delivers up to 100 queued emails (retry up to 5 times with backoff 2^n min). Prunes rate-limit rows and expired sessions. | `{ok, due, outbox:{sent, failed, skipped}}`. Bad or missing secret → `401 {"error":{"code":"unauthorized"}}`. |
| `GET` or `POST /unsubscribe?token=` | public (token from the email footer) | `token` must be 36 lowercase hex chars. Sets `email_reminders=false` for the matching prefs row. | `text/plain`. 400 "Invalid link" for a malformed token; otherwise 200 with a trilingual confirmation (also when no row matches). |
| `GET /api/health` | public | liveness | `{status:"ok", time}` (`no-store`) |
| `GET /api/health/ready` | public | readiness: database query on `skills` + `schema_migrations` | 200 `{status:"ready", checks:{database:{ok:true, ms, skills, migration}, llm:{configured}, embeddings:{configured, model}, version}}`; 503 `{status:"unavailable", checks:{database:{ok:false, error}, …}}` (error text truncated to 120 chars) |
