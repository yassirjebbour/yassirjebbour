/**
 * AI evaluation runner. Measures, on labelled datasets:
 *   1. Retrieval: hit@1, recall@5, MRR, latency — per language and per configuration (ablation).
 *   2. Skill extraction (rules engine always; + LLM when ANTHROPIC_API_KEY is set): precision, recall,
 *      forbidden-skill violations, ungrounded quotes discarded, latency, cost.
 * Writes docs/eval/results-<date>.json. Usage: npm run eval:ai [-- --llm]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { QUERIES } from "../tests/fixtures/retrieval";
import { CASES } from "../tests/fixtures/skill-extraction";
import { retrieve, type RetrievalMode } from "../src/server/rag/retrieve";
import { detectSkills } from "../src/server/domain/skills-engine";
import { analyzeText } from "../src/server/ai/analysis";
import { getProvider } from "../src/server/ai/providers";
import { closeDb, asSystem } from "../src/server/db";

type Cfg = { name: string; mode: RetrievalMode; weights?: { vector: number; keyword: number }; stopwords?: boolean };
const CONFIGS: Cfg[] = [
  { name: "vector only", mode: "vector" },
  { name: "keyword only", mode: "keyword" },
  { name: "hybrid RRF 1:1, no stopwords", mode: "hybrid", weights: { vector: 1, keyword: 1 }, stopwords: false },
  { name: "hybrid RRF 1:1 + stopwords (default)", mode: "hybrid", weights: { vector: 1, keyword: 1 } },
  { name: "hybrid RRF 1:0.5 + stopwords", mode: "hybrid", weights: { vector: 1, keyword: 0.5 } },
  { name: "hybrid RRF 1:0.25 + stopwords", mode: "hybrid", weights: { vector: 1, keyword: 0.25 } },
];

async function evalRetrieval() {
  const out: Record<string, unknown> = {};
  for (const cfg of CONFIGS) {
    const byLang: Record<string, { n: number; hit1: number; recall5: number; mrr: number; ms: number[] }> = {};
    const misses: string[] = [];
    for (const q of QUERIES) {
      const r = await retrieve(q.q, { k: 5, mode: cfg.mode, weights: cfg.weights, stopwords: cfg.stopwords, log: false });
      const docs = [...new Set(r.results.map((x) => x.doc.slug))];
      const firstHit = docs.findIndex((d) => q.expect.includes(d));
      const m = (byLang[q.lang] ??= { n: 0, hit1: 0, recall5: 0, mrr: 0, ms: [] });
      m.n++; m.ms.push(r.latencyMs);
      if (firstHit === 0) m.hit1++;
      if (firstHit >= 0) { m.recall5++; m.mrr += 1 / (firstHit + 1); } else misses.push(`[${q.lang}] ${q.q} → ${docs.slice(0, 3).join(", ")}`);
    }
    const all = Object.values(byLang).reduce((a, m) => ({ n: a.n + m.n, hit1: a.hit1 + m.hit1, recall5: a.recall5 + m.recall5, mrr: a.mrr + m.mrr, ms: [...a.ms, ...m.ms] }), { n: 0, hit1: 0, recall5: 0, mrr: 0, ms: [] as number[] });
    const fmt = (m: typeof all) => ({ n: m.n, hit_at_1: +(m.hit1 / m.n).toFixed(3), recall_at_5: +(m.recall5 / m.n).toFixed(3), mrr: +(m.mrr / m.n).toFixed(3), p50_ms: m.ms.sort((a, b) => a - b)[Math.floor(m.ms.length / 2)] });
    out[cfg.name] = { overall: fmt(all), by_language: Object.fromEntries(Object.entries(byLang).map(([l, m]) => [l, fmt(m)])), misses };
    console.log(`${cfg.name.padEnd(42)} hit@1 ${fmt(all).hit_at_1}  R@5 ${fmt(all).recall_at_5}  MRR ${fmt(all).mrr}  p50 ${fmt(all).p50_ms}ms`);
  }
  return out;
}

function prf(results: Array<{ got: string[]; expected: string[]; forbidden?: string[] }>) {
  let tp = 0, fp = 0, fn = 0, forbidden = 0;
  for (const r of results) {
    const exp = new Set(r.expected);
    for (const g of r.got) (exp.has(g) ? tp++ : fp++);
    for (const e of exp) if (!r.got.includes(e)) fn++;
    for (const f of r.forbidden ?? []) if (r.got.includes(f)) forbidden++;
  }
  return { precision: +(tp / Math.max(1, tp + fp)).toFixed(3), recall: +(tp / Math.max(1, tp + fn)).toFixed(3), forbidden_violations: forbidden };
}

async function evalExtraction(useLlm: boolean) {
  const langs = [...new Set(CASES.map((c) => c.lang))];
  const rules = Object.fromEntries(langs.map((l) => [l, prf(CASES.filter((c) => c.lang === l).map((c) => ({ got: detectSkills(c.text).map((d) => d.skillId), expected: c.expected, forbidden: c.forbidden })))]));
  const out: Record<string, unknown> = { rules: { overall: prf(CASES.map((c) => ({ got: detectSkills(c.text).map((d) => d.skillId), expected: c.expected, forbidden: c.forbidden }))), by_language: rules } };
  console.log("rules engine:", JSON.stringify((out.rules as { overall: unknown }).overall));
  if (useLlm && getProvider()) {
    const rows: Array<{ lang: string; got: string[]; expected: string[]; forbidden?: string[]; ms: number; discarded: number }> = [];
    for (const c of CASES) {
      const t0 = Date.now();
      const r = await analyzeText(c.text, { userId: null, allowLlm: true });
      rows.push({ lang: c.lang, got: r.candidates.map((x) => x.skillId), expected: c.expected, forbidden: c.forbidden, ms: Date.now() - t0, discarded: r.discardedHallucinations });
    }
    const cost = await asSystem((tx) => tx.one<{ c: string; n: number }>(`SELECT coalesce(sum(est_cost_usd),0)::text c, count(*)::int n FROM ai_usage WHERE feature = 'skill_extraction' AND created_at > now() - interval '1 hour'`));
    out.llm = {
      overall: prf(rows), by_language: Object.fromEntries(langs.map((l) => [l, prf(rows.filter((r) => r.lang === l))])),
      ungrounded_quotes_discarded: rows.reduce((a, r) => a + r.discarded, 0),
      p50_ms: rows.map((r) => r.ms).sort((a, b) => a - b)[Math.floor(rows.length / 2)], est_cost_usd: Number(cost?.c ?? 0), calls: cost?.n,
    };
    console.log("llm+rules:", JSON.stringify((out.llm as { overall: unknown }).overall));
  } else out.llm = "not run (no ANTHROPIC_API_KEY or --llm not passed)";
  return out;
}

(async () => {
  const useLlm = process.argv.includes("--llm");
  const result = { date: new Date().toISOString(), dataset: { retrieval_queries: QUERIES.length, extraction_cases: CASES.length }, retrieval: await evalRetrieval(), extraction: await evalExtraction(useLlm) };
  mkdirSync("docs/eval", { recursive: true });
  const file = `docs/eval/results-${result.date.slice(0, 10)}.json`;
  writeFileSync(file, JSON.stringify(result, null, 2));
  console.log("wrote", file);
  await closeDb();
})();
