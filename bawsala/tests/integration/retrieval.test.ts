import { describe, expect, it } from "vitest";
import { retrieve } from "@/server/rag/retrieve";
import { QUERIES } from "../fixtures/retrieval";
import { asSystem } from "@/server/db";

describe("RAG retrieval quality (labelled multilingual set)", () => {
  it("hybrid retrieval meets recall floors overall and for Latin-script Darija", async () => {
    let hits = 0, mrr = 0;
    const lat = { n: 0, hits: 0 };
    for (const q of QUERIES) {
      const r = await retrieve(q.q, { k: 5, log: false });
      const docs = [...new Set(r.results.map((x) => x.doc.slug))];
      const pos = docs.findIndex((d) => q.expect.includes(d));
      if (pos >= 0) { hits++; mrr += 1 / (pos + 1); }
      if (q.lang === "ary_lat") { lat.n++; if (pos >= 0) lat.hits++; }
    }
    const recall5 = hits / QUERIES.length;
    console.log(`[eval] retrieval recall@5=${recall5.toFixed(3)} mrr=${(mrr / QUERIES.length).toFixed(3)} ary_lat recall@5=${(lat.hits / lat.n).toFixed(3)}`);
    expect(recall5).toBeGreaterThanOrEqual(0.9);
    expect(mrr / QUERIES.length).toBeGreaterThanOrEqual(0.75);
    expect(lat.hits / lat.n).toBeGreaterThanOrEqual(0.85);
  });

  it("Arabizi queries are expanded to Arabic script and every result carries provenance", async () => {
    const r = await retrieve("kifach nwajad rasi l mo9abala dyal lkhdma", { k: 5, log: false });
    expect(r.variants).toHaveLength(2);
    expect(r.variants[1]).toMatch(/[؀-ۿ]/);
    for (const x of r.results) {
      expect(x.doc.sourceName).toBeTruthy();
      expect(["verified", "unverified", "editorial"]).toContain(x.doc.verificationStatus);
      expect(x.doc.version).toBeGreaterThanOrEqual(1);
    }
  });

  it("archived documents are never retrieved; retrievals are logged without the query text", async () => {
    await asSystem((tx) => tx.query(`UPDATE kb_documents SET status = 'archived' WHERE slug = 'ma-anapec'`));
    const r = await retrieve("ANAPEC", { k: 5 });
    expect(r.results.some((x) => x.doc.slug === "ma-anapec")).toBe(false);
    await asSystem((tx) => tx.query(`UPDATE kb_documents SET status = 'active' WHERE slug = 'ma-anapec'`));
    await new Promise((res) => setTimeout(res, 200));
    const log = await asSystem((tx) => tx.query<{ query_hash: string; results: unknown }>(`SELECT query_hash, results FROM retrieval_log ORDER BY id DESC LIMIT 1`));
    expect(log[0].query_hash).toMatch(/^[0-9a-f]{16}$/);
    expect(JSON.stringify(log[0])).not.toContain("ANAPEC");
  });
});
