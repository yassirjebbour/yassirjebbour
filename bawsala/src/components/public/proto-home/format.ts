/**
 * Formatting helpers ported from the original prototype (legacy/prototypes/BAWSALA.html): nfmt, pfmt, list,
 * esc, and its inline plural syntax "{n|one:# skill|other:# skills}". Shared by the server (first render) and
 * the browser (runtime), so both produce identical text.
 */
export type HomeLocale = "en" | "fr" | "ar" | "ary" | "zgh";

/** The prototype's fallback language for dictionary and story lookups (LK): Darija → Arabic, Tamazight → French. */
export const LK = (l: HomeLocale): "en" | "fr" | "ar" => (l === "zgh" ? "fr" : l === "ary" ? "ar" : l);
const NLOC: Record<HomeLocale, string> = { en: "en-GB", fr: "fr-FR", ar: "ar-MA", ary: "ar-MA", zgh: "fr-FR" };
const LOC: Record<HomeLocale, string> = { en: "en-GB", fr: "fr-MA", ar: "ar-MA", ary: "ar-MA", zgh: "fr-MA" };

export const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export const nfmt = (n: number, l: HomeLocale) => { try { return new Intl.NumberFormat(NLOC[l]).format(n); } catch { return String(n); } };
export const pfmt = (n: number, l: HomeLocale, digits = 1) => { try { return new Intl.NumberFormat(NLOC[l], { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n / 100); } catch { return n + "%"; } };
export function list(items: string[], l: HomeLocale) {
  const e = items.filter(Boolean);
  if (!e.length) return "";
  if (l === "zgh") return e.length < 2 ? e[0] : e.slice(0, -1).join(", ") + " ⴷ " + e[e.length - 1];
  try { return new Intl.ListFormat(LOC[l], { style: "long", type: "conjunction" }).format(e); } catch { return e.join(", "); }
}

/** The prototype's message syntax: "{x}" replacement and "{n|one:…#…|other:…}" plurals (# = formatted number). */
export function fmt(template: string, vars: Record<string, string | number>, l: HomeLocale) {
  const rules = new Intl.PluralRules(NLOC[l]);
  return template
    .replace(/\{(\w+)\|([^}]*)\}/g, (_, k: string, body: string) => {
      const n = Number(vars[k] ?? 0);
      const forms = Object.fromEntries(body.split("|").map((f) => { const i = f.indexOf(":"); return [f.slice(0, i), f.slice(i + 1)]; }));
      const form = forms[rules.select(n)] ?? forms.other ?? "";
      return form.replace(/#/g, nfmt(n, l));
    })
    .replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] == null ? m : typeof vars[k] === "number" ? nfmt(vars[k] as number, l) : String(vars[k])));
}

/** The prototype's play/pause glyph for the hero and the marquee. */
export const filmIcon = (paused: boolean) => paused
  ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
  : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';

/**
 * The prototype's tx(): a catalogue text in the visitor's language. Darija and Tamazight use the prototype's own
 * name dictionaries (keyed by the English text) before falling back to Arabic / French.
 */
export function tx(obj: Partial<Record<string, string>> | undefined, l: HomeLocale, TXA: Record<string, string>, TXZ: Record<string, string>) {
  if (!obj) return "";
  return obj[l] || (l === "zgh" && obj.en && TXZ[obj.en]) || (l === "ary" && obj.en && TXA[obj.en]) || obj[LK(l)] || obj.en || "";
}
