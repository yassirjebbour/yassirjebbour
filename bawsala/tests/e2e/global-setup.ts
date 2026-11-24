import { Client } from "pg";
/** E2E runs share one client IP ("direct"); clear rate-limit counters so repeated runs start clean. */
export default async function setup() {
  const c = new Client({ connectionString: process.env.E2E_DATABASE_URL ?? "postgres://bawsala:bawsala@localhost:5432/bawsala_test" });
  await c.connect();
  await c.query("BEGIN; SELECT set_config('app.role','system',true); DELETE FROM rate_limits; COMMIT;");
  await c.end();
}
