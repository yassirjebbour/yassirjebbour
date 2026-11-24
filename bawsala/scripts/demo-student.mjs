#!/usr/bin/env node
/**
 * Creates a realistic demo student through the public API (never touches the database directly),
 * so screens can be reviewed with real data: experiences in Darija, accepted and pending skills,
 * proof, a target role and a 30-day path with progress.
 *
 *   node scripts/demo-student.mjs [baseUrl] [email]
 *
 * Development and QA only: it signs up a new account on the server you point it at.
 */
const BASE = (process.argv[2] || process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
const EMAIL = process.argv[3] || `salma.demo.${Date.now()}@example.test`;
const PASSWORD = process.env.DEMO_PASSWORD || "Bawsala-demo-2026!";
let cookie = "";

async function call(method, path, body) {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method,
    headers: { "content-type": "application/json", origin: BASE, ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const set = res.headers.getSetCookie?.() ?? [];
  for (const c of set) if (c.startsWith("bawsala_session=")) cookie = c.split(";")[0];
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 200)}`);
  return data;
}

await call("POST", "/auth/signup", { name: "Salma Bennani", email: EMAIL, password: PASSWORD, locale: "ary", consent: true });
await call("PATCH", "/profile", {
  situation: "student", field_of_study: "Économie et gestion", education_level: "licence", school: "FSJES Tanger", city: "Tanger",
  languages: ["ary", "ar", "fr", "en"], goal: "Nlqa stage f logistique ola commerce f Tanja.", onboarded: true,
});
const exps = [
  { kind: "family", title: "Lhanout dyal l3a2ila", organization: "Épicerie Bennani", started_on: "2022-06",
    description: "كنعاون الواليد فالحانوت ديال العائلة كل سيمانة: كنسيّر الكاسة، كنهضر مع الكليان، وكنتبع السلعة فExcel باش ما يخصّناش شي حاجة. نقصنا الخسارة ديال السلعة ب 15%." },
  { kind: "club", title: "Club Enactus FSJES", organization: "Enactus", started_on: "2024-10",
    description: "نظّمت مع الفريق ديالي حدث فالكلية فيه 120 طالب: درت التنسيق مع المتطوعين، والتواصل على إنستغرام، وقدّمت المشروع قدّام لجنة." },
];
for (const e of exps) {
  const exp = await call("POST", "/experiences", e);
  await call("POST", `/experiences/${exp.id}/analyze`, {});
}
const passport = await call("GET", "/passport");
const sugg = passport.suggestions;
for (const s of sugg.slice(0, Math.max(0, sugg.length - 1))) await call("POST", `/suggestions/${s.id}/accept`, {});
const accepted = (await call("GET", "/passport")).skills.map((s) => s.skill_id);
const proofs = [
  ["excel", { kind: "link", url: "https://example.com/salma/stock-sheet", text: "Tableau de suivi du stock hebdomadaire : −15 % de pertes en 3 mois." }],
  ["customer_service", { kind: "project", url: null, text: "Kola nhar sebt: 40 klyan f nhar, w zero chikaya f had chhar." }],
];
for (const [id, body] of proofs) if (accepted.includes(id)) await call("POST", `/skills/${id}/evidence`, body);
const opps = await call("GET", "/opportunities");
const list = Array.isArray(opps) ? opps : opps.items ?? [];
const top = list[0]?.item ?? list[0];
if (top?.id) {
  await call("POST", `/opportunities/${top.id}/target`, {});
  await call("POST", "/plan", { opportunityId: top.id, days: 30 });
  const plan = await call("GET", "/plan");
  const tasks = (plan?.tasks ?? plan?.plan?.tasks ?? []).filter((t) => t.kind === "learn" || t.kind === "practice").slice(0, 4);
  for (const t of tasks) await call("POST", `/plan/tasks/${t.id}/complete`, { url: null, note: null });
}
console.log(JSON.stringify({ base: BASE, email: EMAIL, password: PASSWORD, skills: accepted.length, pending: 1, target: top?.id ?? null }));
