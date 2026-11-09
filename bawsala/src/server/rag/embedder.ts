/**
 * Embedding providers behind one interface.
 *
 *  local  — intfloat/multilingual-e5-small (quantised ONNX, 384 dims) run in-process with the
 *           official @huggingface/transformers runtime. No data leaves the server, no per-call cost.
 *           Model files live in EMBEDDINGS_MODEL_DIR (fetched by scripts/fetch-embedding-model.ts).
 *  voyage — Voyage AI multilingual embeddings over HTTPS (needs VOYAGE_API_KEY). Interface ready;
 *           not exercised in the build environment (host blocked) — see docs/RAG_PIPELINE.md.
 *  none   — no embeddings: retrieval falls back to keyword search and says so in diagnostics.
 *
 * Changing provider changes the vector space: re-run `npm run kb:ingest -- --reembed`.
 */
import path from "node:path";
import { existsSync } from "node:fs";

export interface Embedder {
  id: string; // stored with every chunk so mixed vector spaces are detectable
  dims: number;
  embed(texts: string[], kind: "query" | "passage"): Promise<number[][]>;
}

class LocalE5 implements Embedder {
  id = "multilingual-e5-small-q8";
  dims = 384;
  private extractor: Promise<(t: string[], o: object) => Promise<{ tolist(): number[][] }>> | null = null;
  constructor(private dir: string) {}
  private load() {
    if (!this.extractor) {
      this.extractor = (async () => {
        const { pipeline, env } = await import("@huggingface/transformers");
        env.allowRemoteModels = false;
        env.localModelPath = path.dirname(this.dir) + path.sep;
        const fe = await pipeline("feature-extraction", path.basename(this.dir), { dtype: "q8" });
        return fe as unknown as (t: string[], o: object) => Promise<{ tolist(): number[][] }>;
      })();
      this.extractor.catch(() => { this.extractor = null; });
    }
    return this.extractor;
  }
  async embed(texts: string[], kind: "query" | "passage") {
    const fe = await this.load();
    const out: number[][] = [];
    for (let i = 0; i < texts.length; i += 16) {
      const batch = texts.slice(i, i + 16).map((t) => `${kind}: ${t}`);
      const t = await fe(batch, { pooling: "mean", normalize: true });
      out.push(...t.tolist());
    }
    return out;
  }
}

class Voyage implements Embedder {
  id: string;
  dims = 1024;
  constructor(private key: string, private model = process.env.VOYAGE_MODEL ?? "voyage-multilingual-2") { this.id = `voyage:${this.model}`; }
  async embed(texts: string[], kind: "query" | "passage") {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.key}` },
      body: JSON.stringify({ input: texts, model: this.model, input_type: kind === "query" ? "query" : "document" }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`voyage ${res.status}`);
    const j = (await res.json()) as { data: Array<{ embedding: number[] }> };
    return j.data.map((d) => d.embedding);
  }
}

let cached: Embedder | null | undefined;

export function modelDir() {
  return path.resolve(process.env.EMBEDDINGS_MODEL_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), "models", "multilingual-e5-small"));
}

/** Returns the configured embedder, or null when embeddings are disabled/unavailable. */
export function getEmbedder(): Embedder | null {
  if (cached !== undefined) return cached;
  const provider = process.env.EMBEDDINGS_PROVIDER ?? "local";
  if (provider === "voyage" && process.env.VOYAGE_API_KEY) cached = new Voyage(process.env.VOYAGE_API_KEY);
  else if (provider === "local" && existsSync(path.join(modelDir(), "onnx", "model_quantized.onnx"))) cached = new LocalE5(modelDir());
  else cached = null;
  return cached;
}

export function toPgVector(v: number[]) {
  return "[" + v.map((x) => (Number.isFinite(x) ? x.toFixed(6) : "0")).join(",") + "]";
}
