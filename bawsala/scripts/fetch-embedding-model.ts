/**
 * Downloads the multilingual-e5-small quantised ONNX model (Xenova conversion of intfloat/multilingual-e5-small, MIT)
 * into models/multilingual-e5-small and verifies SHA-256 checksums. Run at build/deploy time: npm run models:fetch
 * The pinned hashes are those of the files used to build and evaluate BAWSALA (docs/RAG_PIPELINE.md).
 */
import { createHash } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.EMBEDDINGS_MODEL_URL ?? "https://huggingface.co/Xenova/multilingual-e5-small/resolve/main/";
const DIR = path.resolve(process.env.EMBEDDINGS_MODEL_DIR ?? "models/multilingual-e5-small");
const FILES: Record<string, string> = {
  "onnx/model_quantized.onnx": "f80102d3f2a1229f387d3c81909990d8945513e347b0eab049f7de3c6f98c193",
  "tokenizer.json": "0b44a9d7b51c3c62626640cda0e2c2f70fdacdc25bbbd68038369d14ebdf4c39",
  "config.json": "cb99455288675345e1a4f411438d5d0adbba5fbd3a67ea4fb03c015433b996c1",
  "tokenizer_config.json": "a1d6bc8734a6f635dc158508bef000f8e2e5a759c7d92f984b2c86e5ff53425b",
  "special_tokens_map.json": "d05497f1da52c5e09554c0cd874037a083e1dc1b9cfd48034d1c717f1afc07a7",
};
const sha = (b: Buffer) => createHash("sha256").update(b).digest("hex");

async function main() {
  for (const [rel, expected] of Object.entries(FILES)) {
    const dest = path.join(DIR, rel);
    if (existsSync(dest) && sha(readFileSync(dest)) === expected) { console.log(`ok (cached) ${rel}`); continue; }
    mkdirSync(path.dirname(dest), { recursive: true });
    const res = await fetch(BASE + rel);
    if (!res.ok) throw new Error(`${rel}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const got = sha(buf);
    if (got !== expected) throw new Error(`${rel}: checksum mismatch (got ${got}). Refusing to use an unverified model.`);
    writeFileSync(dest, buf);
    console.log(`ok ${rel} (${buf.length} bytes)`);
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
