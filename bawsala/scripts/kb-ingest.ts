/* Ingests kb/*.md plus documents generated from the catalogue. Idempotent.
 * Usage: npm run kb:ingest [-- --force]   (--force re-embeds everything, e.g. after changing embedder) */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { asSystem, closeDb } from "../src/server/db";
import { ingestDocument, parseKbFile, type KbMeta } from "../src/server/rag/ingest";
import { getEmbedder } from "../src/server/rag/embedder";
import { SKILLS, SAMPLE_OPPORTUNITIES, DRILLS } from "../src/server/domain/catalog";

function generated(): Array<{ meta: KbMeta; body: string }> {
  const docs: Array<{ meta: KbMeta; body: string }> = [];
  const roleNames = (id: string) => SAMPLE_OPPORTUNITIES.filter((o) => o.required.includes(id) || o.nice.includes(id)).map((o) => o.title.en);
  for (const s of SKILLS) {
    const d = DRILLS[s.id];
    const lines = [
      `## ${s.names.en} — ${s.names.fr} — ${s.names.ar}`,
      `Category: ${s.category}.`,
      roleNames(s.id).length ? `Roles in BAWSALA that ask for it: ${roleNames(s.id).join(", ")}.` : "",
      s.learn ? `## How to learn it\n${s.learn.title.en} (${s.learn.title.fr}) — about ${s.learn.hours ?? "?"} hours, free.${s.learn.url ? ` Link: ${s.learn.url}` : ""}` : "",
      d ? `## Practise\n${d.practice.en}\n\n${d.practice.fr}\n\n${d.practice.ar}` : "",
      d ? `## Prove it\n${d.prove.en}\n\n${d.prove.fr}\n\n${d.prove.ar}` : "",
    ].filter(Boolean);
    docs.push({
      meta: { slug: `skill-${s.id.replace(/_/g, "-")}`, title: `${s.names.en} / ${s.names.fr} / ${s.names.ar}`, kind: "skill", language: "multi", geography: "INTL",
        source_name: "BAWSALA skills catalogue", verification_status: "editorial", confidence: "medium", license: "CC BY 4.0 (BAWSALA)", published_at: "2026-11-01" },
      body: lines.join("\n\n"),
    });
  }
  for (const o of SAMPLE_OPPORTUNITIES) {
    const nm = (id: string) => SKILLS.find((s) => s.id === id)?.names.en ?? id;
    docs.push({
      meta: { slug: `occupation-${o.slug}`, title: `${o.title.en} / ${o.title.fr} / ${o.title.ar}`, kind: "occupation", language: "multi", geography: "MA",
        source_name: "BAWSALA editorial role profiles", verification_status: "editorial", confidence: "low", license: "CC BY 4.0 (BAWSALA)", published_at: "2026-11-01" },
      body: [
        `## ${o.title.en} — ${o.title.fr} — ${o.title.ar}`,
        `Typical entry-level role for young graduates. The skill list is BAWSALA's editorial estimate, not the result of a labour-market survey.`,
        `Required skills: ${o.required.map(nm).join(", ")}.`,
        o.nice.length ? `Useful extra skills: ${o.nice.map(nm).join(", ")}.` : "",
        o.project ? `## Portfolio project that proves readiness\n${o.project.en}\n\n${o.project.fr}\n\n${o.project.ar}` : "",
      ].filter(Boolean).join("\n\n"),
    });
  }
  return docs;
}

async function main() {
  const force = process.argv.includes("--force");
  const dir = path.join(process.cwd(), "kb");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md").sort();
  const docs = files.map((f) => {
    const { meta, body } = parseKbFile(readFileSync(path.join(dir, f), "utf8"));
    for (const k of ["slug", "title", "kind", "language", "source_name", "verification_status"]) if (!meta[k]) throw new Error(`${f}: missing ${k}`);
    return { meta: meta as unknown as KbMeta, body };
  });
  const all = [...docs, ...generated()];
  const emb = getEmbedder();
  console.log(`embedder: ${emb?.id ?? "none (keyword-only index)"}`);
  const t0 = Date.now();
  let changed = 0, chunks = 0;
  for (const d of all) {
    const r = await asSystem((tx) => ingestDocument(tx, d.meta, d.body, { force }));
    if (r.changed) { changed++; chunks += r.chunks; }
  }
  // archive documents whose source file disappeared
  const slugs = all.map((d) => d.meta.slug);
  const archived = await asSystem((tx) => tx.query(`UPDATE kb_documents SET status = 'archived' WHERE status = 'active' AND NOT (slug = ANY($1)) RETURNING slug`, [slugs]));
  console.log(`documents: ${all.length}, changed: ${changed}, chunks written: ${chunks}, archived: ${archived.length}, ${Date.now() - t0} ms`);
  await closeDb();
}
main().catch(async (e) => { console.error(e); await closeDb(); process.exit(1); });
