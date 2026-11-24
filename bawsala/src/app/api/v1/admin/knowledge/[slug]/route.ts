import { z } from "zod";
import { route, json, apiUser } from "@/server/http/api";
import { asSystem } from "@/server/db";
import { archiveDocument, deleteDocument } from "@/server/rag/ingest";

export const DELETE = route<{ params: Promise<{ slug: string }> }>(async (req, { params }) => {
  const admin = await apiUser(["platform_admin"]);
  const slug = z.string().regex(/^[a-z0-9][a-z0-9-]{1,120}$/).parse((await params).slug);
  const hard = new URL(req.url).searchParams.get("hard") === "1";
  await asSystem(async (tx) => {
    if (hard) await deleteDocument(tx, slug); else await archiveDocument(tx, slug);
    await tx.query(`INSERT INTO audit_log (actor_id, action, target) VALUES ($1,$2,$3)`, [admin.id, hard ? "kb.deleted" : "kb.archived", slug]);
  });
  return json({ ok: true });
});
