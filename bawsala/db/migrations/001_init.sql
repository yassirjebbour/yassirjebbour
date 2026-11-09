-- BAWSALA — initial schema
-- Conventions: every table that holds a student's data carries user_id and is protected by
-- row-level security (RLS). The application sets `app.user_id` (and optionally `app.role`)
-- per transaction; see src/server/db/index.ts (asUser / asSystem).

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------- helpers ----------
CREATE OR REPLACE FUNCTION app_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION app_is_system() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT coalesce(current_setting('app.role', true), '') = 'system'
$$;

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ---------- organisations ----------
CREATE TABLE institutions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL CHECK (length(name) BETWEEN 2 AND 200),
  city        text,
  join_code   text UNIQUE NOT NULL DEFAULT upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- accounts ----------
CREATE TYPE user_role AS ENUM ('student', 'institution_admin', 'platform_admin');

CREATE TABLE users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          citext UNIQUE NOT NULL CHECK (length(email) <= 254),
  password_hash  text NOT NULL,
  name           text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  locale         text NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar','ary','fr','en','zgh')),
  role           user_role NOT NULL DEFAULT 'student',
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  email_verified_at timestamptz,
  last_active_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER users_touch BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Session id is SHA-256(token); the raw token only ever lives in the user's cookie.
CREATE TABLE sessions (
  id           text PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  user_agent   text,
  ip           text
);
CREATE INDEX sessions_user_idx ON sessions(user_id);
CREATE INDEX sessions_expiry_idx ON sessions(expires_at);

