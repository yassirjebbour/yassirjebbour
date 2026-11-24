# Privacy & data inventory

> **This is not legal advice.** It describes what the software does, based on `db/migrations/*.sql`, `src/server/repo/*`, `src/server/ai/*` and the API routes. Compliance with Moroccan Law 09-08 (or any other law) **has not been reviewed by counsel**. The "legal basis" column is an engineering proposal for counsel to confirm.

Related: DATABASE_SCHEMA.md (columns, RLS, cascades) and API_DOCUMENTATION.md (endpoints).

## 1. Parties

| Role | Who | When |
|---|---|---|
| Controller | BAWSALA (pilot) | always |
| Hosting + database provider | not fixed in the repository (the Dockerfile runs anywhere) | always; holds all data and any backups |
| LLM provider | Anthropic | only when `ANTHROPIC_API_KEY` is set **and** flag `ai.llm` is on for the user (§3) |
| Email provider | Resend | only when `RESEND_API_KEY` is set; otherwise emails are not sent (rows are marked `skipped`) |
| Embeddings provider | Voyage AI | only when `EMBEDDINGS_PROVIDER=voyage` and `VOYAGE_API_KEY` are set. The default `local` embedder runs in-process, so no text leaves the server. |
| Institutions | schools a student joins with a join code | see access column (aggregates and verification requests only) |

## 2. Inventory

Access legend: **S** = the student (own rows, enforced by RLS). **IA** = institution admin of the student's institution. **PA** = platform admin through the admin API. **Ops** = anyone with database credentials or `asSystem` code (can read everything). **LLM** = sent to the LLM provider when AI is enabled.

