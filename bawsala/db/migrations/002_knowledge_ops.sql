-- BAWSALA — knowledge base (RAG), notifications, feature flags, feedback, uploads
-- Requires the pgvector extension (Supabase/Neon: enable "vector"; Ubuntu: postgresql-16-pgvector).
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------- knowledge base ----------
CREATE TABLE kb_documents (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,120}$'),
  title               text NOT NULL CHECK (length(title) BETWEEN 2 AND 300),
  kind                text NOT NULL CHECK (kind IN ('skill','occupation','pathway','resource','labor_market','institution','program','guide','policy')),
  language            text NOT NULL CHECK (language IN ('ar','ary','fr','en','zgh','multi')),
  geography           text NOT NULL DEFAULT 'MA',          -- ISO country code or 'INTL'
  source_name         text NOT NULL,
  source_url          text CHECK (source_url IS NULL OR source_url ~ '^https?://'),
  license             text,
  published_at        date,
  verified_at         date,
  -- verified  = checked against the primary source on verified_at
  -- unverified = transcribed / imported, must be re-checked before relying on it
  -- editorial = BAWSALA's own guidance (advice, not facts about third parties)
  verification_status text NOT NULL CHECK (verification_status IN ('verified','unverified','editorial')),
  confidence          text NOT NULL DEFAULT 'medium' CHECK (confidence IN ('high','medium','low')),
  version             integer NOT NULL DEFAULT 1,
  content_hash        text NOT NULL,
  content             text NOT NULL,
  status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_by          uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER kb_documents_touch BEFORE UPDATE ON kb_documents FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE kb_chunks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     uuid NOT NULL REFERENCES kb_documents(id) ON DELETE CASCADE,
  ord             integer NOT NULL,
  heading         text,
  content         text NOT NULL,
  search_text     text NOT NULL,              -- normalised text used for keyword search
  tsv             tsvector GENERATED ALWAYS AS (to_tsvector('simple', search_text)) STORED,
  embedding       vector(384),
  embedding_model text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, ord)
);
CREATE INDEX kb_chunks_tsv_idx ON kb_chunks USING gin (tsv);
CREATE INDEX kb_chunks_trgm_idx ON kb_chunks USING gin (search_text gin_trgm_ops);
CREATE INDEX kb_chunks_embedding_idx ON kb_chunks USING hnsw (embedding vector_cosine_ops);

-- Every retrieval is logged (query hash, not the text) for diagnostics and evaluation.
CREATE TABLE retrieval_log (
  id          bigserial PRIMARY KEY,
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  query_hash  text NOT NULL,
  query_lang  text,
  mode        text NOT NULL,                  -- hybrid | keyword | vector
  results     jsonb NOT NULL,                 -- [{chunk_id, doc_slug, vector_rank, keyword_rank, score}]
  latency_ms  integer NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- notifications ----------
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind        text NOT NULL CHECK (kind IN ('task_due','plan_ready','skill_suggestions','security','announcement','opportunity')),
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,     -- rendered client-side in the user's language
  dedupe_key  text,
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, dedupe_key)
);
CREATE INDEX notifications_user_idx ON notifications(user_id, created_at DESC);

