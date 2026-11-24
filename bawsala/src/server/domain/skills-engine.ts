/**
 * Deterministic skill detection ("basic engine").
 *
 * Used (1) when no AI provider is configured, (2) as a cross-check on AI output, and
 * (3) in the public "try it" box where we never call a paid model.
 *
 * Principle: a skill is suggested only when the student's own words contain a signal for it,
 * and the suggestion carries the exact sentence that triggered it. Negated sentences
 * ("I never sold…", "ma3ndi hta tajriba") produce nothing. The engine never invents.
 *
 * Covers English, French, Modern Standard Arabic, Darija in Arabic script, Darija in Latin
 * script ("arabizi": kanbi3, f7anout, 3radt…) and Tamazight in Tifinagh.
 */

export interface Detection {
  skillId: string;
  quote: string; // the sentence from the student's text
  term: string; // the matched signal inside that sentence
}

type Rule = { id: string; re: RegExp; /** extra guard on the whole text */ guard?: (text: string) => boolean };

// Patterns are case-insensitive. Arabic diacritics and tatweel are stripped before matching.
const R = (s: string) => new RegExp(s, "iu");

const LANG_WORDS: RegExp[] = [
  R("ⴼⵔⴰⵏⵙⵉⵙⵜ|french|français|francais|الفرنسية|بالفرنسية|بالفرونسي|fransawiya|bel ?fransi"),
  R("ⵏⴳⵍⵉⵣⵜ|english|anglais|الإنجليزية|الانجليزية|بالنكليزية|ngliziya|nglizia|bel ?ngliz"),
  R("ⵙⴱⵏⵢⵓⵍⵉⵜ|spanish|espagnol|الإسبانية|بالإسبانية|بالسبنيولية|sbanyoliya"),
  R("german|allemand|الألمانية|deutsch"),
  R("\\barab|arabe|العربية|الدارجة|darija|\\b3arbiya"),
  R("amazigh|tamazight|tachelhit|tarifit|الأمازيغية|تشلحيت|tachlhit"),
];

