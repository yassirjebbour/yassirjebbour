# BAWSALA security

This file describes the security model as it is implemented, the status of each review finding, a production checklist, and how to report a vulnerability. The threat analysis is in `docs/THREAT_MODEL.md`, and the original review evidence is in `docs/SECURITY_REVIEW_FINDINGS.md`.

**Verification status:**

- Everything below was checked against commit `cd84ca0` by code review and the local test suite. `npx vitest run` gives 74/75 passing; the one failure is an i18n wording test, `tests/unit/i18n.test.ts`, which is not a security test.
- The instance running on `localhost:3000` was still the build from before the fix, so **none of the fixes have been checked again over HTTP**.
- Anything marked *(code review)* has no automated test.

## 1. Security model as implemented

### Authentication

- **Passwords:**
  - Length is 10–200 characters (`src/server/http/schemas.ts`).
  - Hashed with scrypt N=2^15, r=8, p=3, a 16-byte salt and a 64-byte key, after NFKC normalisation (`src/server/auth/password.ts`). OWASP lists this as equivalent to N=2^17, r=8, p=1.
  - Comparison is constant-time.
  - Hashes with older parameters are re-hashed at the next successful sign-in (`src/server/repo/account.ts:34-37`).
- **Signin errors:** a single `invalid_credentials` error. When the email does not exist, a dummy hash keeps the timing the same.
- **Admin roles:** signup always creates a `student`. `platform_admin` can be granted only with the operator CLI `npm run admin:grant -- <email>` (`scripts/make-admin.ts`), which needs DB access, writes `audit_log` and resets sessions. `institution_admin` is set by a platform admin (`PATCH /api/v1/admin/users/[id]`, which also resets that user's sessions).
- **Password reset:**
  - The token is 256-bit random, stored as SHA-256, valid for 1 h and usable once (`src/app/api/v1/auth/reset/route.ts`).
  - A reset signs out every device.
  - Forgot-password always answers `{ok:true}`.
  - The link is built from `APP_URL`, not from the Host header.
- **Not implemented:** email verification (`users.email_verified_at` is unused) and MFA.

### Sessions (`src/server/auth/session.ts`)

- The cookie is `bawsala_session`, with `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` when `NODE_ENV=production`.
- The token is 32 random bytes. Only its SHA-256 is stored, in `sessions.id`.
- **Lifetime:**
  - A session lasts 30 days.
  - It slides forward when fewer than 15 days are left.
  - It has an **absolute cap of 90 days** from creation.
- **Revocation:**
  - Signing out deletes the server-side session.
  - "Sign out other devices" (`/auth/signout-all`) keeps only the current session.
  - A password change deletes every other session (`account.ts:47`).
  - A reset or a role change deletes them all.

### Authorization: four layers

1. **Route role checks.**
   - `apiUser(roles?)` in `src/server/http/api.ts` guards the API. All `/api/v1/admin/**` routes require `platform_admin`, and `/api/v1/institution/**` requires `institution_admin`.
   - Pages use `requireUser` / `requireRole` in `src/app/{app,institution,admin}/layout.tsx`.
   - `src/proxy.ts` only checks that a session cookie exists; it is not the real check.
2. **Data-access layer.** Every repository function takes the session user's ID, never an ID from the request body (`src/server/repo/*`). AI tools get the user only from `ToolContext`.
3. **Postgres RLS.**
   - `asUser` sets `app.user_id` for the transaction (`src/server/db/index.ts`).
   - Every table that holds user data has an `owner_rw` policy, with RLS enabled and **forced**.
   - Sessions, tokens, rate limits, the outbox and the audit log can be read and written only in system context.
   - Reference data (skills, opportunities, active KB documents) is readable by everyone.
   - Policies are in `db/migrations/001_init.sql` (RLS section) and `002_knowledge_ops.sql`. Tested in `tests/integration/isolation.test.ts`.
4. **Tenant filters.**
   - Institution queries use `institutionId` from the session (`src/server/repo/institution.ts`).
   - Statistics count only students who opted in and are hidden below 5 students (`MIN_GROUP`).
   - Approving a verification re-checks that the student is still a member and still sharing.
   - Leaving an institution cancels pending requests (`src/app/api/v1/me/institution/route.ts`).
   - Tested in `tests/integration/institution.test.ts`.

### CSRF

- `route()` rejects any non-GET request whose `Origin` is missing, `null`, or not equal to the `Host` header or the `APP_URL` host. `X-Forwarded-Host` is ignored (`api.ts:15-25`).
- The `SameSite=Lax` cookie is a second layer.
- There are no CORS headers.
- The only state-changing GET is `/api/v1/unsubscribe`, which requires a 144-bit token.

### CSP and headers

- **Pages:** `src/proxy.ts` sets a per-request nonce CSP with these directives:
  - `script-src 'self' 'nonce-…' 'strict-dynamic'`
  - `object-src 'none'`
  - `base-uri 'self'`
  - `form-action 'self'`
  - `frame-ancestors 'none'`
  - `img-src 'self' blob: data:`
- Pages also get `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `Permissions-Policy`.
- HSTS and `upgrade-insecure-requests` are added when `APP_URL` is https. `X-Powered-By` is off.
- **API JSON:** `Cache-Control: no-store` and `nosniff` (`api.ts:11`).
- **File downloads:** `attachment`, `nosniff`, `CSP: default-src 'none'; sandbox` and `private, no-store`.

### Input validation

- Every body and parameter is checked with zod: UUIDs, enums, length caps, and `zUrl` for http(s) only.
- Bodies are read through `readLimited`, which enforces the byte cap **while streaming**, even without `Content-Length`. The cap is 256 KB for JSON and 5 MB + 64 KB for uploads (`api.ts:28-57`).
- All SQL is parameterised; the only interpolations are constants or whitelisted column names.
- Markdown is rendered without raw HTML or images. Only `/path` links count as internal; `//host` links are treated as external (`src/components/app/markdown.tsx`).

### Uploads (`src/server/repo/files.ts`)

- Allowed types are PDF, DOCX and TXT, up to 5 MB, decided by magic bytes.
- Filenames are cleaned.
- DOCX archives are rejected if the zip directory declares more than 30 MB uncompressed, a ratio above 120, more than 2,000 entries, or ZIP64 (`zipLooksSafe`).
- Text extraction has a 15 s timeout and is capped at 60,000 characters.
- Files are stored in Postgres under RLS and are never served inline. There is no antivirus scanning.
- **Open:** PDF parsing runs in-process, and the timeout does not stop the work.

### Rate limits and quotas

Limits are fixed windows stored in Postgres (`src/server/ratelimit.ts`):

| Action | Limit |
|---|---|
| Signin | 20 per 15 min per IP; 8 *failed* attempts per 15 min per account |
| Signup | 5 per hour per IP |
| Forgot password | 5 per hour per IP and 3 per hour per email |
| Reset | 10 per hour per IP |
| Upload | 20 per hour per user |
| Analyze | 30 per hour per user |
| Chat | 12 per minute and `AI_DAILY_MESSAGES_PER_USER` per rolling 24 h per user. Every generation counts, including regenerations, and deleting a conversation does not reset the count. |
| Try | 30 per 10 min per IP |
| Search | 60 per 10 min per IP |
| Events | 120 per minute per IP |
| Feedback | 10 per hour per IP |

- **Platform AI budget:** when the estimated spend since midnight UTC reaches `AI_DAILY_BUDGET_USD` (`src/server/ai/usage.ts`), chat falls back to the deterministic basic engine.
- **Client IP:** taken from `X-Forwarded-For`, counting `TRUSTED_PROXY_HOPS` entries from the end (`api.ts:64-69`).

### Secrets

- Secrets are read from env and validated with zod (`src/server/env.ts`). `CRON_SECRET` must be at least 24 characters, and the cron route compares it in constant time.
- `.env*` is gitignored, except `.env.example`.
- No secret is sent to the client or written to the logs.

### Logging privacy (`src/server/log.ts`)

- Logs are structured JSON on stdout. They contain IDs, sizes, codes and error objects, never passwords, tokens or the text students write.
- Email bodies (which contain reset links) are logged only outside production.
- Client error reports are sanitised: at most 12 keys matching `[a-z_]`, values up to 80 characters, nested under `client`.
- Unexpected API errors return `{code:"internal", ref}`, and the details stay in the server log.
- Product analytics live in `src/server/events.ts`: event names come from an allowlist, and no IP, user agent or free text is stored.

### LLM guardrails (`src/server/ai/*`)

- **Tool permission classes** (`tools/registry.ts`):
  - `read`: runs immediately.
  - `suggest`: writes skill suggestions that the student must accept.
  - `reversible`: only `save_opportunity`.
  - `confirm`: `create_learning_roadmap` only creates a `pending_actions` row. It takes effect when the student presses Confirm (`POST /api/v1/actions/[id]`, single-use, owner-only).
  - `application_assistant` is read-only.
  - The model cannot verify skills; only an institution admin can.
- **User ID from the session only:** `ToolContext.user` comes from the session. Model inputs never contain a user ID. Tool inputs and outputs are validated with zod.
- **Bounded loop:** ≤5 model rounds and ≤8 tool calls per turn; history limited to 16 messages of 6,000 characters each; tool results cut at 30,000 characters; `max_tokens` 8,000 for chat and 4,000 for structured output; provider timeout 90 s with 2 retries.
- **Grounded extraction:** skill IDs must be in the catalogue, the quote must appear in the student's text, and there are at most 8 per text (`analysis.ts`).
- **Untrusted-data framing:** the system prompt is fixed (`prompts.ts`). Student context is passed as JSON inside `<student_context>`, and student text inside `<student_text>`. The model is told to treat context, tool results and KB passages as data, not instructions. There is no tool that reaches the network, and images are not rendered, which closes the usual ways to send data out.
- **Engine fallback:** without a provider key, or when the `ai.llm` flag is off or the budget is used up, the basic engine answers. The UI labels which engine answered.

## 2. Finding status

All fixes are in commit `cd84ca0` (branch `claude/nice-brahmagupta-ophs0a`).

| ID | Sev | Finding | Status | Reference (code / test) |
|---|---|---|---|---|
| F-01 | high | Admin by signing up with `ADMIN_EMAILS` | **Fixed** | `scripts/make-admin.ts`; `ADMIN_EMAILS` removed from `src/` and `.env.example` *(code review)* |
| F-02 | medium | Rate-limit IP taken from client XFF | **Fixed** (depends on config: §4) | `api.ts:64-69`; `tests/unit/security.test.ts` "F-02" |
| F-03 | medium | Daily AI quota bypass; no budget | **Fixed** (gaps in THREAT_MODEL T10) | `chat/route.ts:28-33`, `ai/usage.ts:12-15` *(code review)* |
| F-04 | medium | Body cap bypassed by chunked encoding | **Fixed** | `api.ts:28-57`, `files/route.ts:17-18`; `security.test.ts` "F-04" |
| F-05 | medium | Parser decompression bomb / CPU | **Partly fixed** (DOCX pre-check). **Open** for PDF and for zip directories that lie about sizes | `files.ts:40-57,68`; `security.test.ts` "F-05" |
| F-06 | low | Signin lockout of the account owner | **Fixed** (commit after e852ec0): failures are counted per (account, IP) with limit 8/15 min plus a per-account ceiling of 50/15 min, so one attacker network cannot lock the owner out; the owner's own 8 typos from one network still pause sign-in for ≤15 min (accepted) | `signin/route.ts` |
| F-07 | low | Approving a request after the student left | **Fixed** | `institution.ts:44-58`, `me/institution/route.ts:24`; `tests/integration/institution.test.ts` "F-07" |
| F-08 | low | Password change keeps other sessions / reset tokens | **Fixed**: other sessions revoked on change; all outstanding reset tokens invalidated on reset and on change | `account.ts` changePassword, `auth/reset/route.ts` |
| F-09 | low | CSRF check trusted `X-Forwarded-Host` | **Fixed** | `api.ts:15-25`; `security.test.ts` "F-09" |
| F-10 | low | Log forging via `client.error` | **Fixed** | `events/route.ts:17` *(code review)* |
| F-11 | low | `//host` links treated as internal | **Fixed** | `markdown.tsx:13` *(code review)* |
| F-12 | low | scrypt cost below OWASP | **Fixed** (N=2^15, r=8, p=3, rehash on login) | `password.ts:6-31`, `account.ts:34-37`; `security.test.ts` "F-12" |
| F-13 | low | No absolute session lifetime | **Fixed** (90 days) | `session.ts:8-9,46,52`; `institution.test.ts` "F-13" |
| F-14 | low | Signup reveals registered emails | **Accepted** (UX trade-off) | — |
| F-15 | info | No `nosniff` on API JSON | **Fixed** for `json()` responses. Responses built directly with `Response.json` (health, cron) still lack it | `api.ts:11` *(code review)* |
| F-16 | info | Verification request silently enables sharing | **Fixed** (UI confirm) | `src/components/app/passport.tsx:49` *(code review; not checked in a browser)* |
| F-17 | info | App connects as table owner; GUC-based system bypass | **Open**: deployment step (§4) plus optional column privileges or a trigger | THREAT_MODEL T1 |
| F-18 | info | `application_assistant` wrote data | **Fixed** (read-only) | `src/server/ai/tools/index.ts` *(code review)* |
| F-19 | info | Health endpoint returned DB error text | **Fixed** (error goes to the server log only) | `src/app/api/health/ready/route.ts:15-16` *(code review)* |

New open items from the threat model:

- No MFA for admins (T2).
- No email verification (T2, T10).
- PII is sent to the LLM provider and should be redacted, with a DPA in place (T5).
- Reset-token revocation (T7).
- Second-person review of KB changes (T9).
- Embedding model provenance (T11).

## 3. Residual risk summary

The top items to close before a public launch:

1. T1/F-17: runtime database role.
2. T2: admin MFA.
3. T3/F-05: run parsing in an isolated worker.
4. T4: correct `TRUSTED_PROXY_HOPS`.
5. T5: provider DPA and PII redaction.

## 4. Production checklist (operator)

- [ ] **Database role.** Run migrations as `bawsala_owner`. The app runs as `bawsala_app`, which:
  - does **not own** any table;
  - has no `SUPERUSER` and no `BYPASSRLS`;
  - has only `SELECT/INSERT/UPDATE/DELETE` on the app tables and `USAGE` on the sequences.

  Check with `SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname = current_user;` and make sure `pg_tables.tableowner` ≠ the app role. Consider `REVOKE UPDATE (role, institution_id) ON users FROM bawsala_app` together with a `SECURITY DEFINER` admin function. (F-17)
- [ ] **TLS everywhere.**
  - Set `APP_URL` to `https://…`, which turns on HSTS and `upgrade-insecure-requests`.
  - Use `DATABASE_SSL=true` with a verified CA. The current code uses `rejectUnauthorized:false` (`db/index.ts:29`); pin the provider CA instead.
  - Use HTTPS for all provider endpoints.
- [ ] **Secrets in the host's secret store** (Vercel/Fly/Render secrets or a vault), never in the image or repo: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `VOYAGE_API_KEY`, `CRON_SECRET`. Rotate them when staff change, and immediately after any suspected leak.
- [ ] **`TRUSTED_PROXY_HOPS`** must equal the number of proxies that append to `X-Forwarded-For` in front of the app. That is usually 1 (Vercel, Fly, Render, a single nginx). Never expose the Node server directly while `TRUSTED_PROXY_HOPS≥1`, because the client would then control the "trusted" entry. Check by sending a spoofed `X-Forwarded-For` and confirming the rate-limit key does not change.
- [ ] **Body size limit at the edge**, for example nginx `client_max_body_size 6m`, in addition to `readLimited`.
- [ ] **`CRON_SECRET`** is set, at least 24 random characters, and sent only by the scheduler as `Authorization: Bearer …`.
- [ ] **Admin accounts.** Create them with `npm run admin:grant` only. Keep as few as possible and review `audit_log` for `admin.granted` and `user.updated`. MFA is not implemented yet, so require strong, unique passwords.
- [ ] **AI limits:**
  - Set `AI_DAILY_MESSAGES_PER_USER` and `AI_DAILY_BUDGET_USD`.
  - Set a hard monthly spend limit in the provider console as a backstop.
  - Get a DPA and zero-data-retention terms from the provider.
- [ ] **Backups:**
  - Encrypt them at rest and in transit. They contain CV files, `password_hash` and chat history.
  - Restrict who can access them.
  - Test restores.
  - Purge deleted accounts within the stated retention period.
- [ ] **Dependencies:**
  - Install with `npm ci` from the lockfile.
  - Run `npm audit --omit=dev` in CI and weekly.
  - Use Dependabot or Renovate.
  - Read the changelog before upgrading `next`, `unpdf`, `mammoth` or `@huggingface/transformers`.
- [ ] **Embedding model.** Check the SHA-256 of `models/multilingual-e5-small/*` against upstream `Xenova/multilingual-e5-small` at a pinned revision before deploying (THREAT_MODEL T11), and keep `allowRemoteModels=false`.
- [ ] **Email:** SPF, DKIM and DMARC for the `EMAIL_FROM` domain.
- [ ] **Monitoring:** collect stdout logs. Alert on `api.unhandled`, bursts of `rate_limited`, `ai.usage` spend and `health.db_failed`. Leave `SENTRY_DSN` unset unless its data handling has been reviewed.
- [ ] **Demo data:** set `SEED_DEMO_OPPORTUNITIES=false` once real opportunities exist.

## 5. Reporting a vulnerability

There is no `security@` address yet. Until there is one:

1. In the app, open **Help → Privacy / problem** (the feedback form, which posts to `POST /api/v1/feedback`). Choose the type **Problem (bug)**, or **Privacy request** if personal data is involved. Start the message with `SECURITY:`.
2. Describe the issue, the affected page or endpoint, and how to reproduce it. Use only your own accounts. Do **not** include other people's data, live secrets or working exploit payloads against production. Messages are limited to 4,000 characters, so offer to send details through a private channel.
3. Only platform admins can read reports (`/admin`, feedback list). We aim to acknowledge within 5 working days (*a target, not yet an operational commitment*). Please do not disclose the issue publicly before it is fixed or 90 days have passed.

Please do not run load or denial-of-service tests, social engineering, or tests against other users' accounts. Do not access more data than you need to show the issue.
