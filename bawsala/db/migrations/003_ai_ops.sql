-- AI operations: cost attribution, prompt/model versions, cache tokens, retrieval citations.
ALTER TABLE ai_usage
  ADD COLUMN model text,
  ADD COLUMN prompt_version text,
  ADD COLUMN cache_read_tokens integer NOT NULL DEFAULT 0,
  ADD COLUMN cache_write_tokens integer NOT NULL DEFAULT 0,
  ADD COLUMN est_cost_usd numeric(10,6) NOT NULL DEFAULT 0,
  ADD COLUMN error_code text;
CREATE INDEX ai_usage_feature_day_idx ON ai_usage(feature, created_at);
ALTER TABLE messages ADD COLUMN citations jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE messages ADD COLUMN prompt_version text;
-- the platform admin may read usage for monitoring through asSystem; students read their own (policy own_usage_read)