const RULES: Rule[] = [
  { id: "customer_service", re: R("customer|\\bclients?\\b|clientèle|clientele|accueil|زبون|زبناء|زبائن|الكليان|كليان|كليانة|أستقبل|\\bklyan|\\bkliyan|\\bzboun|\\bzbayen|ⵉⵎⵙⴰⵖⵏ|ⵎⵙⴰⵖⵏ|ⴰⵎⵙⴰⵖ") },
  { id: "sales", re: R("\\bsales?\\b|\\bsell|\\bsold\\b|vente|vend[suer]|vendu|بيع|بعت|مبيعات|كنبيع|بيعت|بعنا|أبيع|\\bkanbi3|\\bnbi3|\\bbi3t?\\b|\\bbi3na|ⵣⵣⵏⵣ|ⵣⵏⵣ|ⴰⵣⵣⵏⵣⵉ") },
  { id: "negotiation", re: R("negotiat|négoci|negoci|supplier|fournisseur|تفاوض|مورد|كنتفاوض|الفورنيسور|أفاوض|فاوضت|fournisor|ⵎⵎⵙⴰⵙⴰ|ⵎⵙⴰⵙⴰ|ⴰⵎⵣⵣⵏⵣ|ⵉⵎⵣⵣⵏⵣⵏ") },
  { id: "cash", re: R("\\bcash\\b|\\btill\\b|caisse|budget|argent|money|صندوق|ميزانية|الكاسة|الفلوس|\\bl?kasa\\b|\\bflous|ⵜⵉⵇⵇⵉⵜ|ⵜⴰⵙⵎⴷⵉⵜ|ⵉⴷⵔⵉⵎⵏ") },
  { id: "inventory", re: R("\\bstock|inventor|marchandise|مخزون|السلعة|الستوك|\\bsel3a|\\bsl3a|ⴰⵙⵖⴱⴰⵍⵓ|ⵓⵙⵖⴱⴰⵍⵓ") },
  { id: "social_media", re: R("instagram|facebook|tiktok|linkedin|snapchat|youtube|social media|réseaux sociaux|reseaux sociaux|\\binsta\\b|إنستغرام|انستغرام|انستا|إنستا|فيسبوك|تيك ?توك|يوتيوب|ⵉⵣⴷⴰⵢⵏ ⵉⵎⵜⵜⵎⴰⵙⴰⵢⵏ") },
  { id: "content", re: R("\\bphotos?\\b|vid[eé]o|\\bcontent|contenu|\\breels?\\b|montage|صور|تصاور|فيديو|محتوى|مونتاج|ⵜⵉⵡⵍⴰⴼⵉⵏ|ⵜⴰⵡⵍⴰⴼⵜ") },
  { id: "teamwork", re: R("\\bteam|équipe|equipe|volunteer|bénévol|benevol|group project|projet de groupe|فريق|متطوع|الجمعية|الفرقة|\\bjam3iya|\\bfari9|\\bfariq|ⵜⴰⵔⴱⴰⵄⵜ|ⵜⵎⵙⵎⵓⵏⵜ|ⵜⴰⵎⵙⵎⵓⵏⵜ") },
  { id: "leadership", re: R("coordinat|coordonn|\\bled\\b|\\blead|organi[sz]ed|managed|supervis|encadr|responsable|chef d['’]équipe|نسقت|قدت|أشرفت|سيرت|كنسير|مسؤول على|مسؤولة على|أدرت|نظمت|نظّمت|\\borganisit|\\bnadamt|\\bnaddamt|\\bmas2oul|\\bmes2oul|\\bmasoul|ⵙⵙⵓⴷⵙⵖ|ⵙⵙⵓⴷⵓⵖ|ⴰⵏⴱⴱⴰⴹ") },
  { id: "event", re: R("\\bevents?\\b|événement|evenement|évènement|campaign|campagne|tournament|tournoi|soirée|soiree|\\bparty|fête|festival|conference|conférence|workshop|atelier|wedding|mariage|حملة|فعالية|تظاهرة|نشاط|حفلة|حفل|دوري|بطولة|مهرجان|ورشة|خرجة|عرس|سهرة|\\bnashat|\\bnachat|\\bn[ae]cha[tt]|\\b7afla|\\bmahrajan|ⵜⴰⵎⵖⵔⴰ|ⵜⵎⵖⵔⴰ|ⵜⵉⵎⵖⵔⵉⵡⵉⵏ") },
  { id: "research", re: R("survey|questionnaire|market study|étude de marché|research|recherche|enquête|enquete|sondage|mémoire|دراسة سوق|استمارة|سونداج|بحث|استطلاع|\\bba7t|ⴰⵙⵇⵙⵉ|ⵓⵙⵇⵙⵉ|ⴰⵔⵣⵣⵓ") },
  { id: "presentation", re: R("\\bpresent(ed|ing|ation)|présent|exposé|expose\\b|jury|pitch|soutenance|قدمت|لجنة|عرضت|برزنتاسيون|\\b3radt|\\bprezent|ⵙⵙⴽⴰⵏⵖ|ⵙⵙⴽⵏⵖ") },
  { id: "problem_solving", re: R("problem|problème|\\bsolv|résolu|résoudre|resoudre|مشكل|حلول|حللت|حليت|مشكلة|\\bmochkil|\\bmouchkil|\\bmuchkil|ⵜⴰⵎⵓⴽⵔⵉⵙⵜ|ⵜⵎⵓⴽⵔⵉⵙⵜ") },
  {
    id: "multilingual",
    re: R("\\b(two|three|four|2|3|4) languages|\\b(deux|trois|quatre|2|3|4) langues|(جوج|زوج|ثلاث|تلاتة|ربعة|أربع|2|3|4) (لغات|اللغات)|\\b(3|4|jouj|tlata) (lughat|loghat)|" + LANG_WORDS.map((r) => r.source).join("|")),
    guard: (t) => /\b(two|three|four|2|3|4) languages|\b(deux|trois|quatre|2|3|4) langues|(جوج|زوج|ثلاث|تلاتة|ربعة|أربع|2|3|4) (لغات|اللغات)|\b(3|4|jouj|tlata) (lughat|loghat)/iu.test(t) || LANG_WORDS.filter((r) => r.test(t)).length >= 2,
  },
  { id: "excel", re: R("excel|spreadsheet|tableur|pivot|google sheets|إكسل|اكسل|إكسيل|اكسيل|ⵜⵉⴼⵍⵡⵉⵏ ⵏ ⵜⵙⵍⵍⵖⵜ") },
  { id: "crm", re: R("\\bcrm\\b|hubspot|salesforce|zoho|odoo") },
  { id: "b2b", re: R("\\bb2b\\b|companies|entreprises|شركات|مقاولات|الشركات|\\bcharikat") },
  { id: "powerbi", re: R("power ?bi|dashboards?|tableau de bord|لوحة قيادة|looker") },
  { id: "sql", re: R("\\bsql\\b|requêtes?|\\bquer(y|ies)\\b|postgres|mysql|استعلام") },
  { id: "ads", re: R("\\bads?\\b|publicité|publicite|sponsoris|meta ads|google ads|إعلان|إشهار|سبونسور|\\bsponso|ⴰⵙⴼⴼⵍⴰⵍ|ⵉⵙⴼⴼⵍⴰⵍ") },
  { id: "accounting", re: R("accounting|bookkeep|comptab|\\bcompta\\b|factur|invoice|bilan|محاسبة|المحاسبة|الحسابات|فاتورة|فواتير|\\bl?m7asaba") },
  { id: "project_management", re: R("project manag|gestion de projet|chef de projet|\\btrello\\b|\\bjira\\b|\\bnotion\\b|deadline|échéancier|retroplanning|تسيير المشروع|إدارة المشاريع|تدبير المشروع") },
  { id: "writing", re: R("\\bwrote\\b|\\bwriting\\b|copywrit|rédig|redig|rédaction|redaction|articles?\\b|\\bblog|newsletter|كتبت|مقال|مقالات|تحرير|\\bktebt") },
  { id: "graphic_design", re: R("photoshop|illustrator|figma|canva|\\blogos?\\b|affiche|poster|flyer|graphic design|design graphique|تصميم|لوغو|ملصق|\\bdesign\\b") },
  { id: "programming", re: R("python|javascript|typescript|\\bjava\\b|\\bhtml\\b|\\bcss\\b|react|\\bphp\\b|\\bcod(e|ing|é)\\b|programm|développ(é|e) (un|une) (site|app)|built (a|an) (website|app)|برمجة|برمجت|\\bcodit") },
  { id: "data_analysis", re: R("data analys|analyse de données|analyse des données|statisti|\\bspss\\b|\\bstata\\b|\\bpandas\\b|tableau software|تحليل البيانات|تحليل المعطيات|إحصاء|إحصائيات") },
];

