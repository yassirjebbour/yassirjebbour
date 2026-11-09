/**
 * Interview simulation: question generation from the target role's skills, and a transparent
 * rubric for answers (STAR structure, first-person action, measurable result, length).
 * The rubric is deterministic so scores are reproducible; the LLM (when present) adds coaching
 * in natural language on top, but never changes the score.
 */
import { pick, type Locale, type Localized } from "@/i18n/config";
import { SKILLS } from "./catalog";

const GENERAL: Localized[] = [
  { en: "Introduce yourself in one minute.", fr: "Présentez-vous en une minute.", ar: "قدّم نفسك في دقيقة واحدة.", ary: "عرّف براسك فدقيقة وحدة." },
  { en: "Why this role, and why this organisation?", fr: "Pourquoi ce poste et pourquoi cette organisation ?", ar: "لماذا هذا المنصب ولماذا هذه المؤسسة؟", ary: "علاش هاد البوسط وعلاش هاد الشركة بالضبط؟" },
  { en: "Tell me about a problem you solved. What did you do and what was the result?", fr: "Parlez-moi d’un problème que vous avez résolu. Qu’avez-vous fait et quel a été le résultat ?", ar: "حدّثني عن مشكلة حللتها. ماذا فعلت وما النتيجة؟", ary: "عاود ليا على شي مشكل حليتيه. شنو درتي وشنو كانت النتيجة؟" },
];
const PER_SKILL: Localized = {
  en: "Give me a concrete example of when you used {skill}. What was the situation, what did you do, and what changed?",
  fr: "Donnez-moi un exemple concret où vous avez utilisé la compétence « {skill} ». Quelle était la situation, qu’avez-vous fait, et qu’est-ce qui a changé ?",
  ar: "أعطني مثالاً ملموساً استعملت فيه مهارة «{skill}». ما كانت الوضعية، وماذا فعلت، وما الذي تغيّر؟",
  ary: "عطيني مثال واضح فين خدمتي ب«{skill}». شنو كانت الوضعية، شنو درتي، وشنو تبدّل؟",
};
const GAP_Q: Localized = {
  en: "This role needs {skill}, which is new for you. How would you get up to speed in your first month?",
  fr: "Ce poste demande « {skill} », que vous n’avez pas encore pratiqué. Comment monteriez-vous en compétence pendant votre premier mois ?",
  ar: "يتطلب هذا المنصب مهارة «{skill}» وهي جديدة عليك. كيف ستكتسبها خلال شهرك الأول؟",
  ary: "هاد البوسط كيطلب «{skill}» وباقي ما خدمتي بيها. كيفاش غادي تتعلمها فالشهر اللول؟",
};

export interface InterviewQuestion { id: string; text: string; skillId: string | null; kind: "general" | "skill" | "gap" }

export function buildQuestions(opts: { locale: Locale; haveSkills: string[]; missingSkills: string[]; count?: number }): InterviewQuestion[] {
  const n = Math.min(Math.max(opts.count ?? 5, 1), 8);
  const name = (id: string) => pick(SKILLS.find((s) => s.id === id)?.names, opts.locale) || id;
  const qs: InterviewQuestion[] = [{ id: "g1", text: pick(GENERAL[0], opts.locale), skillId: null, kind: "general" }];
  opts.haveSkills.slice(0, 3).forEach((s, i) => qs.push({ id: `s${i + 1}`, text: pick(PER_SKILL, opts.locale).replace("{skill}", name(s)), skillId: s, kind: "skill" }));
  if (opts.missingSkills[0]) qs.push({ id: "gap1", text: pick(GAP_Q, opts.locale).replace("{skill}", name(opts.missingSkills[0])), skillId: opts.missingSkills[0], kind: "gap" });
  qs.push({ id: "g2", text: pick(GENERAL[1], opts.locale), skillId: null, kind: "general" }, { id: "g3", text: pick(GENERAL[2], opts.locale), skillId: null, kind: "general" });
  return qs.slice(0, n);
}

const SITUATION = /\b(when|while|during|at my|last (year|summer)|lorsque|quand|pendant|l'été|lors de|au sein)\b|عندما|خلال|حين|ملي|فاش|فالصيف|فالعام|f lsif|melli|mlli/iu;
const ACTION = /\b(i (led|organi[sz]ed|built|created|sold|managed|handled|negotiated|designed|wrote|trained|analy[sz]ed|solved|fixed|planned|made|started|launched)|j['’]ai (organisé|géré|créé|vendu|négocié|conçu|rédigé|analysé|résolu|lancé|mis en place|formé|développé))\b|قمت|أنجزت|نظمت|أدرت|بعت|حللت|صممت|درت|نظّمت|سيّرت|بعت|حليت|\b(drt|dert|nadamt|khdemt|bi3t)\b/iu;
const RESULT = /\b(result|so that|which (led|increased|reduced)|increase|decrease|grew|saved|résultat|ce qui a|augment|réduit|économis|permis de)\b|نتيجة|ارتفع|انخفض|زاد|نقص|وفّر|\b(natija|tzad)\b|\d+\s?(%|percent|pour ?cent|dh|mad|درهم|clients?|people|personnes|participants|ventes|sales)/iu;
const NUMBER = /\d/;
const FIRST_PERSON = /\b(i|my|me|je|j['’]|moi|mon|ma|mes)\b|أنا|قمت|درت|\bana\b/iu;

export interface AnswerScore { score: number; words: number; checks: { situation: boolean; action: boolean; result: boolean; number: boolean; firstPerson: boolean; length: "short" | "ok" | "long" }; tips: string[] }

/** Tip codes are translated by the UI / basic engine (assistant.tips.*). */
export function scoreAnswer(answer: string): AnswerScore {
  const words = (answer.trim().match(/\S+/g) ?? []).length;
  const checks = {
    situation: SITUATION.test(answer),
    action: ACTION.test(answer),
    result: RESULT.test(answer),
    number: NUMBER.test(answer),
    firstPerson: FIRST_PERSON.test(answer),
    length: (words < 40 ? "short" : words > 260 ? "long" : "ok") as "short" | "ok" | "long",
  };
  let score = 0;
  score += checks.situation ? 15 : 0;
  score += checks.action ? 30 : 0;
  score += checks.result ? 25 : 0;
  score += checks.number ? 15 : 0;
  score += checks.firstPerson ? 5 : 0;
  score += checks.length === "ok" ? 10 : checks.length === "long" ? 5 : 0;
  const tips: string[] = [];
  if (!checks.situation) tips.push("add_situation");
  if (!checks.action) tips.push("add_action");
  if (!checks.result) tips.push("add_result");
  if (!checks.number) tips.push("add_number");
  if (checks.length === "short") tips.push("too_short");
  if (checks.length === "long") tips.push("too_long");
  return { score, words, checks, tips };
}
