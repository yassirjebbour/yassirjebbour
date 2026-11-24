import "server-only";
import { createHash } from "node:crypto";
import { asSystem, asUser } from "../db";
import { ApiError } from "../http/errors";
import { log } from "../log";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const PDF = "application/pdf";
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const TXT = "text/plain";

/**
 * Upload-security controls (no antivirus engine is available in the target hosting):
 *  - size ≤ 5 MB; only PDF, DOCX, TXT;
 *  - type decided by *magic bytes*, not by the client's filename or Content-Type;
 *  - files are stored privately in Postgres (RLS by owner) and never served inline or executed;
 *    downloads use Content-Disposition: attachment + X-Content-Type-Options: nosniff;
 *  - text extraction runs with a time limit; extracted text is treated as untrusted data by the AI layer.
 */
export function sniffType(buf: Buffer): string | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return PDF;
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    // DOCX is a zip that contains word/document.xml
    return buf.includes(Buffer.from("word/")) ? DOCX : null;
  }
  // Plain text: valid UTF-8, no NUL bytes
  if (!buf.includes(0)) {
    const s = buf.toString("utf8");
    if (!s.includes("�")) return TXT;
  }
  return null;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let t: NodeJS.Timeout;
  return Promise.race([p, new Promise<T>((_, rej) => { t = setTimeout(() => rej(new Error("extraction timeout")), ms); })]).finally(() => clearTimeout(t));
}

/** Reads the ZIP central directory and rejects archives that would expand too much (zip bombs). */
export function zipLooksSafe(buf: Buffer, maxTotal = 30 * 1024 * 1024, maxRatio = 120): boolean {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0 || eocd + 22 > buf.length) return false;
  const entries = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  if (entries > 2000) return false;
  let total = 0;
  for (let i = 0; i < entries; i++) {
    if (off + 46 > buf.length || buf.readUInt32LE(off) !== 0x02014b50) return false;
    const comp = buf.readUInt32LE(off + 20);
    const uncomp = buf.readUInt32LE(off + 24);
    if (uncomp === 0xffffffff || comp === 0xffffffff) return false; // ZIP64: not expected in a CV
    total += uncomp;
    if (total > maxTotal || (comp > 0 && uncomp / comp > maxRatio && uncomp > 1024 * 1024)) return false;
    off += 46 + buf.readUInt16LE(off + 28) + buf.readUInt16LE(off + 30) + buf.readUInt16LE(off + 32);
  }
  return true;
}

export async function extractText(buf: Buffer, mime: string): Promise<string> {
  if (mime === TXT) return buf.toString("utf8");
  if (mime === PDF) {
    const { extractText: pdfText, getDocumentProxy } = await import("unpdf");
    const doc = await withTimeout(getDocumentProxy(new Uint8Array(buf)), 15_000);
    const { text } = await withTimeout(pdfText(doc, { mergePages: true }), 15_000);
    return Array.isArray(text) ? text.join("\n") : text;
  }
  if (mime === DOCX) {
    if (!zipLooksSafe(buf)) throw new Error("archive expansion limits exceeded");
    const mammoth = await import("mammoth");
    const r = await withTimeout(mammoth.extractRawText({ buffer: buf }), 15_000);
    return r.value;
  }
  throw new Error("unsupported type");
}

export async function saveUpload(userId: string, purpose: "cv" | "evidence", filename: string, buf: Buffer) {
  if (buf.length === 0 || buf.length > MAX_FILE_BYTES) throw new ApiError("validation", "file_size");
  const mime = sniffType(buf);
  if (!mime) throw new ApiError("validation", "file_type");
  const safeName = filename.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || "file";
  let text: string | null = null, err: string | null = null;
  try {
    text = (await extractText(buf, mime)).replace(/\u0000/g, "").slice(0, 60_000);
    if (text.trim().length < 20) { err = "empty_text"; }
  } catch (e) {
    err = "parse_failed";
    log.warn("upload.extract_failed", { mime, bytes: buf.length, err: e });
  }
  const sha = createHash("sha256").update(buf).digest("hex");
  const row = await asUser(userId, (tx) =>
    tx.one<{ id: string; created_at: Date }>(
      `INSERT INTO user_files (user_id, purpose, filename, mime, bytes, sha256, content, extracted_text, extract_error)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, created_at`,
      [userId, purpose, safeName, mime, buf.length, sha, buf, text, err],
    ),
  );
  await asSystem((tx) => tx.query(`INSERT INTO audit_log (actor_id, action, target, meta) VALUES ($1,'file.uploaded',$2,$3)`, [userId, row!.id, JSON.stringify({ mime, bytes: buf.length })]));
  return { id: row!.id, filename: safeName, mime, bytes: buf.length, created_at: row!.created_at, extract_error: err, chars: text?.length ?? 0 };
}

export const listFiles = (userId: string) =>
  asUser(userId, (tx) => tx.query<{ id: string; purpose: string; filename: string; mime: string; bytes: number; created_at: Date; extract_error: string | null }>(
    `SELECT id, purpose, filename, mime, bytes, created_at, extract_error FROM user_files WHERE user_id = $1 ORDER BY created_at DESC`, [userId]));

export async function getFileText(userId: string, id: string) {
  const r = await asUser(userId, (tx) => tx.one<{ extracted_text: string | null }>(`SELECT extracted_text FROM user_files WHERE id = $1`, [id]));
  if (!r) throw new ApiError("not_found");
  return r.extracted_text;
}

export async function getFileContent(userId: string, id: string) {
  const r = await asUser(userId, (tx) => tx.one<{ filename: string; mime: string; content: Buffer }>(`SELECT filename, mime, content FROM user_files WHERE id = $1`, [id]));
  if (!r) throw new ApiError("not_found");
  return r;
}

export async function deleteFile(userId: string, id: string) {
  const rows = await asUser(userId, (tx) => tx.query(`DELETE FROM user_files WHERE id = $1 RETURNING id`, [id]));
  if (!rows.length) throw new ApiError("not_found");
}