const NEG = R(
  "(\\b(not|never|no|without|didn['’]?t|don['’]?t|haven['’]?t|wasn['’]?t|couldn['’]?t|can['’]?t)\\b|n['’]t\\b|\\b(ne|n['’]|jamais|pas|sans|aucun|aucune)\\b|(^|\\s)(لا|لم|لن|ليس|لست|بدون|بلا|ما|عمري ما|ماشي)(\\s|$)|\\bma\\w*(sh|ch)\\b|\\b(mashi|machi|walo)\\b)",
);

export function normalize(text: string): string {
  return text
    .replace(/[ً-ْـ]/g, "") // Arabic diacritics + tatweel
    .replace(/\s+/g, " ")
    .trim();
}

export function sentences(text: string): string[] {
  return normalize(text)
    .split(/(?<=[.!?؟。\n])\s+|[\n;؛]+|(?:\s[-–—]\s)/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

/** A sentence is negated when a negation word appears shortly before the matched term. */
function negatedAround(sentence: string, termIndex: number): boolean {
  const before = sentence.slice(Math.max(0, termIndex - 40), termIndex);
  return NEG.test(before + " ");
}

export function detectSkills(text: string, opts: { disabled?: Set<string> } = {}): Detection[] {
  const clean = normalize(text);
  if (clean.length < 3) return [];
  const parts = sentences(clean);
  const out: Detection[] = [];
  for (const rule of RULES) {
    if (opts.disabled?.has(rule.id)) continue;
    if (rule.guard && !rule.guard(clean)) continue;
    for (const s of parts) {
      const m = rule.re.exec(s);
      if (!m) continue;
      if (negatedAround(s, m.index)) continue;
      out.push({ skillId: rule.id, quote: s.slice(0, 600), term: m[0] });
      break;
    }
  }
  return out;
}

export const ENGINE_SKILL_IDS = RULES.map((r) => r.id);
