# Product analytics

This is the first-party analytics data dictionary. Sources: `src/server/events.ts` (`EVENT_NAMES`, `track`, `sanitizeProps`), every `track(` call site, and `src/server/repo/admin.ts` (metric definitions). There are no third-party trackers.

## 1. Storage & privacy rules

| Rule | Implementation |
|---|---|
| Storage | `events (id, user_id, name, props jsonb, created_at)`. `name` must match `^[a-z_.]{2,60}$`. Server events are written by `track()` through `asSystem`, fire-and-forget; a failed write is logged as `event.write_failed`. |
| Event names | allowlist `EVENT_NAMES` (TypeScript type). The browser can send only `page.viewed`, `opportunity.apply_clicked` and `client.error` (`POST /api/v1/events`, zod enum, 120 requests/min per IP). |
| Props | `sanitizeProps`: first 12 keys only; keys must match `^[a-z_]{1,30}$`; values must be finite numbers, booleans or strings (cut to 80 chars); everything else is dropped. There is **no per-event prop schema**, so a client event may carry any key that passes these rules. |
| No free text | server events carry ids, enums, counts and booleans only. The exceptions are client-sent strings: `client.error.message` (an error message, ≤ 80 chars) and `page` paths (uuids replaced by `:id` for `page.viewed`). |
| No IP / user agent | the `events` table has no such columns. IPs are used only for rate-limit keys, which are pruned after 1 day. |
| User link | `user_id` is the session user or NULL. Rows with a `user_id` are **deleted with the account** (FK CASCADE); NULL rows remain. No retention limit is automated. |

## 2. North Star & activation (as implemented in `adminOverview()`)

| Metric | Definition (SQL in `src/server/repo/admin.ts`) |
|---|---|
| **North Star** | `count(DISTINCT user_id) FROM plan_tasks WHERE completed_at > now() - 7 days AND kind IN ('prove','project')`: users who completed at least one *prove* or *project* step in the last 7 days. There is no role filter, and the count includes completions without a proof attached. |
| **Activation funnel** | Cohort `s` = distinct `user_id` with an `account.signed_up` event in the last 30 days. Stages, each counted **independently** within `s` (a stage does not require the previous one): **signup** = size of `s` → **onboarded** = `profiles.onboarded_at IS NOT NULL` → **skill** = has any `user_skills` row (declared, accepted, evidenced or verified) → **target** = `profiles.target_opportunity_id IS NOT NULL` (current value) → **plan** = has any plan (any status) → **task** = has any completed plan task (any kind). |
| **WAU** | `count(DISTINCT user_id) FROM events WHERE user_id IS NOT NULL AND created_at > now() - 7 days` (any event, including `page.viewed` and `account.signed_in`) |

Deleted accounts drop out of every metric, because their events and rows are deleted.

## 3. Event dictionary

`user` = the session user's id. `NULL` = stored without a user.

