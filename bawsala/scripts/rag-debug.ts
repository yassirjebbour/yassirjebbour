/* Prints hybrid retrieval diagnostics for a query: npm run -s rag:debug -- "query" */
import { retrieve } from "../src/server/rag/retrieve";
import { closeDb } from "../src/server/db";
(async () => {
  const q = process.argv.slice(2).join(" ");
  const r = await retrieve(q, { k: 8, log: false });
  console.log(`mode=${r.mode} variants=${JSON.stringify(r.variants)} ${r.latencyMs}ms`);
  for (const x of r.results) console.log(`${x.score.toFixed(4)} v=${x.vectorRank ?? "-"} kw=${x.keywordRank ?? "-"}  ${x.doc.slug} :: ${(x.heading ?? "").slice(0, 60)}`);
  await closeDb();
})();
