/* Seeds reference data: the skills catalogue and the sample (demo) roles.
 * Idempotent: safe to run on every deploy. Demo roles are always flagged is_sample / verification 'demo'. */
import { Client } from "pg";
import { SKILLS, SAMPLE_OPPORTUNITIES, CITIES } from "../src/server/domain/catalog";

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
  await client.connect();
  await client.query("BEGIN");
  await client.query("SELECT set_config('app.role','system',true)");
  for (const s of SKILLS) {
    await client.query(
      `INSERT INTO skills (id, category, names, learn_url, learn_title, learn_hours) VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET category = EXCLUDED.category, names = EXCLUDED.names, learn_url = EXCLUDED.learn_url,
         learn_title = EXCLUDED.learn_title, learn_hours = EXCLUDED.learn_hours`,
      [s.id, s.category, s.names, s.learn?.url ?? null, s.learn?.title ?? null, s.learn?.hours ?? null],
    );
  }
  const withSeed = process.env.SEED_DEMO_OPPORTUNITIES !== "false";
  if (withSeed) {
    for (const o of SAMPLE_OPPORTUNITIES) {
      const city = CITIES[o.city]?.fr ?? o.city;
      const desc = {
        en: `Illustrative role used to demonstrate matching. ${o.organization} is a fictional organisation.`,
        fr: `Poste illustratif utilisé pour démontrer la correspondance. ${o.organization} est une organisation fictive.`,
        ar: `وظيفة توضيحية لعرض طريقة المطابقة. ${o.organization} مؤسسة وهمية.`,
      };
      const r = await client.query(
        `INSERT INTO opportunities (slug, title, organization, city, remote, kind, description, project_brief, source_name, is_sample, verification_status, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'BAWSALA demo data', true, 'demo', 'published')
         ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, organization = EXCLUDED.organization, city = EXCLUDED.city,
           remote = EXCLUDED.remote, kind = EXCLUDED.kind, description = EXCLUDED.description, project_brief = EXCLUDED.project_brief
         RETURNING id`,
        ["demo-" + o.slug, o.title, o.organization, city, o.city === "remote", o.kind, desc, o.project ?? null],
      );
      const id = r.rows[0].id;
      await client.query(`DELETE FROM opportunity_skills WHERE opportunity_id = $1`, [id]);
      for (const s of o.required) await client.query(`INSERT INTO opportunity_skills VALUES ($1,$2,true) ON CONFLICT DO NOTHING`, [id, s]);
      for (const s of o.nice) await client.query(`INSERT INTO opportunity_skills VALUES ($1,$2,false) ON CONFLICT DO NOTHING`, [id, s]);
    }
  }
  await client.query("COMMIT");
  console.log(`seeded ${SKILLS.length} skills${withSeed ? `, ${SAMPLE_OPPORTUNITIES.length} demo roles` : ""}`);
  await client.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
