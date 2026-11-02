/* Recreates the test database schema from migrations, then seeds reference data and the knowledge base.
 * Integration tests run against real PostgreSQL (with RLS, pgvector) — no mocks of the database. */
import { execSync } from "node:child_process";
import { Client } from "pg";

export default async function setup() {
  const url = process.env.TEST_DATABASE_URL ?? "postgres://bawsala:bawsala@localhost:5432/bawsala_test";
  if (!/test/.test(url)) throw new Error("Refusing to reset a database whose name does not contain 'test'");
  const c = new Client({ connectionString: url });
  await c.connect();
  // Drop the application's objects but keep extensions (pgvector needs a superuser to create, and the
  // app role is deliberately NOT a superuser — superusers bypass row-level security).
  await c.query(`DO $$ DECLARE r record; BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', r.tablename); END LOOP;
    FOR r IN SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace LEFT JOIN pg_depend d ON d.objid = t.oid AND d.deptype = 'e'
              WHERE n.nspname = 'public' AND t.typtype = 'e' AND d.objid IS NULL LOOP EXECUTE format('DROP TYPE IF EXISTS %I CASCADE', r.typname); END LOOP;
    FOR r IN SELECT p.proname, pg_get_function_identity_arguments(p.oid) args FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
              LEFT JOIN pg_depend d ON d.objid = p.oid AND d.deptype = 'e' WHERE n.nspname = 'public' AND d.objid IS NULL
             LOOP EXECUTE format('DROP FUNCTION IF EXISTS %I(%s) CASCADE', r.proname, r.args); END LOOP;
  END $$;`);
  await c.end();
  const env = { ...process.env, DATABASE_URL: url };
  execSync("npx tsx scripts/migrate.ts", { env, stdio: "pipe" });
  execSync("node --conditions=react-server --import tsx scripts/seed.ts", { env, stdio: "pipe" });
  if (process.env.EMBEDDINGS_PROVIDER !== "none") execSync("node --conditions=react-server --import tsx scripts/kb-ingest.ts", { env, stdio: "pipe" });
}
