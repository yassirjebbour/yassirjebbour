import { asPublic } from "@/server/db";
import { getEmbedder } from "@/server/rag/embedder";
import { getProvider } from "@/server/ai/providers";

/** Readiness: database reachable and migrated; reports which AI capabilities are configured. */
export async function GET() {
  const t0 = Date.now();
  const checks: Record<string, unknown> = {};
  let ok = true;
  try {
    const r = await asPublic((tx) => tx.one<{ n: number; m: string }>(`SELECT (SELECT count(*)::int FROM skills) n, (SELECT max(name) FROM schema_migrations) m`));
    checks.database = { ok: true, ms: Date.now() - t0, skills: r?.n, migration: r?.m };
  } catch (e) {
    ok = false;
    checks.database = { ok: false, error: (e as Error).message.slice(0, 120) };
  }
  checks.llm = { configured: !!getProvider() };
  checks.embeddings = { configured: !!getEmbedder(), model: getEmbedder()?.id ?? null };
  checks.version = process.env.APP_VERSION ?? "dev";
  return Response.json({ status: ok ? "ready" : "unavailable", checks }, { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } });
}