CREATE TABLE notification_prefs (
  user_id        uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  in_app         boolean NOT NULL DEFAULT true,
  email_reminders boolean NOT NULL DEFAULT false,     -- opt-in
  email_security boolean NOT NULL DEFAULT true,
  unsubscribe_token text NOT NULL DEFAULT encode(gen_random_bytes(18), 'hex'),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Outbound email queue: rows are written by the app and delivered by a worker with retries.
CREATE TABLE email_outbox (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  to_email    text NOT NULL,
  template    text NOT NULL,
  locale      text NOT NULL,
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,
  status      text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','skipped')),
  attempts    smallint NOT NULL DEFAULT 0,
  last_error  text,
  provider_id text,
  send_after  timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  sent_at     timestamptz
);
CREATE INDEX email_outbox_queue_idx ON email_outbox(status, send_after);

-- ---------- feature flags & kill switches ----------
CREATE TABLE feature_flags (
  key         text PRIMARY KEY CHECK (key ~ '^[a-z0-9_.]{2,60}$'),
  enabled     boolean NOT NULL DEFAULT false,
  rollout     smallint NOT NULL DEFAULT 100 CHECK (rollout BETWEEN 0 AND 100),  -- % of users (stable hash)
  roles       text[] NOT NULL DEFAULT '{}',                                   -- empty = all roles
  description text NOT NULL DEFAULT '',
  updated_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
INSERT INTO feature_flags (key, enabled, description) VALUES
  ('ai.assistant', true,  'Career assistant (kill switch for all chat)'),
  ('ai.llm',       true,  'Use the external LLM when configured; off = basic engine only'),
  ('ai.analysis',  true,  'AI skill extraction from experiences (off = rules engine only)'),
  ('rag.search',   true,  'Knowledge-base retrieval in the assistant and search page'),
  ('signup.open',  true,  'Accept new registrations'),
  ('uploads.cv',   true,  'CV file upload (PDF/DOCX/TXT)');

-- ---------- feedback / support ----------
CREATE TABLE feedback (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  kind        text NOT NULL CHECK (kind IN ('bug','idea','question','privacy_request','other')),
  message     text NOT NULL CHECK (length(message) BETWEEN 3 AND 4000),
  page        text,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','closed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- uploaded files (CVs, evidence) ----------
-- Files are stored in the database (bytea) for the pilot: private by construction, covered by
-- backups and RLS, no extra vendor. Move to object storage when volume justifies it (see DEPLOYMENT.md).
CREATE TABLE user_files (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose       text NOT NULL CHECK (purpose IN ('cv','evidence')),
  filename      text NOT NULL CHECK (length(filename) <= 200),
  mime          text NOT NULL CHECK (mime IN ('application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain')),
  bytes         integer NOT NULL CHECK (bytes BETWEEN 1 AND 5242880),
  sha256        text NOT NULL,
  content       bytea NOT NULL,
  extracted_text text,
  extract_error text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX user_files_user_idx ON user_files(user_id, created_at DESC);

-- ---------- verification requests (human review queue) ----------
CREATE TABLE verification_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_skill_id uuid NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  note          text CHECK (length(note) <= 1000),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  review_note   text CHECK (length(review_note) <= 1000),
  created_at    timestamptz NOT NULL DEFAULT now(),
  reviewed_at   timestamptz,
  UNIQUE (user_skill_id, institution_id)
);

-- ---------- RLS ----------
ALTER TABLE kb_documents ENABLE ROW LEVEL SECURITY; ALTER TABLE kb_documents FORCE ROW LEVEL SECURITY;
CREATE POLICY read_active ON kb_documents FOR SELECT USING (status = 'active' OR app_is_system());
CREATE POLICY system_write ON kb_documents USING (app_is_system()) WITH CHECK (app_is_system());
ALTER TABLE kb_chunks ENABLE ROW LEVEL SECURITY; ALTER TABLE kb_chunks FORCE ROW LEVEL SECURITY;
CREATE POLICY read_all ON kb_chunks FOR SELECT USING (true);
CREATE POLICY system_write ON kb_chunks USING (app_is_system()) WITH CHECK (app_is_system());

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['notifications','notification_prefs','user_files','verification_requests']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY owner_rw ON %I USING (app_is_system() OR user_id = app_user_id())
                      WITH CHECK (app_is_system() OR user_id = app_user_id())$p$, t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['retrieval_log','email_outbox']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY system_only ON %I USING (app_is_system()) WITH CHECK (app_is_system())$p$, t);
  END LOOP;
END $$;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY; ALTER TABLE feature_flags FORCE ROW LEVEL SECURITY;
CREATE POLICY read_all ON feature_flags FOR SELECT USING (true);
CREATE POLICY system_write ON feature_flags USING (app_is_system()) WITH CHECK (app_is_system());
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY; ALTER TABLE feedback FORCE ROW LEVEL SECURITY;
CREATE POLICY own_insert ON feedback FOR INSERT WITH CHECK (user_id = app_user_id() OR app_is_system());
CREATE POLICY system_rw ON feedback USING (app_is_system()) WITH CHECK (app_is_system());
CREATE POLICY own_retrieval ON retrieval_log FOR INSERT WITH CHECK (user_id = app_user_id());

-- Opportunity verification metadata (real vs imported vs demo) and eligibility/deadline.
ALTER TABLE opportunities
  ADD COLUMN verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('verified','unverified','demo')),
  ADD COLUMN last_verified_at timestamptz,
  ADD COLUMN eligibility jsonb,
  ADD COLUMN deadline date,
  ADD COLUMN published_at date;
UPDATE opportunities SET verification_status = 'demo' WHERE is_sample;
ALTER TABLE opportunities ADD CONSTRAINT opp_demo_consistent CHECK ((verification_status = 'demo') = is_sample);
