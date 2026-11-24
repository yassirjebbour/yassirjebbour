/**
 * Heading-aware Markdown chunker.
 * - Splits on headings (#, ##, ###) so a chunk never mixes two sections.
 * - Packs paragraphs up to ~maxChars, never splitting inside a paragraph unless it alone is too long
 *   (then splits on sentence boundaries).
 * - Each chunk carries its heading path ("Guide › Section") for attribution and for retrieval context.
 * multilingual-e5-small accepts 512 tokens; 900 characters stays well under that for all scripts.
 */
export interface Chunk { ord: number; heading: string | null; content: string }

export function chunkMarkdown(md: string, opts: { maxChars?: number; title?: string } = {}): Chunk[] {
  const maxChars = opts.maxChars ?? 900;
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const sections: Array<{ path: string[]; text: string[] }> = [];
  let path: string[] = opts.title ? [opts.title] : [];
  let cur: { path: string[]; text: string[] } = { path: [...path], text: [] };
  for (const line of lines) {
    const m = /^(#{1,3})\s+(.*)$/.exec(line);
    if (m) {
      if (cur.text.join("").trim()) sections.push(cur);
      const level = m[1].length;
      const base = opts.title ? 1 : 0;
      path = [...path.slice(0, base + level - 1), m[2].trim()];
      cur = { path: [...path], text: [] };
    } else cur.text.push(line);
  }
  if (cur.text.join("").trim()) sections.push(cur);

  const chunks: Chunk[] = [];
  for (const sec of sections) {
    const heading = sec.path.length ? sec.path.join(" › ") : null;
    const paras = sec.text.join("\n").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    let buf = "";
    const flush = () => { if (buf.trim()) chunks.push({ ord: chunks.length, heading, content: buf.trim() }); buf = ""; };
    for (const p of paras) {
      if (p.length > maxChars) {
        flush();
        const sentences = p.split(/(?<=[.!?؟])\s+/);
        for (const s of sentences) {
          // A "sentence" longer than the budget (no punctuation) is cut on word boundaries.
          const pieces: string[] = [];
          if (s.length > maxChars) {
            let cur = "";
            for (const w of s.split(/\s+/)) {
              if ((cur + " " + w).length > maxChars && cur) { pieces.push(cur); cur = ""; }
              cur += (cur ? " " : "") + w;
            }
            if (cur) pieces.push(cur);
          } else pieces.push(s);
          for (const piece of pieces) {
            if ((buf + " " + piece).length > maxChars) flush();
            buf += (buf ? " " : "") + piece;
          }
        }
        flush();
        continue;
      }
      if ((buf + "\n\n" + p).length > maxChars) flush();
      buf += (buf ? "\n\n" : "") + p;
    }
    flush();
  }
  return chunks;
}
