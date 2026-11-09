import { z } from "zod";
import { route, readJson, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";
import { ingestDocument } from "@/server/rag/ingest";

export const GET = route(async () => {
  await apiUser(["platform_admin"]);
  const rows = await asSystem((tx) => tx.query(
    `SELECT d.slug, d.title, d.kind, d.language, d.verification_status, d.verified_at, d.version, d.status, d.updated_at, d.source_name, d.source_url,
            (SELECT count(*)::int FROM kb_chunks c WHERE c.document_id = d.id) chunks
       FROM kb_documents d ORDER BY d.kind, d.slug`));
  return json(rows);
});

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]{1,120}$/), title: z.string().trim().min(2).max(300),
  kind: z.enum(["skill", "occupation", "pathway", "resource", "labor_market", "institution", "program", "guide", "policy"]),
  language: z.enum(["ar", "ary", "fr", "en", "zgh", "multi"]), geography: z.string().max(10).default("MA"),
  source_name: z.string().trim().min(2).max(300), source_url: z.string().url().regex(/^https?:\/\//).nullable().optional(),
  license: z.string().max(200).nullable().optional(), published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  verified_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  verification_status: z.enum(["verified", "unverified", "editorial"]), confidence: z.enum(["high", "medium", "low"]).default("medium"),
  body: z.string().min(20).max(200_000),
}).refine((b) => b.verification_status !== "verified" || !!b.verified_at, "verified documents need verified_at");

export const POST = route(async (req) => {
  const admin = await apiUser(["platform_admin"]);
  const { body, ...meta } = await readJson(req, Body, 1024 * 1024); // 200k characters of Arabic/Tifinagh can exceed 256 KiB
  const r = await asSystem(async (tx) => {
    const res = await ingestDocument(tx, meta, body, { actorId: admin.id });
    await tx.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES ($1,'kb.ingested',$2,$3)`, [admin.id, meta.slug, JSON.stringify({ changed: res.changed, chunks: res.chunks })]);
    return res;
  });
  return json(r, { status: 201 });
});
