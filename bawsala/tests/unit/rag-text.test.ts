import { describe, expect, it } from "vitest";
import { arabiziToArabic, detectScript, guessLanguage, looksArabizi, normalizeForSearch } from "@/server/rag/text";
import { chunkMarkdown } from "@/server/rag/chunker";
import { parseKbFile, sanitizeDocument } from "@/server/rag/ingest";

describe("script & language detection", () => {
  it("detects scripts", () => {
    expect(detectScript("مرحبا بك")).toBe("arabic");
    expect(detectScript("hello there")).toBe("latin");
    expect(detectScript("ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ")).toBe("tifinagh");
  });
  it("recognises Arabizi Darija but not plain English/French", () => {
    expect(looksArabizi("kifach nwajad rasi l mo9abala dyal lkhdma")).toBe(true);
    expect(looksArabizi("khdemt f 7anout dyal baba")).toBe(true);
    expect(looksArabizi("how do I prepare for a job interview")).toBe(false);
    expect(looksArabizi("comment préparer un entretien")).toBe(false);
  });
  it("guesses languages", () => {
    expect(guessLanguage("كيفاش نقدر نلقى خدمة")).toBe("ary");
    expect(guessLanguage("كيف أجد عملاً في المغرب")).toBe("ar");
    expect(guessLanguage("comment trouver un stage pour mon master")).toBe("fr");
    expect(guessLanguage("how can I find an internship")).toBe("en");
    expect(guessLanguage("ⵎⴰⵎⴽ ⴰⴷ ⴰⴼⵖ ⵜⴰⵡⵓⵔⵉ")).toBe("zgh");
  });
  it("transliterates Arabizi with the Darija lexicon", () => {
    const out = arabiziToArabic("kifach nwajad l mo9abala dyal lkhdma");
    expect(out).toContain("كيفاش");
    expect(out).toContain("مقابلة");
    expect(out).toContain("ديال");
    expect(out).toContain("الخدمة");
  });
  it("normalises Arabic and Latin for keyword search", () => {
    expect(normalizeForSearch("الإنجليزيّة")).toBe("الانجليزيه");
    expect(normalizeForSearch("Compétences, É!")).toBe("competences e");
  });
});

describe("chunking & ingestion helpers", () => {
  it("splits on headings and keeps the heading path", () => {
    const chunks = chunkMarkdown("# A\npara one\n\n## B\npara two\n\n## C\n" + "x ".repeat(800), { title: "Doc", maxChars: 300 });
    expect(chunks[0].heading).toBe("Doc › A");
    expect(chunks.some((c) => c.heading === "Doc › A › B")).toBe(true);
    expect(chunks.every((c) => c.content.length <= 320)).toBe(true);
  });
  it("parses front matter and rejects files without it", () => {
    const { meta, body } = parseKbFile("---\nslug: a-b\ntitle: T\n---\nBody");
    expect(meta.slug).toBe("a-b");
    expect(body).toBe("Body");
    expect(() => parseKbFile("no front matter")).toThrow();
  });
  it("strips scripts, tags and bidi-control characters from documents", () => {
    const s = sanitizeDocument("Hi <script>alert(1)</script><b>bold</b>‮txt\u0007");
    expect(s).toBe("Hi boldtxt");
  });
});
