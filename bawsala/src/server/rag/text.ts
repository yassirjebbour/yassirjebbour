/**
 * Text normalisation for search, language/script detection, and Arabizi → Arabic-script
 * transliteration (query expansion for Latin-script Darija).
 *
 * Why: the multilingual-e5-small embedder handles MSA, Arabic-script Darija, French and English
 * well, but scores Latin-script Darija poorly (measured in docs/AI_EVALUATION_REPORT.md).
 * Transliterating "kifach nwajad l mo9abala" → "كيفاش نواجد ل مقابلة" recovers most of it.
 */

export type Script = "arabic" | "latin" | "tifinagh" | "mixed" | "none";

export function detectScript(s: string): Script {
  const ar = (s.match(/[؀-ۿ]/g) ?? []).length;
  const la = (s.match(/[A-Za-zÀ-ÿ]/g) ?? []).length;
  const tf = (s.match(/[ⴰ-⵿]/g) ?? []).length;
  const total = ar + la + tf;
  if (!total) return "none";
  if (tf / total > 0.5) return "tifinagh";
  if (ar / total > 0.7) return "arabic";
  if (la / total > 0.7) return "latin";
  return "mixed";
}

const ARABIZI_HINT = /\b\w*[2379]\w*\b|\b(dyal|dial|wach|kifach|kifash|bghit|bghina|3and|3ndi|ana|nta|nti|hna|bzaf|daba|chno|chnou|shno|wakha|mzyan|khdma|lkhdma|khdmt|khdemt|ghadi|kan|kayn|machi|mashi|walakin|f|l)\b/gi;

/** Heuristic: Latin text that looks like Darija written in Arabizi. */
export function looksArabizi(s: string): boolean {
  if (detectScript(s) !== "latin") return false;
  const words = s.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  if (words.length < 2) return false;
  const hits = (s.match(ARABIZI_HINT) ?? []).filter((w) => /[2379]/.test(w) || w.length > 1).length;
  const digitWords = words.filter((w) => /[a-z][2379]|[2379][a-z]/.test(w)).length;
  return digitWords >= 1 || hits / words.length >= 0.25;
}

// Common Darija words (Arabizi → Arabic script). Longest-first application.
const LEXICON: Record<string, string> = {
  dyal: "ديال", dial: "ديال", dyali: "ديالي", dyalo: "ديالو", kifach: "كيفاش", kifash: "كيفاش", chno: "شنو", chnou: "شنو", shno: "شنو",
  wach: "واش", bghit: "بغيت", bghina: "بغينا", daba: "دابا", bzaf: "بزاف", mzyan: "مزيان", wakha: "واخا", ghadi: "غادي", machi: "ماشي",
  mashi: "ماشي", walakin: "ولكن", khdma: "خدمة", lkhdma: "الخدمة", khdmt: "خدمت", khdemt: "خدمت", kankhdem: "كنخدم", stage: "ستاج",
  mo9abala: "مقابلة", m9abla: "مقابلة", lmo9abala: "المقابلة", cv: "سيفي", lcv: "السيفي", flous: "فلوس", "7anout": "حانوت", f7anout: "فالحانوت",
  lklyan: "الكليان", klyan: "كليان", kanbi3: "كنبيع", bi3: "بيع", nbi3: "نبيع", "9rit": "قريت", kan9ra: "كنقرا", jami3a: "جامعة", fac: "فاك",
  mahara: "مهارة", maharat: "مهارات", tajriba: "تجربة", ta3lim: "تعليم", t3lem: "تعلم", nt3lem: "نتعلم", lghat: "لغات", lugha: "لغة",
  rasi: "راسي", nwajad: "نوجد", nwjed: "نوجد", sharika: "شركة", charika: "شركة", charikat: "شركات", mchrou3: "مشروع", machrou3: "مشروع",
  anapec: "أنابيك", ofppt: "OFPPT", auto: "أوطو", entrepreneur: "مقاول",
};

const DIGRAPHS: Array<[RegExp, string]> = [
  [/kh/g, "خ"], [/gh/g, "غ"], [/ch|sh/g, "ش"], [/th/g, "ث"], [/dj/g, "ج"], [/ou/g, "و"],
];
const LETTERS: Record<string, string> = {
  a: "ا", b: "ب", t: "ت", j: "ج", "7": "ح", d: "د", r: "ر", z: "ز", s: "س", "9": "ق", "3": "ع", "2": "ء", "5": "خ",
  f: "ف", k: "ك", l: "ل", m: "م", n: "ن", h: "ه", w: "و", y: "ي", i: "ي", u: "و", o: "و", e: "", g: "ڭ", q: "ق", p: "ب", v: "ف", c: "ك", x: "كس",
};

function translitWord(w: string): string {
  const lower = w.toLowerCase();
  if (LEXICON[lower]) return LEXICON[lower];
  if (/^\d+$/.test(lower)) return lower;
  let s = lower;
  for (const [re, rep] of DIGRAPHS) s = s.replace(re, rep);
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    // keep a leading vowel as alef, drop short vowels inside words except long-ish ones
    if ("aeiou".includes(c)) {
      if (i === 0) out += c === "o" || c === "u" ? "و" : c === "i" ? "ي" : "ا";
      else if (c === "a" && i === s.length - 1) out += "ة";
      else if (c === "e") continue;
      else out += LETTERS[c] ?? "";
      continue;
    }
    out += LETTERS[c] ?? c;
  }
  return out;
}

export function arabiziToArabic(s: string): string {
  return s
    .split(/(\s+|[.,!?;:()"'«»-])/)
    .map((tok) => (/^[A-Za-z0-9]+$/.test(tok) && /[A-Za-z]/.test(tok) ? translitWord(tok) : tok))
    .join("");
}

/** Normalisation applied to both indexed text and queries for keyword search. */
export function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // Latin accents
    .replace(/[ً-ْـ]/g, "") // Arabic diacritics, tatweel
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة(?=\s|$)/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Rough language guess for logging/metadata (not used for access decisions). */
export function guessLanguage(s: string): "ar" | "ary" | "fr" | "en" | "zgh" | "unknown" {
  const script = detectScript(s);
  if (script === "tifinagh") return "zgh";
  if (script === "arabic") return /(ديال|كنت|واش|شنو|بغيت|دابا|كيفاش|بزاف|ماشي|غادي|ديالي|كن[ا-ي])/.test(s) ? "ary" : "ar";
  if (script === "latin") {
    if (looksArabizi(s)) return "ary";
    const fr = (s.match(/\b(le|la|les|des|une|est|et|je|pour|avec|dans|sur|pas|vous|mon|ma|du)\b/gi) ?? []).length;
    const en = (s.match(/\b(the|and|is|to|of|i|my|for|with|in|on|a|an|you|how)\b/gi) ?? []).length;
    return fr > en ? "fr" : en > 0 ? "en" : "unknown";
  }
  return "unknown";
}