CREATE TABLE auth_tokens (
  id         text PRIMARY KEY,               -- SHA-256 of the emailed token
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    text NOT NULL CHECK (purpose IN ('password_reset','email_verify')),
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rate_limits (
  key          text NOT NULL,
  window_start timestamptz NOT NULL,
  count        integer NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

-- ---------- profile ----------
CREATE TABLE profiles (
  user_id          uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  situation        text CHECK (situation IN ('student','graduate','job_seeker','employed','other')),
  field_of_study   text CHECK (length(field_of_study) <= 160),
  education_level  text CHECK (education_level IN ('bac','bac2','licence','master','doctorate','vocational','other')),
  school           text CHECK (length(school) <= 200),
  graduation_year  smallint CHECK (graduation_year BETWEEN 1970 AND 2100),
  city             text CHECK (length(city) <= 120),
  languages        text[] NOT NULL DEFAULT '{}',
  goal             text CHECK (length(goal) <= 600),
  target_opportunity_id uuid,
  share_with_institution boolean NOT NULL DEFAULT false,
  onboarded_at     timestamptz,
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER profiles_touch BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE experiences (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         text NOT NULL CHECK (kind IN ('job','internship','volunteer','project','family','club','education','course','other')),
  title        text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  organization text CHECK (length(organization) <= 200),
  description  text NOT NULL CHECK (length(description) BETWEEN 1 AND 4000),
  started_on   date,
  ended_on     date,
  analyzed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX experiences_user_idx ON experiences(user_id, created_at DESC);
CREATE TRIGGER experiences_touch BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- skills ----------
CREATE TABLE skills (
  id        text PRIMARY KEY CHECK (id ~ '^[a-z0-9_]{2,40}$'),
  category  text NOT NULL,
  names     jsonb NOT NULL,          -- {"en": "...", "fr": "...", "ar": "...", "ary"?: "...", "zgh"?: "..."}
  learn_url text,
  learn_title jsonb,
  learn_hours smallint
);

-- declared  = the student said it (no evidence yet)
-- inferred  = BAWSALA detected it in the student's own words, the student confirmed it
-- evidenced = at least one piece of proof is attached (project, link, completed proof task)
-- verified  = a third party (institution / employer) verified it
CREATE TYPE skill_status AS ENUM ('declared','inferred','evidenced','verified');

CREATE TABLE user_skills (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id    text NOT NULL REFERENCES skills(id),
  status      skill_status NOT NULL,
  level       smallint NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 4),
  source      text NOT NULL CHECK (source IN ('user','ai','rules')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id)
);
CREATE TRIGGER user_skills_touch BEFORE UPDATE ON user_skills FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE skill_evidence (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_skill_id uuid NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
  kind          text NOT NULL CHECK (kind IN ('quote','project','link','certificate','task')),
  experience_id uuid REFERENCES experiences(id) ON DELETE SET NULL,
  plan_task_id  uuid,
  text          text CHECK (length(text) <= 2000),
  url           text CHECK (url IS NULL OR url ~ '^https?://' AND length(url) <= 2000),
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX skill_evidence_skill_idx ON skill_evidence(user_skill_id);

-- Suggestions waiting for the student's yes/no. Nothing enters the passport without consent.
CREATE TABLE skill_suggestions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id      text NOT NULL REFERENCES skills(id),
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE,
  quote         text NOT NULL CHECK (length(quote) <= 1000),
  reason        text CHECK (length(reason) <= 600),
  source        text NOT NULL CHECK (source IN ('ai','rules')),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id, experience_id)
);

-- ---------- opportunities ----------
CREATE TABLE opportunities (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE,
  title             jsonb NOT NULL,                -- localized {"en","fr","ar",...}
  organization      text NOT NULL,
  city              text,
  remote            boolean NOT NULL DEFAULT false,
  kind              text NOT NULL CHECK (kind IN ('job','internship','training','volunteer','program')),
  description       jsonb NOT NULL DEFAULT '{}'::jsonb,
  project_brief     jsonb,                          -- the "Day 30" portfolio project for this role
  apply_url         text CHECK (apply_url IS NULL OR apply_url ~ '^https?://'),
  source_name       text NOT NULL,
  source_url        text CHECK (source_url IS NULL OR source_url ~ '^https?://'),
  is_sample         boolean NOT NULL DEFAULT false,  -- illustrative data, always labeled in the UI
  status            text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  source_updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at        timestamptz,
  created_by        uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (is_sample OR source_url IS NOT NULL)        -- real opportunities must cite their source
);
CREATE TRIGGER opportunities_touch BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE opportunity_skills (
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  skill_id       text NOT NULL REFERENCES skills(id),
  required       boolean NOT NULL DEFAULT true,
  PRIMARY KEY (opportunity_id, skill_id)
);

ALTER TABLE profiles ADD CONSTRAINT profiles_target_fk
  FOREIGN KEY (target_opportunity_id) REFERENCES opportunities(id) ON DELETE SET NULL;

CREATE TABLE saved_opportunities (
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status         text NOT NULL DEFAULT 'saved' CHECK (status IN ('saved','preparing','applied')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, opportunity_id)
);

-- ---------- roadmap ----------
CREATE TABLE plans (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL,
  title          text NOT NULL CHECK (length(title) <= 200),
  status         text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','archived')),
  starts_on      date NOT NULL DEFAULT current_date,
  ends_on        date NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX plans_one_active ON plans(user_id) WHERE status = 'active';

CREATE TABLE plan_tasks (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id           uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position          smallint NOT NULL,
  kind              text NOT NULL CHECK (kind IN ('learn','practice','prove','apply','project')),
  title             text NOT NULL CHECK (length(title) <= 300),
  detail            text CHECK (length(detail) <= 2000),
  skill_id          text REFERENCES skills(id),
  resource_url      text,
  estimated_minutes smallint,
  due_on            date NOT NULL,
  completed_at      timestamptz,
  proof_url         text CHECK (proof_url IS NULL OR proof_url ~ '^https?://'),
  proof_note        text CHECK (length(proof_note) <= 2000)
);
CREATE INDEX plan_tasks_plan_idx ON plan_tasks(plan_id, position);

-- ---------- assistant ----------
CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      text NOT NULL DEFAULT '' CHECK (length(title) <= 160),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX conversations_user_idx ON conversations(user_id, updated_at DESC);

CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user','assistant')),
  content         text NOT NULL DEFAULT '',
  tool_calls      jsonb NOT NULL DEFAULT '[]'::jsonb,   -- [{name, input, output, ok}] shown in the UI
  status          text NOT NULL DEFAULT 'complete' CHECK (status IN ('complete','stopped','error')),
  feedback        smallint CHECK (feedback IN (-1, 1)),
  engine          text,                                  -- model id or 'basic'
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_conv_idx ON messages(conversation_id, created_at);

-- Effects the assistant proposes; applied only after the student confirms.
CREATE TABLE pending_actions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  kind            text NOT NULL CHECK (kind IN ('create_plan','add_skills','set_goal','save_opportunity')),
  payload         jsonb NOT NULL,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  resolved_at     timestamptz
);

CREATE TABLE ai_usage (
  id            bigserial PRIMARY KEY,
  user_id       uuid REFERENCES users(id) ON DELETE SET NULL,
  feature       text NOT NULL,
  engine        text NOT NULL,
  input_tokens  integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  ok            boolean NOT NULL,
  latency_ms    integer,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ai_usage_user_day_idx ON ai_usage(user_id, created_at);

-- Product analytics (first-party, no third-party trackers).
CREATE TABLE events (
  id         bigserial PRIMARY KEY,
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  name       text NOT NULL CHECK (name ~ '^[a-z_.]{2,60}$'),
  props      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_name_day_idx ON events(name, created_at);

CREATE TABLE audit_log (
  id         bigserial PRIMARY KEY,
  actor_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  action     text NOT NULL,
  target     text,
  meta       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- row-level security ----------
-- Owner-scoped tables: a row is visible only to its owner, or to trusted server code that
-- explicitly runs as 'system' (auth, admin, aggregated institution reports).
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','experiences','user_skills','skill_evidence','skill_suggestions',
                           'saved_opportunities','plans','plan_tasks','conversations','messages',
                           'pending_actions']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY owner_rw ON %I USING (app_is_system() OR user_id = app_user_id())
                      WITH CHECK (app_is_system() OR user_id = app_user_id())$p$, t);
  END LOOP;
END $$;

-- Users: a student can read/update their own row only.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
CREATE POLICY self_rw ON users USING (app_is_system() OR id = app_user_id())
  WITH CHECK (app_is_system() OR id = app_user_id());

-- Sessions / tokens / rate limits / usage / audit are server-only.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sessions','auth_tokens','rate_limits','ai_usage','audit_log','events']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY system_only ON %I USING (app_is_system()) WITH CHECK (app_is_system())$p$, t);
  END LOOP;
END $$;
-- Students may record their own analytics events and AI usage.
CREATE POLICY own_events ON events FOR INSERT WITH CHECK (user_id = app_user_id());
CREATE POLICY own_usage ON ai_usage FOR INSERT WITH CHECK (user_id = app_user_id());
CREATE POLICY own_usage_read ON ai_usage FOR SELECT USING (user_id = app_user_id());

-- Public reference data: readable by anyone, writable only by system.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['skills','opportunities','opportunity_skills','institutions']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY read_all ON %I FOR SELECT USING (true)$p$, t);
    EXECUTE format($p$CREATE POLICY system_write ON %I USING (app_is_system()) WITH CHECK (app_is_system())$p$, t);
  END LOOP;
END $$;
