/* Grants (or revokes with --revoke) the platform_admin role to an existing account.
 * Operator-only: requires direct database access. Usage: npm run admin:grant -- someone@example.com */
import { Client } from "pg";

async function main() {
  const email = process.argv.find((a) => a.includes("@"))?.toLowerCase();
  const revoke = process.argv.includes("--revoke");
  if (!email) throw new Error("usage: npm run admin:grant -- someone@example.com [--revoke]");
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
  await c.connect();
  await c.query("BEGIN");
  await c.query("SELECT set_config('app.role','system',true)");
  const r = await c.query(`UPDATE users SET role = $2 WHERE email = $1 RETURNING id`, [email, revoke ? "student" : "platform_admin"]);
  if (!r.rowCount) { await c.query("ROLLBACK"); throw new Error(`no account with email ${email} — sign up first`); }
  await c.query(`DELETE FROM sessions WHERE user_id = $1`, [r.rows[0].id]);
  await c.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES (NULL, $1, $2, '{"via":"cli"}')`, [revoke ? "admin.revoked" : "admin.granted", r.rows[0].id]);
  await c.query("COMMIT");
  console.log(`${email} is now ${revoke ? "a student" : "a platform admin"} (sessions reset)`);
  await c.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