| # | Category | Where (table.column) | Purpose | Legal basis (to confirm) | Access | Retention as implemented |
|---|---|---|---|---|---|---|
| 1 | Account identity | `users.email`, `name`, `locale`, `role`, `institution_id`, `created_at`, `last_active_at` | account, sign-in, emails | contract | S; PA (admin user list: name, email, role, locale, institution, dates); IA sees the **name** only through verification requests; LLM gets the **first name only** (first word of `name`) | until account deletion |
| 2 | Credentials & sessions | `users.password_hash` (scrypt); `sessions` (SHA-256 of token, `user_agent`, `ip`, timestamps); `auth_tokens` (hash, purpose, expiry, used_at) | authentication, security | contract | Ops only (RLS `system_only` / self) | sessions: deleted on sign-out, password change/reset, role change, expiry (pruned daily) and a 90-day cap. **auth_tokens: used and expired rows are never pruned**; deleted with the account. |
| 3 | Profile | `profiles.situation`, `field_of_study`, `education_level`, `school`, `graduation_year`, `city`, `languages`, `goal`, `target_opportunity_id`, `share_with_institution`, `onboarded_at` | personalisation, matching | contract | S; LLM (situation, field_of_study, education_level, city, languages, goal ≤ 300 chars, target title); IA: aggregates only | until account deletion |
| 4 | Experiences (free text) | `experiences.kind`, `title`, `organization`, `description`, dates | skill detection | contract (consent if counsel prefers) | S; LLM (title + description ≤ 4000 chars for skill extraction; count in context; quotes in tool results) | until deleted by the student or account deletion |
| 5 | Skills passport | `user_skills`, `skill_evidence.text`/`url` (including quotes from experiences), `skill_suggestions.quote`/`reason` | skills record, matching | contract | S; IA: evidence text/URLs of skills the student sent for verification; aggregated counts for groups of ≥ 5 sharing students; LLM (skill names, status, evidence count; evidence text/URLs via `application_assistant`) | until removed or account deletion |
| 6 | Verification requests | `verification_requests.note`, `status`, `review_note`, `reviewer_id` | third-party confirmation of a skill | consent (the student starts it) | S; IA of that institution while the student is a member and sharing | until account deletion (rejected automatically when the student leaves the institution) |
| 7 | Goals & plans | `saved_opportunities`, `plans`, `plan_tasks.title`/`proof_url`/`proof_note` | 30-day path | contract | S; LLM (plan title, progress, next task; task list via `get_my_plan`); IA: counts only | archived plans are kept; until account deletion |
| 8 | Assistant conversations | `conversations.title`; `messages.content` (free text: anything the student types), `tool_calls`, `citations`, `feedback`; `pending_actions.payload` | assistant | contract | S; LLM (history + current message, §3) | until the student deletes the conversation or the account |
| 9 | Uploaded files (CVs, evidence) | `user_files.content` (full file, `bytea`), `extracted_text` (≤ 60 000 chars), `filename`, `sha256` | CV analysis, proof | consent (upload is optional) | S only; LLM: first 4000 chars of extracted text when `analyze_cv` runs with AI | until deleted by the student (`DELETE /files/:id`) or account deletion |
| 10 | Notifications & preferences | `notifications.data` (task/plan titles), `notification_prefs` (incl. `unsubscribe_token`) | in-app notices, email opt-in | contract; reminder emails by opt-in consent | S | never pruned; until account deletion |
| 11 | Outbound email | `email_outbox.to_email`, `data` (name, task title, links), status, `provider_id` | transactional email | contract | Ops; email provider gets from, to, subject, text | **never pruned**; until account deletion. `data` of `reset` emails holds the reset link with the raw token (valid 1 h). |
| 12 | Feedback / support | `feedback.message` (free text), `page`, `kind`, `user_id` | support, privacy requests | legitimate interest / consent (counsel) | PA (with the sender's email) | **kept after account deletion** with `user_id` set to NULL; the message text stays |
| 13 | Product analytics | `events.name`, `props` (see ANALYTICS.md), `user_id` | product improvement | consent or legitimate interest (counsel) | Ops; PA via aggregates | never pruned. Rows with a `user_id` are **deleted with the account** (FK CASCADE). Rows created with `user_id` NULL (e.g. `account.deleted`, `search.used`, `try.used`, anonymous `page.viewed`/`feedback.sent`) stay. |
| 14 | AI usage | `ai_usage` (user_id, feature, tokens, cost, latency, error) | cost control, quality | legitimate interest (counsel) | Ops; PA via aggregates | never pruned; `user_id` set to NULL on account deletion |
| 15 | Retrieval log | `retrieval_log.query_hash` (first 16 hex chars of an **unsalted** SHA-256, so short queries can be guessed), `query_lang`, `results`, `user_id` | search quality | legitimate interest (counsel) | Ops; PA via aggregates | never pruned; `user_id` set to NULL on account deletion |
| 16 | Audit log | `audit_log.actor_id`, `action`, `target` (often a user or file uuid), `meta` (e.g. role changes, file mime/size) | security, accountability | legal obligation / legitimate interest (counsel) | PA (last 200, with actor emails) | never pruned; `actor_id` set to NULL on deletion, but `target` keeps uuids, e.g. `account.deleted` stores the deleted user's id |
| 17 | Rate-limit counters | `rate_limits.key` contains **IP addresses and emails** (`signin:ip:<ip>`, `signin:fail:<email>`, `forgot:email:<email>`, …) | abuse prevention | legitimate interest (counsel) | Ops | deleted 1 day after the window (daily cron and ~5 % of sign-ins); no FK to users |
| 18 | Server logs (stdout) | JSON lines (OBSERVABILITY.md): user uuids, conversation ids, request paths, error messages; in non-production only, `email.dev_preview` includes the recipient and full email text | operations | legitimate interest (counsel) | Ops / host | depends on the host; **not configured in the repository** |
| 19 | Cookies | `bawsala_session` (HttpOnly, strictly necessary), `bawsala_locale` (preference, 1 year) | session, language | strictly necessary / preference | browser | session cookie: until expiry or sign-out |

Data not collected by the code: no third-party trackers or ads, no IP or user agent in analytics, no phone number or address fields. A CV a student uploads can still contain such data, and also a national ID, birth date or marital status. `analyze_cv` flags these to the student but stores the file as uploaded. There is no age check at sign-up.

## 3. Exactly what is sent to the LLM provider

**When:** a provider is configured (`ANTHROPIC_API_KEY`, `AI_PROVIDER` unset or `anthropic`) and flag `ai.llm` is on for the user (flags support a percentage rollout and role filters). Chat additionally requires that the platform daily budget `AI_DAILY_BUDGET_USD` has not been reached. Skill extraction additionally requires flag `ai.analysis`. Otherwise the deterministic engine runs and nothing is sent. Requests carry no `metadata.user_id` or other account identifier.

**Chat** (`src/server/ai/chat.ts`, one request per model round, at most 5 rounds):

| Part | Content |
|---|---|
| System prompt, tool definitions | static text (no personal data) |
| History | the last 16 messages of the conversation (user and assistant, excluding errors and empty ones), each ≤ 6000 chars |
| `<student_context>` JSON (`buildStudentContext`) | `first_name` (first word of the name), `interface_language`, `situation`, `field_of_study`, `education_level`, `city`, `languages`, `goal` (≤ 300 chars), `target_role` {opportunity_id, title, data_status}, `passport` [{skill name, status, evidence count}], `pending_suggestions` (count), `experiences` (count), `plan` {title, done, total, next_task title}, `today` |
| Current message | the student's text (≤ 12 000 chars) |
| Tool results | JSON of each tool the model calls, ≤ 30 000 chars each, built from the student's own data. Examples: `analyze_skills` (quotes from experiences), `analyze_cv` (CV report: word counts, sections, flags such as `national_id`; skill quotes from the CV), `application_assistant` (evidence text and URLs), `get_my_plan` (task titles, due dates), `analyze_progress`, `improve_profile` (which profile fields are missing), opportunity/fit tools, `search_knowledge` (knowledge-base passages for a query the model writes) |

**Skill extraction** (`src/server/ai/analysis.ts`): the skill catalogue plus `<student_text>` ≤ 4000 chars. The text comes from one of:
- `POST /experiences/:id/analyze` (title + description). This route is **not** limited by the daily budget.
- the `analyze_skills` tool (text supplied by the model, or the first 5 saved experiences).
- `analyze_cv` (pasted CV text, or the extracted text of an uploaded file).

**Never sent:** email address, password or hash, user id, session or IP data, institution, full name (first name only).

**Other processors:**
- Resend receives `from`, `to`, `subject` and plain-text body (name, task title, links including password-reset and unsubscribe links).
- Voyage (if enabled) receives knowledge-base passages at ingest and search query text at query time. Search queries may contain whatever a user typed.

## 4. Data-subject rights as implemented

| Right | Mechanism | Gaps |
|---|---|---|
| Access / portability | `GET /api/v1/me/export`: JSON with user (id, email, name, locale, role, created_at, last_active_at), profile, experiences, skills, evidence, suggestions, saved_opportunities, plans, plan_tasks, conversations, messages (with tool calls and citations), pending_actions, file metadata, notifications, notification_prefs, verification_requests. File contents are downloaded separately (`GET /files/:id`). | Not included: sessions (IP/user agent), auth tokens, email_outbox, feedback sent, events, ai_usage, retrieval_log, audit_log, `users.institution_id` |
| Rectification | profile, name, locale, experiences, skills are editable in the app | email cannot be changed through the API |
| Erasure | `DELETE /api/v1/me` (password required; immediate, no grace period) | see §5 for what remains |
| Withdraw sharing / leave institution | `PATCH /profile {share_with_institution:false}`; `DELETE /me/institution` (also rejects pending verification requests) | |
| Objection / other requests | feedback form kind `privacy_request` → admin feedback list (status open/in_progress/closed) | no deadline tracking, no identity-verification workflow |
| Email opt-out | `notification_prefs.email_reminders` (opt-in, default false); one-click `/api/v1/unsubscribe?token=` | `email_security` and `in_app` are stored and editable but **not enforced**: `password_changed` emails and in-app notifications are always created |

## 5. Deletion: what `DELETE /api/v1/me` removes

One transaction writes `audit_log (action 'account.deleted', target <userId>)`, then `DELETE FROM users`.

| Effect | Tables |
|---|---|
| **Deleted** (FK `ON DELETE CASCADE`) | sessions, auth_tokens, profiles, experiences, user_skills, skill_evidence, skill_suggestions, saved_opportunities, plans, plan_tasks, conversations, messages, pending_actions, notifications, notification_prefs, email_outbox, user_files, verification_requests, **events** (rows linked to the user) |
| **Kept, link set to NULL** | ai_usage, retrieval_log, audit_log (actor), feedback (**message text kept**), opportunities.created_by, kb_documents.created_by, feature_flags.updated_by, verification_requests.reviewer_id (when the deleted user was a reviewer) |
| **Kept, not linked by FK** | audit_log `target`/`meta` uuids; rate_limits keys with email/IP (until pruned after 1 day); anonymous events; server logs (host retention); backups; data held by Anthropic/Resend/Voyage under their own retention terms |

## 6. Backups

The repository has **no backup configuration or procedure**. The privacy page says backups expire on their rotation cycle, so this must be set up at the database host. Points to decide:
- the retention period;
- encryption at rest;
- who can restore;
- re-applying deletions after a restore: the `audit_log` `account.deleted` rows hold the ids of deleted accounts and can drive that.

## 7. Morocco: Law 09-08 / CNDP, what is in place vs what requires legal action

**This is not legal advice; compliance has not been reviewed by counsel.** The items below are the questions an engineer can see from the code. Counsel must confirm the applicable obligations, formalities and article references.

| Topic | In place (code) | Requires legal / organisational action |
|---|---|---|
| Prior formality with the CNDP (declaration or authorisation before processing) | nothing in code; the privacy page says the declaration "is being prepared" | file the declaration or obtain the authorisation **before** processing real users' data; decide whether CV contents (possible national ID, birth date) or minors' data change the formality required; publish the receipt or authorisation number in the notice |
| Information notice | draft privacy page (`/privacy`, FR/EN, marked "draft, pending legal review") describing data, AI use, sharing, retention, rights | final text reviewed by counsel; controller identity and contact; recipients and processors; transfers abroad; retention periods; CNDP reference; availability in Arabic (Arabic/Darija/Tamazight users currently see the French text) |
| Consent records | sign-up requires a single checkbox (`consent: true`, "terms and privacy policy"), but **it is not stored** (no timestamp, no notice version); `share_with_institution` and `email_reminders` are stored as current values only, with no history | decide the legal basis per purpose (§2); where consent is the basis, store consent records (what, when, version) and allow withdrawal; separate consents if counsel requires (analytics, AI processing, institution sharing) |
| Cross-border transfers | AI can be switched off globally (`ai.llm` flag or no API key; the basic engine keeps working). Only a first name and no contact data go to the LLM; the local embedder keeps search text in-process. | transfers to Anthropic (LLM), Resend (email) and the hosting/database provider, depending on its location, are likely to require **CNDP authorisation** or another legal ground; processor agreements (DPA) with each; confirm the providers' retention and training terms |
| Data-subject rights (access, rectification, objection, erasure) | self-service export, edit, deletion; `privacy_request` feedback channel (§4) | a documented procedure with response deadlines, identity checks for requests by email, and handling of objection requests |
| Retention limits | sessions and rate-limit rows are pruned; everything else lasts until account deletion | define retention periods and automate purging for events, ai_usage, retrieval_log, audit_log, email_outbox, auth_tokens, feedback, inactive accounts, and backups |
| Security of processing | RLS on every table; scrypt passwords; hashed session and reset tokens; HttpOnly cookies; CSRF origin check; upload type sniffing and size limits; least-privilege roles | security review sign-off; breach-notification procedure; access policy for operators with database access |
| Institutions | institutions see only aggregates (≥ 5 sharing students) and requests the student sends | agreement with each institution (roles: controller / joint controller / recipient), especially for verification requests |
| Minors | no age check | decide whether under-18 users are allowed and what parental consent is needed |
