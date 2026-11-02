-- Consent record for the terms/privacy notice accepted at sign-up (version identifies the text).
ALTER TABLE users ADD COLUMN terms_accepted_at timestamptz, ADD COLUMN terms_version text;