| Event | Emitted by | When | user_id | Props |
|---|---|---|---|---|
| `account.signed_up` | `POST /auth/signup` | after the account and session are created | new user | `locale`, `with_institution` (bool) |
| `account.signed_in` | `POST /auth/signin` | successful sign-in | user | – |
| `account.deleted` | `DELETE /me` | after the account is deleted | NULL | – |
| `onboarding.completed` | `PATCH /profile` | `onboarded:true` sent while `onboarded_at` was still NULL | user | – |
| `experience.added` | `POST /experiences` | experience created | user | `kind`, `chars` (description length) |
| `analysis.run` | `POST /experiences/:id/analyze` | after extraction | user | `engine` (`ai+rules` \| `rules`), `found`, `created`, `discarded` (hallucinated quotes) |
| `suggestion.accepted` | `POST /suggestions/:id/accept` | suggestion accepted | user | `skill` (skill id) |
| `suggestion.rejected` | `POST /suggestions/:id/reject` | suggestion rejected | user | – |
| `skill.declared` | `POST /skills` | skill declared | user | `skill` |
| `evidence.added` | `POST /skills/:skillId/evidence` | proof attached on the passport | user | `skill`, `kind` (`project`\|`link`\|`certificate`). Proof from completing a task is reported as `task.completed {evidenced:true}` instead. |
| `target.set` | `POST /opportunities/:id/target` | target role set | user | `demo` (bool: sample opportunity) |
| `plan.created` | `POST /plan` (`source:"ui"`), `POST /actions/:id` confirm (`source:"assistant"`) | plan saved | user | `source`, `tasks`, `days` |
| `task.completed` | `POST /plan/tasks/:id/complete` | every call, including re-completing an already completed task | user | `evidenced` (bool) |
| `chat.message` | `POST /chat` | before streaming starts (user message stored, or regenerate prepared) | user | `regenerate` (bool), `chars` |
| `tool.executed` | `POST /chat` stream | each `tool_end` event, including tools of an LLM round that later fell back to basic | user | `tool`, `ok` |
| `opportunity.viewed` | `GET /opportunities/:id` | detail fetched | user | `demo` |
| `opportunity.saved` | `POST /opportunities/:id/save` | saved | user | – |
| `opportunity.apply_clicked` | browser, `src/components/app/opportunity-actions.tsx` | click on the external apply link | session user or NULL | – |
| `cv.uploaded` | `POST /files` | file stored (purpose `cv` **or** `evidence`) | user | `mime`, `ok` (text extracted without error) |
| `feedback.sent` | `POST /feedback` | feedback stored | session user or NULL | `kind` |
| `try.used` | `POST /try` | public demo used | NULL | `found` |
| `search.used` | `GET /search` | public search answered | NULL | `mode`, `results` |
| `page.viewed` | browser, `src/components/app/nav.tsx` (signed-in app shell only) | route change | session user or NULL | `page` (path with uuids → `:id`, ≤ 60 chars) |
| `client.error` | browser, `src/components/client-errors.tsx` (uncaught errors and rejections, ≤ 6 per page load) and `src/app/error.tsx` (error boundary) | front-end error | session user or NULL | `message` (≤ 80 after sanitising), `page` |

## 4. Query examples

Run these as a role that can read `events`, inside a transaction that starts with `SELECT set_config('app.role','system',true);` (RLS is forced).

**Weekly retention cohorts** (active = any event with a user id):

```sql
WITH cohort AS (
  SELECT user_id, date_trunc('week', min(created_at))::date AS cohort_week
    FROM events WHERE name = 'account.signed_up' AND user_id IS NOT NULL GROUP BY user_id
), activity AS (
  SELECT DISTINCT user_id, date_trunc('week', created_at)::date AS week
    FROM events WHERE user_id IS NOT NULL
)
SELECT c.cohort_week,
       (a.week - c.cohort_week) / 7      AS week_n,
       count(DISTINCT a.user_id)          AS active,
       round(100.0 * count(DISTINCT a.user_id)
             / (SELECT count(*) FROM cohort c2 WHERE c2.cohort_week = c.cohort_week), 1) AS pct
  FROM cohort c JOIN activity a USING (user_id)
 WHERE a.week >= c.cohort_week
 GROUP BY c.cohort_week, week_n
 ORDER BY c.cohort_week, week_n;
```

**Meaningful retention** (active = completed a plan task in that week):

```sql
WITH cohort AS (
  SELECT id AS user_id, date_trunc('week', created_at)::date AS cohort_week FROM users WHERE role = 'student'
)
SELECT c.cohort_week, (date_trunc('week', t.completed_at)::date - c.cohort_week) / 7 AS week_n,
       count(DISTINCT t.user_id) AS active
  FROM cohort c JOIN plan_tasks t ON t.user_id = c.user_id AND t.completed_at IS NOT NULL
 GROUP BY 1, 2 ORDER BY 1, 2;
```

**North Star by week:**

```sql
SELECT date_trunc('week', completed_at)::date AS week, count(DISTINCT user_id) AS north_star
  FROM plan_tasks WHERE completed_at IS NOT NULL AND kind IN ('prove','project')
 GROUP BY 1 ORDER BY 1;
```

**Assistant adoption** (share of weekly active users who chatted):

```sql
SELECT date_trunc('week', created_at)::date AS week,
       count(DISTINCT user_id) FILTER (WHERE name = 'chat.message')::float / nullif(count(DISTINCT user_id), 0) AS chat_share
  FROM events WHERE user_id IS NOT NULL GROUP BY 1 ORDER BY 1;
```
