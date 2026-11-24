import { describe, expect, it } from "vitest";
import { detectSkills, sentences } from "@/server/domain/skills-engine";
import { CASES } from "../fixtures/skill-extraction";

describe("deterministic skill engine", () => {
  it("never suggests a forbidden skill (negations, wishes)", () => {
    for (const c of CASES.filter((x) => x.forbidden)) {
      const got = detectSkills(c.text).map((d) => d.skillId);
      for (const f of c.forbidden!) expect(got, `${c.id} must not contain ${f}`).not.toContain(f);
    }
  });

  it("returns nothing for noise", () => {
    expect(detectSkills("asdf qwer zxcv lorem ipsum")).toEqual([]);
    expect(detectSkills("")).toEqual([]);
  });

  it("every suggestion quotes a sentence of the input (grounding)", () => {
    for (const c of CASES) for (const d of detectSkills(c.text)) expect(c.text.replace(/\s+/g, " ")).toContain(d.quote.slice(0, 20));
  });

  it("splits sentences across scripts", () => {
    expect(sentences("Hello world. Bonjour le monde! مرحبا بالعالم؟ second")).toHaveLength(4);
  });

  it("meets minimum precision/recall per language (regression floor)", () => {
    const byLang = new Map<string, { tp: number; fp: number; fn: number }>();
    for (const c of CASES) {
      const got = new Set(detectSkills(c.text).map((d) => d.skillId));
      const exp = new Set(c.expected);
      const m = byLang.get(c.lang) ?? { tp: 0, fp: 0, fn: 0 };
      for (const g of got) { if (exp.has(g)) m.tp++; else m.fp++; }
      for (const e of exp) if (!got.has(e)) m.fn++;
      byLang.set(c.lang, m);
    }
    const report: Record<string, { precision: number; recall: number }> = {};
    for (const [lang, m] of byLang) report[lang] = { precision: m.tp / Math.max(1, m.tp + m.fp), recall: m.tp / Math.max(1, m.tp + m.fn) };
    console.log("[eval] rules engine by language:", JSON.stringify(report));
    // Floors reflect the current measured engine (docs/AI_EVALUATION_REPORT.md); raise them as it improves.
    for (const lang of ["en", "fr", "ar", "ary_ar", "ary_lat"]) {
      expect(report[lang].precision, `${lang} precision`).toBeGreaterThanOrEqual(0.7);
      expect(report[lang].recall, `${lang} recall`).toBeGreaterThanOrEqual(0.6);
    }
  });
});
