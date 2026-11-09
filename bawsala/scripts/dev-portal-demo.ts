/**
 * LOCAL REVIEW DATA ONLY. Fills the institution of a given institution admin with six example students
 * who share their passport, plus one pending verification request, so the institution portal and the
 * admin console can be reviewed with realistic data.
 *
 * It calls the repository functions directly (the same path the integration tests use), so it never
 * touches HTTP endpoints or their rate limits. It refuses to run against a non-local database.
 *
 *   node --conditions=react-server --import tsx scripts/dev-portal-demo.ts portal.inst@example.test
 */
import { signUp } from "../src/server/repo/account";
import { updateProfile } from "../src/server/repo/profile";
import { declareSkill, addEvidence } from "../src/server/repo/skills";
import { asSystem, asUser, closeDb } from "../src/server/db";

const url = process.env.DATABASE_URL ?? "";
if (!/@(localhost|127\.0\.0\.1)(:\d+)?\//.test(url) || process.env.NODE_ENV === "production") {
  console.error("refusing: this script only runs against a local development database");
  process.exit(1);
}

const SETS = [
  ["customer_service", "excel", "inventory"], ["event", "teamwork", "social_media"], ["presentation", "multilingual", "research"],
  ["customer_service", "sales", "negotiation"], ["excel", "data_analysis", "teamwork"], ["leadership", "event", "customer_service"],
];

(async () => {
  const email = process.argv[2];
  if (!email) throw new Error("usage: dev-portal-demo.ts <institution-admin-email>");
  const inst = await asSystem((tx) => tx.one<{ join_code: string; name: string }>(
    `SELECT i.join_code, i.name FROM users u JOIN institutions i ON i.id = u.institution_id WHERE u.email = $1 AND u.role = 'institution_admin'`, [email]));
  if (!inst) throw new Error(`${email} is not an institution admin`);
  const tag = Date.now();
  let lastId = "";
  for (let i = 0; i < SETS.length; i++) {
    const id = await signUp({ email: `demo.student${i + 1}.${tag}@example.test`, password: `local-only-${tag}`, name: `Étudiant·e ${i + 1} (exemple)`, locale: "fr", joinCode: inst.join_code });
    await updateProfile(id, { onboarded: true, share_with_institution: true });
    for (const s of SETS[i]) await declareSkill(id, s);
    if (i % 2 === 0) await addEvidence(id, SETS[i][0], { kind: "link", url: "https://example.com/proof", text: "Exemple de preuve (données de démonstration)" });
    lastId = id;
  }
  // One pending verification request, created exactly as the verify-request endpoint does.
  await asUser(lastId, async (tx) => {
    const us = await tx.one<{ id: string }>(`SELECT id FROM user_skills WHERE user_id = $1 AND skill_id = $2`, [lastId, SETS[5][0]]);
    const u = await tx.one<{ institution_id: string }>(`SELECT institution_id FROM users WHERE id = $1`, [lastId]);
    await tx.query(`INSERT INTO verification_requests (user_id, user_skill_id, institution_id, note) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`, [lastId, us!.id, u!.institution_id, "J'ai animé l'accueil du forum (exemple)."]);
  });
  console.log(`added ${SETS.length} example students to ${inst.name}`);
  await closeDb();
})();
