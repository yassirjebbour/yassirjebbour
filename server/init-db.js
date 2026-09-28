// Applies db/schema.sql if the database has no tables yet.
const fs = require('fs'), path = require('path'), { Pool } = require('pg');
(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query("SELECT to_regclass('public.repair_tickets') AS t");
  if (rows[0].t) console.log('Schema already present — nothing to do.');
  else { await pool.query(fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8')); console.log('Schema created.'); }
  await pool.end();
})().catch(e => { console.error(e.message); process.exit(1); });
