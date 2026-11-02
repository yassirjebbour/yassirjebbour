import { describe, expect, it } from "vitest";
import { en } from "@/i18n/messages/en";
import { fr } from "@/i18n/messages/fr";
import { ar } from "@/i18n/messages/ar";
import { ary } from "@/i18n/messages/ary";
import { zgh } from "@/i18n/messages/zgh";
import { isPluralObject, render, resolve } from "@/i18n/format";
import { negotiate, pick, LOCALE_META } from "@/i18n/config";

type Dict = Record<string, unknown>;
function leaves(o: unknown, p = ""): Array<[string, unknown]> {
  if (typeof o === "string" || isPluralObject(o)) return [[p, o]];
  return Object.entries(o as Dict).flatMap(([k, v]) => leaves(v, p ? `${p}.${k}` : k));
}
const placeholders = (s: unknown) => [...new Set((typeof s === "string" ? s : Object.values(s as Dict).join(" ")).match(/\{\w+\}/g) ?? [])].sort();
const LOCALES = { fr, ar, ary, zgh } as Record<string, unknown>;

describe("i18n catalogues", () => {
  const enLeaves = leaves(en);

  it.each(Object.keys(LOCALES))("%s has exactly the English keys", (l) => {
    const keys = new Set(leaves(LOCALES[l]).map(([k]) => k));
    const missing = enLeaves.map(([k]) => k).filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !enLeaves.some(([e]) => e === k));
    expect(missing, `missing in ${l}`).toEqual([]);
    expect(extra, `extra in ${l}`).toEqual([]);
  });

  it.each(Object.keys(LOCALES))("%s keeps every {placeholder}", (l) => {
    const bad: string[] = [];
    for (const [k, v] of enLeaves) {
      const tv = resolve(LOCALES[l], k);
      if (tv === undefined) continue;
      if (JSON.stringify(placeholders(v)) !== JSON.stringify(placeholders(tv))) bad.push(`${k}: ${placeholders(v)} vs ${placeholders(tv)}`);
    }
    expect(bad).toEqual([]);
  });

  it.each(Object.keys(LOCALES))("%s has no empty strings and is not a copy of English", (l) => {
    const ls = leaves(LOCALES[l]);
    expect(ls.filter(([, v]) => typeof v === "string" && !v.trim()).map(([k]) => k)).toEqual([]);
    const same = ls.filter(([k, v]) => typeof v === "string" && v === resolve(en, k) && (v as string).length > 12 && !/BAWSALA|https?:|Excel|JSON|PDF|ANAPEC|OFPPT/.test(v as string));
    // A few words are legitimately identical (e.g. French "Notifications", "Bac+2 (DUT, BTS, DTS)").
    expect(same.length, `${l} untranslated: ${same.slice(0, 5).map(([k]) => k)}`).toBeLessThanOrEqual(6);
  });

  it("Tamazight catalogue is written in Tifinagh (Latin only for names/codes)", () => {
    const latinWords = leaves(zgh).flatMap(([, v]) => (typeof v === "string" ? [v] : Object.values(v as Dict) as string[]))
      .join(" ").replace(/\{\w+\}|https?:\S+/g, "").match(/\b[A-Za-z]{4,}\b/g) ?? [];
    const allowed = /^(BAWSALA|Excel|JSON|PDF|DOCX|ANAPEC|OFPPT|HubSpot|Instagram|LinkedIn|GitHub|English|Français|North|Star|https|CEFR|Europass)$/i;
    expect([...new Set(latinWords.filter((w) => !allowed.test(w)))]).toEqual([]);
  });

  it("Arabic plural forms are complete", () => {
    for (const [k, v] of leaves(ar)) if (isPluralObject(v)) for (const f of ["zero", "one", "two", "few", "many", "other"]) expect((v as Dict)[f], `${k}.${f}`).toBeTruthy();
  });

  it("renders plurals with locale rules and Latin digits", () => {
    expect(render({ one: "# skill", other: "# skills" }, "en", { n: 1 })).toBe("1 skill");
    expect(render({ one: "# skill", other: "# skills" }, "en", { n: 3 })).toBe("3 skills");
    expect(render(resolve(ar, "landing.try_found"), "ar", { n: 2 })).not.toContain("#");
    expect(render(resolve(ar, "landing.try_found"), "ar", { n: 11 })).toContain("11");
  });

  it("direction metadata: Arabic and Darija RTL, Tamazight LTR", () => {
    expect(LOCALE_META.ar.dir).toBe("rtl");
    expect(LOCALE_META.ary.dir).toBe("rtl");
    expect(LOCALE_META.zgh.dir).toBe("ltr");
    expect(LOCALE_META.fr.dir).toBe("ltr");
  });

  it("negotiates Accept-Language and falls back for content", () => {
    expect(negotiate("ar-MA,fr;q=0.8")).toBe("ary");
    expect(negotiate("fr-FR")).toBe("fr");
    expect(negotiate("zgh")).toBe("zgh");
    expect(negotiate(null)).toBe("ar");
    expect(pick({ fr: "Bonjour", ar: "مرحبا" }, "ary")).toBe("مرحبا");
    expect(pick({ fr: "Bonjour", en: "Hello" }, "zgh")).toBe("Bonjour");
  });
});
