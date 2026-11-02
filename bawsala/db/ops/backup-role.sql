-- Run once as a superuser / the managed provider's admin role.
-- Logical backups must bypass row-level security (FORCE RLS applies even to the table owner),
-- so they run as a dedicated read-only role — never with the application's credentials.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bawsala_backup') THEN
    CREATE ROLE bawsala_backup LOGIN BYPASSRLS PASSWORD 'change-me-in-the-secret-store';
  END IF;
END $$;
GRANT pg_read_all_data TO bawsala_backup;   -- PostgreSQL 14+: read-only on every table
