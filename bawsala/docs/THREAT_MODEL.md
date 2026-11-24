# BAWSALA threat model

- **Scope:** the Next.js 16 app (`src/`), PostgreSQL with RLS (`db/migrations/`), the LLM provider, the email provider, uploaded files, knowledge-base (KB) ingestion and the local embedding model.
- **Basis:** the security review of 2026-11-02 (`docs/SECURITY_REVIEW_FINDINGS.md`) and the fix commit `cd84ca0` (branch `claude/nice-brahmagupta-ophs0a`).
- **Status of fixes:** checked by code review and by the local test suite (`npx vitest run`: 74/75 pass; the one failure is an i18n wording test, `tests/unit/i18n.test.ts`, not a security test).
- **Not re-tested over HTTP:** the instance on `localhost:3000` was still the pre-fix build. API JSON responses had no `nosniff` header when I checked, so none of the fixes were re-checked over HTTP.

Standards used: **OWASP Top 10 (2021)** `A01–A10`, **OWASP API Security Top 10 (2023)** `API1–API10`, and **OWASP Top 10 for LLM Applications (2025)** `LLM01–LLM10`.

## 1. Assets

| Asset | Where | Why it matters |
|---|---|---|
| Student personal data: profile, experiences, CVs (often with phone, address or national ID), chat history, plans | `profiles`, `experiences`, `user_files.content/extracted_text`, `conversations`, `messages`, `plan_tasks` | Personal data of mostly young users (Morocco Law 09-08 / CNDP). It is also sent to the LLM provider. |
| Credentials and sessions | `users.password_hash`, `sessions` (stores SHA-256 of the token), `auth_tokens` (reset tokens) | Leaking them means account takeover. |
| Integrity of the Skills Passport: "verified" status and evidence | `user_skills.status`, `skill_evidence`, `verification_requests` | This is the trust signal that employers and institutions rely on. |
| Privileged roles | `users.role` (`platform_admin`, `institution_admin`), `users.institution_id` | A platform admin can change any user, flag or KB document. |
| Institution aggregates | `institutionStats()` (k ≥ 5) | Could re-identify students if the small-group rule fails. |
| Knowledge base and opportunity catalogue | `kb_documents`, `kb_chunks`, `opportunities` | Shared by every user, so poisoning it affects everyone. |
| AI budget | `ai_usage.est_cost_usd`, provider API key | Direct cost; can be abused for denial of wallet. |
| Secrets | `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `VOYAGE_API_KEY`, `DATABASE_URL`, `CRON_SECRET` | They give access to third parties or to the whole database. |
| Embedding model weights | `models/multilingual-e5-small/onnx/model_quantized.onnx` | Run in-process; they decide which KB passages each answer retrieves. |

## 2. Actors

| Actor | Capability | Trust |
|---|---|---|
| Anonymous visitor | Public pages; `/api/v1/try`, `/search`, `/events`, `/feedback`, `/auth/*`, `/unsubscribe`, `/health*` | Untrusted |
| Student | Own data through the API and chat; uploads; joining an institution with a code | Trusted for their own data only |
| Malicious student | As above, plus a script client: arbitrary headers, other users' IDs, many accounts, very large or chunked bodies, crafted files | Hostile |
| Institution admin | Aggregated stats and the verification queue for their own institution | Trusted inside one tenant |
| Platform admin | Users, roles, institutions, flags, KB, opportunities, feedback, audit log | Highly trusted (password only, no MFA) |
| Compromised LLM output or injected document | Text in a CV, an experience, a KB passage or chat history that steers the model's tool calls and answers | Untrusted data that looks like instructions |
| Operator | DB access, env secrets, `npm run admin:grant`, deployment and proxy config | Fully trusted; misconfiguration is the main risk |
| Third-party providers | Anthropic (LLM), Resend (email), Voyage (optional embeddings), npm registry and model mirror | Trusted under contract; they are a supply-chain and data-sharing boundary |

## 3. Trust boundaries

| # | Boundary | What crosses it | Main control points |
|---|---|---|---|
| TB1 | Browser → app | Cookies, JSON, multipart uploads, SSE | `src/server/http/api.ts` (`route`, `assertSameOrigin`, `readLimited`, `readJson`, `apiUser`), `src/proxy.ts` (CSP and headers), zod schemas |
| TB2 | App → Postgres | SQL with `app.user_id` / `app.role` set per transaction | `src/server/db/index.ts` (`asUser` / `asSystem` / `asPublic`), RLS policies in `db/migrations/001_init.sql:313-361` and `002_knowledge_ops.sql:166-196` |
| TB3 | App → LLM provider | System prompt, student context, chat history, tool results (including CV text and KB passages) | `src/server/ai/chat.ts`, `prompts.ts`, `tools/registry.ts`, `providers/anthropic.ts` |
| TB4 | App → email provider | Recipient address and plain-text body (reset links, reminders) | `src/server/notify.ts` (outbox, retries, no bodies logged in production) |
| TB5 | Uploaded file → parsers | Untrusted PDF, DOCX or TXT bytes, parsed in-process | `src/server/repo/files.ts` (`sniffType`, `zipLooksSafe`, `withTimeout`), `src/app/api/v1/files/route.ts` |
| TB6 | KB ingestion → retrieval → model | Admin-authored documents → chunks → passages placed in the model context | `src/app/api/v1/admin/knowledge/route.ts`, `src/server/rag/ingest.ts`, `retrieve.ts`, `scripts/kb-ingest.ts` |
| TB7 | Supply chain → runtime | npm packages; ONNX model weights loaded by `@huggingface/transformers` | `package-lock.json`, `src/server/rag/embedder.ts` (`allowRemoteModels=false`) |

## 4. Prioritised threat register

Priority meanings:

- **P1:** fix or decide before a public production launch.
- **P2:** next iteration.
- **P3:** backlog or accepted.

"Residual" is the risk left after the current controls.

| # | P | Boundary | STRIDE | Threat | OWASP | Current mitigation (files) | Residual |
|---|---|---|---|---|---|---|---|
| T1 | **P1** | TB2 | E, T | **The app connects as the owner of every table, and the "system" bypass is a plain GUC** (`app.role='system'`). One SQL injection, or one mistaken `asSystem` call, bypasses RLS. A query in user context could also update `users.role` (F-17, not fixed). | A01, A05 · API1, API5 | All SQL is parameterised: the review grep found only constant interpolation. Every RLS policy is `FORCE`d. The role is not a superuser and lacks `BYPASSRLS`. User IDs are checked as UUIDs (`db/index.ts:66-71`). Tested in `tests/integration/isolation.test.ts`. | **Medium.** Fix at deployment: use a non-owner runtime role, column privileges or a trigger on `users.role/institution_id`, and later `SECURITY DEFINER` functions for system paths. |
| T2 | **P1** | TB1 | S, E | **Platform-admin takeover.** It used to be possible by signing up with an `ADMIN_EMAILS` address (F-01, fixed). Admin accounts still use only a password: there is no MFA, and the app never verifies email ownership (`users.email_verified_at` is unused). | A07 · API2 | Signup always creates a `student`. Admin rights come only from the operator CLI `scripts/make-admin.ts` (`npm run admin:grant`), which writes `audit_log` and resets sessions. Admin routes call `apiUser(["platform_admin"])` and the layouts call `requireRole`. | **Medium.** Add TOTP/WebAuthn for `platform_admin` and `institution_admin`, plus email verification. |
| T3 | **P1** | TB5 | D | **The parsers can exhaust the server.** PDF parsing (pdf.js through `unpdf`) runs in-process with only a 15 s `Promise.race`, which does not stop the work. The DOCX pre-check trusts the sizes declared in the zip central directory, which an attacker can fake (F-05: DOCX partly fixed, PDF open). | A04 · API4 | Max 5 MB, enforced while streaming (`readLimited`). Magic-byte sniffing. `zipLooksSafe` checks 30 MB total, a ratio of 120 and 2,000 entries (`files.ts:40-57`). 20 uploads per hour per user. Tested in `tests/unit/security.test.ts` ("F-05"). | **Medium.** Run extraction in a `worker_threads` worker with `resourceLimits` and terminate it on timeout. Cap PDF pages. Abort the inflate once the bytes produced pass the cap. |
| T4 | **P1** | TB1 | D, S | **Rate limits depend on correct proxy configuration.** `clientIp` takes the X-Forwarded-For entry `TRUSTED_PROXY_HOPS` from the end (default 1). With no proxy, a client can still choose the IP. With too many hops configured, every client shares the single `"direct"` bucket, so the app limits itself. | A05, A07 · API4, API6 | `src/server/http/api.ts:64-69`, `TRUSTED_PROXY_HOPS` in `env.ts:27`. Tested in `tests/unit/security.test.ts` ("F-02"). | **Medium.** Operational: set it to match the host (see `SECURITY.md` §4). Consider a platform header (e.g. `x-vercel-forwarded-for`) or the socket address. |
| T5 | **P1** | TB3 | I | **Personal data in CVs, experiences and the profile is sent to the LLM provider.** It goes through tool results, the extraction prompt and the student context. `analyze_cv` warns about sensitive fields but still passes the text on. | LLM02 · A04 | Context is minimised: first name only, goal truncated (`chat.ts:51-72`). Basic mode is available with no provider. Extraction is limited to 4,000 characters. There is a privacy-request form. The provider choice is documented. | **Medium (compliance).** Get a DPA and zero-retention terms with the provider. Redact phone, national-ID and email patterns before sending CV text. Explain this in the privacy notice (Law 09-08). |
| T6 | P2 | TB1 | D | **Targeted signin lockout.** The per-account counter now counts only failures (F-06), but `rateLimitPeek` runs before the password check, so 8 failures from anyone still block the real owner for up to 15 minutes. | A07 · API2, API6 | `signin/route.ts:19-24`, `ratelimit.ts:27-32`. Per-IP limit of 20 per 15 minutes. | **Low.** Run the peek only after a failed check, or allow a correct password from a known device. Optionally add a CAPTCHA. |
| T7 | P2 | TB1, TB4 | S | **Outstanding reset tokens are not revoked.** A successful reset or password change does not invalidate the user's other unused reset tokens (second half of F-08). Reset links travel in email and sit in the URL query. | A07 · API2 | Tokens are 256-bit, stored as SHA-256, live 1 h and are single-use. A reset deletes every session. A password change deletes the other sessions (`account.ts:47`). `Referrer-Policy: strict-origin-when-cross-origin`. | **Low.** `UPDATE auth_tokens SET used_at=now() WHERE user_id=$1 AND used_at IS NULL` on reset and on change. |
| T8 | P2 | TB3 | T, E | **Indirect prompt injection** from CV text, experiences, KB passages or chat history, steering tool calls or the answer. | LLM01, LLM06, LLM05 | Tools take the user ID only from the session (`tools/registry.ts:22-28`) and validate inputs and outputs with zod. Write tools only create suggestions, make a reversible save (`save_opportunity`), or create a pending action that the user must confirm (`create_learning_roadmap` → `/api/v1/actions/[id]`). `application_assistant` is now read-only (F-18). The system prompt treats tool results and context as data (`prompts.ts:29-31`). There is no tool that reaches the network. Markdown renders no raw HTML or images, and `//host` links are external (`markdown.tsx:13`). CSP `img-src 'self' blob: data:`. | **Low.** Worst case: misleading advice, or a phishing link the user has to click, affecting only the user's own data. Continue the adversarial cases in `npm run eval:ai`. |
| T9 | P2 | TB6 | T | **KB poisoning.** A compromised admin account or a poisoned source document puts instructions or false facts in front of every user's model. This is the only cross-user injection path. | LLM04, LLM01, LLM09, LLM08 · A08 | Ingestion is admin-only, audited (`kb.ingested`) and keeps versions and `content_hash`. `verification_status` is shown to the user, and the model must flag "unverified" passages. Retrieval reads only `status='active'` documents. | **Medium (depends on T2).** Add MFA for admins. Have a second person review KB changes before `active`. Run a scheduled diff or report of KB changes. |
| T10 | P2 | TB3 | D | **Unbounded consumption / denial of wallet.** Fixed (F-03): a 24 h per-user window (`chat:day:<id>`) counts every generation, including regenerations, and deleting conversations no longer resets it. A platform budget `AI_DAILY_BUDGET_USD` switches to the basic engine when it is reached. Remaining gaps: (a) the budget is checked once per request, so concurrent turns can overshoot; (b) nested extraction (`/experiences/:id/analyze` and `analyze_skills`) is not checked against the budget; (c) account creation is limited only per IP, with no email verification. | LLM10 · API4, API6 | `chat/route.ts:28-33`, `ai/usage.ts:12-15`, `chat.ts:47-48` (≤5 rounds, ≤8 tool calls), `analyze` 30 per hour per user, upload 20 per hour. | **Low–Medium.** Check `spentTodayUsd()` inside `analyzeText` too, and require email verification before LLM features. |
| T11 | P2 | TB7 | T | **Supply chain: embedding model.** The weights came from an npm package that mirrors `Xenova/multilingual-e5-small`. A SHA-256 was recorded but never checked against HuggingFace, which is blocked in this environment. `scripts/fetch-embedding-model.ts` (named in `embedder.ts:6`) and `npm run models:fetch` (named in `.env.example`) do not exist in the repo, so the fetch cannot be reproduced. Hashes I computed: `model_quantized.onnx` = `f80102d3f2a1229f387d3c81909990d8945513e347b0eab049f7de3c6f98c193`, `tokenizer.json` = `0b44a9d7b51c3c62626640cda0e2c2f70fdacdc25bbbd68038369d14ebdf4c39`. | LLM03, LLM04 · A06, A08 | ONNX is a data format, not pickle, and runs in onnxruntime. `allowRemoteModels=false` (`embedder.ts:31`), so nothing is downloaded at runtime. The model only ranks passages and does not produce user-visible text. | **Low–Medium.** From a network that can reach HuggingFace, compare the hashes with the upstream LFS SHA-256 of `Xenova/multilingual-e5-small` at a pinned revision. Commit a `models/SHA256SUMS` and check it at startup. Add the fetch script. |
| T12 | P2 | TB7 | T | **Supply chain: npm packages,** including PDF and DOCX parsers and native ML runtimes. | A06 · LLM03 | `npm audit --omit=dev` found 0 vulnerabilities in 211 production dependencies (2026-11-02). There is a lockfile. Versions are pinned for next and react. | **Low.** Use `npm ci` in CI, run audit weekly, Dependabot or Renovate, and review before upgrading the parsers. |
| T13 | P3 | TB1 | T | **CSRF** | A01 · API8 | The Origin must equal the Host or the `APP_URL` host. `X-Forwarded-Host` is ignored (F-09). Missing or `null` Origin gets 403. Cookie is `SameSite=Lax`. No CORS. Tested in `tests/unit/security.test.ts` ("F-09"). | **Low.** |
| T14 | P3 | TB1 | I, E | **BOLA / IDOR across students and tenants** | A01 · API1, API3, API5 | RLS plus queries filtered by owner. Institution queries use `institutionId` from the session, never from the request. Verification re-checks membership and sharing, and leaving an institution cancels pending requests (F-07). Two-account tests all returned 404 (review §Verified OK). Tested in `tests/integration/isolation.test.ts` and `institution.test.ts`. | **Low.** |
| T15 | P3 | TB1 | T | **XSS** | A03 | React escapes output; no raw HTML in Markdown; nonce CSP with `strict-dynamic`; `zUrl` allows http(s) only; downloads are `attachment` with `sandbox` CSP and `nosniff`. | **Low.** |
| T16 | P3 | TB1 | D | **Oversized or chunked request bodies** | API4 | `readLimited` enforces the limit while streaming: 256 KB for JSON, 5 MB + 64 KB for uploads (F-04). Tested in `tests/unit/security.test.ts` ("F-04"). | **Low.** Also set a limit at the proxy. |
| T17 | P3 | TB1 | R | **Log forging and missing audit trail** | A09 | `client.error` props are now sanitised under a nested `client` key (F-10). Admin and verification actions are written to `audit_log`. | **Low.** `log.write` still lets data keys overwrite `t/level/event` for other callers (all server-controlled today). |
| T18 | P3 | TB1 | I | **Account enumeration on signup** (`409 email_taken`) | A07 · API2 | Signin and forgot-password are uniform, with a dummy hash for timing. | **Accepted (F-14).** |
| T19 | P3 | TB1 | I | **Information disclosure** (health endpoint, error bodies) | A05 · API8 | `health/ready` no longer returns DB error text (F-19). Unhandled errors return `{code:"internal", ref}` only. | **Low.** It still shows the migration name and whether AI is configured. |
| T20 | P3 | TB3 | I | **System prompt leakage** | LLM07 | The prompt contains no secrets or per-user data; the security rules are also enforced in code. | **Low.** |
| T21 | — | — | — | **SSRF** | A10 · API7 | No user-supplied URL is ever fetched by the server. Server-side `fetch` goes only to fixed hosts: `api.voyageai.com` and `api.resend.com` (code review). | **None found.** |

## 5. Notes per boundary

**TB1 Browser → app.** Every API route goes through `route()`, which checks the Origin and maps errors. `apiUser(roles)` checks the role. The data-access layer then scopes queries, and RLS is the last layer. The session token is 256-bit; the database stores only its hash. The cookie is `HttpOnly; Secure; SameSite=Lax` and expires after 30 days, with an absolute cap of 90 days (F-13). Pages get a nonce CSP, `frame-ancestors 'none'`, `nosniff` and `Referrer-Policy`. API JSON gets `no-store` and `nosniff` (F-15).

**TB2 App → Postgres.** Each request runs in its own transaction, with `set_config` passed as a bound parameter. A "system" context bypasses RLS, so every `asSystem` call is a privileged path and should be reviewed as one. The list includes auth, admin, institution aggregates, notify, events and rate limits. The biggest structural risk left is T1.

**TB3 App → LLM.** The model never decides who the user is: the user ID comes from the session in `ToolContext`. The tool loop is bounded. Extraction drops quotes that do not appear in the student's text (`analysis.ts:quoteIsGrounded`). Suggestions need the student's acceptance. Plans need a confirm click. Verification is human-only (institution admin) and cannot be done through a tool.

**TB4 Email.** The outbox retries with backoff. Bodies are plain text. Links are built from `APP_URL`, not the Host header. Bodies are never logged in production. SPF, DKIM and DMARC are operational and were not verified.

**TB5 Uploads.** Files are stored in Postgres (`bytea`) under RLS and are never served inline. Extracted text is capped at 60,000 characters and treated as untrusted model input. There is no antivirus scanning, by design.

**TB6 KB ingestion.** Only admins can ingest, and every change is versioned and audited. Content reaches every user's model context, which is why T9 depends on T2.

**TB7 Supply chain.** See T11 and T12.
