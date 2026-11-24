/**
 * 30-day path generator (deterministic). The AI assistant can propose a personalised plan,
 * but this generator is the baseline that always works and is what "basic mode" uses.
 *
 * Shape, per missing skill (ordered by importance): learn → practice → prove.
 * Then: a portfolio project (if the role defines one) and an "apply" step.
 */
import { pick, type Locale, type Localized } from "@/i18n/config";
import { DRILLS, SKILLS } from "./catalog";

export type TaskKind = "learn" | "practice" | "prove" | "project" | "apply";
export interface DraftTask {
  position: number;
  day: number; // 1..30
  kind: TaskKind;
  title: string;
  detail?: string;
  skillId?: string;
  resourceUrl?: string;
  estimatedMinutes: number;
}

const T: Record<TaskKind, Localized> = {
  learn: { en: "Learn: {skill}", fr: "Apprendre : {skill}", ar: "تعلّم: {skill}", ary: "تعلّم: {skill}" },
  practice: { en: "Practise: {skill}", fr: "Pratiquer : {skill}", ar: "تدرّب: {skill}", ary: "تمرّن: {skill}" },
  prove: { en: "Prove it: {skill}", fr: "Le prouver : {skill}", ar: "أثبتها: {skill}", ary: "بيّنها: {skill}" },
  project: { en: "Portfolio project", fr: "Projet de portfolio", ar: "مشروع لملف الأعمال", ary: "مشروع للبورتفوليو" },
  apply: { en: "Apply to {role}", fr: "Postuler : {role}", ar: "قدّم ترشيحك: {role}", ary: "قدّم على: {role}" },
};

const GENERIC_PRACTICE: Localized = {
  en: "Use {skill} on a small real task this week (family business, club, class project) and write down what you did and the result.",
  fr: "Utilisez {skill} sur une petite tâche réelle cette semaine (commerce familial, club, projet de cours) et notez ce que vous avez fait et le résultat.",
  ar: "استعمل مهارة {skill} في مهمة حقيقية صغيرة هذا الأسبوع (تجارة العائلة، نادٍ، مشروع دراسي) ودوّن ما فعلته والنتيجة.",
  ary: "خدم ب{skill} فشي خدمة صغيرة حقيقية هاد السيمانة (الحانوت ديال العائلة، النادي، مشروع فالقراية) وكتب شنو درتي وشنو كانت النتيجة.",
};
const GENERIC_PROVE: Localized = {
  en: "Add proof to your passport: a link, a file or a short write-up with one number.",
  fr: "Ajoutez une preuve à votre passeport : un lien, un fichier ou un court récit avec un chiffre.",
  ar: "أضف دليلاً إلى جوازك: رابطاً أو ملفاً أو وصفاً قصيراً فيه رقم واحد على الأقل.",
  ary: "زيد دليل فالجواز ديالك: رابط، ملف ولا وصف قصير فيه رقم واحد على الأقل.",
};
const LEARN_DETAIL: Localized = {
  en: "Free resource · about {h} h",
  fr: "Ressource gratuite · environ {h} h",
  ar: "مورد مجاني · حوالي {h} ساعات",
  ary: "مورد فابور · تقريباً {h} سوايع",
};

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export function buildPlan(opts: {
  locale: Locale;
  missingSkillIds: string[]; // required first, then nice-to-have
  roleTitle?: string;
  project?: Localized | null;
  days?: number;
}): DraftTask[] {
  const { locale } = opts;
  const days = opts.days ?? 30;
  const skills = opts.missingSkillIds.slice(0, 4); // focus: at most 4 skills in 30 days
  const tasks: Omit<DraftTask, "position" | "day">[] = [];
  for (const id of skills) {
    const def = SKILLS.find((s) => s.id === id);
    if (!def) continue;
    const name = pick(def.names, locale);
    const drill = DRILLS[id];
    tasks.push({
      kind: "learn",
      title: fill(pick(T.learn, locale), { skill: name }),
      detail: def.learn ? `${pick(def.learn.title, locale)} — ${fill(pick(LEARN_DETAIL, locale), { h: def.learn.hours ?? 4 })}` : undefined,
      skillId: id,
      resourceUrl: def.learn?.url ?? undefined,
      estimatedMinutes: Math.min(600, (def.learn?.hours ?? 4) * 60),
    });
    tasks.push({
      kind: "practice",
      title: fill(pick(T.practice, locale), { skill: name }),
      detail: drill ? pick(drill.practice, locale) : fill(pick(GENERIC_PRACTICE, locale), { skill: name }),
      skillId: id,
      estimatedMinutes: 90,
    });
    tasks.push({
      kind: "prove",
      title: fill(pick(T.prove, locale), { skill: name }),
      detail: drill ? pick(drill.prove, locale) : pick(GENERIC_PROVE, locale),
      skillId: id,
      estimatedMinutes: 45,
    });
  }
  if (opts.project) tasks.push({ kind: "project", title: pick(T.project, locale), detail: pick(opts.project, locale), estimatedMinutes: 240 });
  if (opts.roleTitle) tasks.push({ kind: "apply", title: fill(pick(T.apply, locale), { role: opts.roleTitle }), estimatedMinutes: 60 });

  // Spread across the period; the last task lands on the last day.
  const n = tasks.length;
  return tasks.map((t, i) => ({ ...t, position: i + 1, day: n <= 1 ? days : Math.max(1, Math.round(1 + (i * (days - 1)) / (n - 1))) }));
}
