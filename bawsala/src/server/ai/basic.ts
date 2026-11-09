/**
 * Basic engine: deterministic intent detection + localised rendering of tool results.
 * It calls the same tools as the LLM engine, so every number and list is real data.
 */
import { translator, type TFn } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import type { ToolCallRecord } from "../repo/conversations";

export type IntentKind = "skills" | "opportunities" | "gap" | "plan" | "cv" | "interview" | "progress" | "compare" | "profile" | "resources" | "knowledge" | "help";

const R = (s: string) => new RegExp(s, "iu");
const RULES: Array<[IntentKind, RegExp]> = [
  ["cv", R("\\bcv\\b|resume|résumé|curriculum|سيرة|سيفي|السيفي")],
  ["interview", R("interview|entretien|مقابل|mo9abala|m9abla|entrevue")],
  ["compare", R("compar|choose between|choisir entre|lequel|which one|قارن|مقارنة|نختار|ashmen|achmen|chmen|wach ndir")],
  ["plan", R("\\bplan\\b|roadmap|parcours|programme|path|خطة|طريق|مسار|برنامج|\\b30\\b|\\bt9ad\\b|plan dyal")],
  ["gap", R("\\bgap\\b|missing|lack|manque|il me manque|ناقص|ينقص|فجوة|خاصني|na9es|kh[a]?sni|naqes")],
  ["progress", R("progress|progrès|avancement|où j'en suis|تقدم|تقدّمي|فين وصلت|fin wselt|t9adom")],
  ["profile", R("profil|profile|improve my|améliorer|حسّن|تحسين|بروفايل")],
  ["resources", R("course|cours|formation gratuite|learn|apprendre|resource|ressource|تعلم|دورة|موارد|nt3lem|t3lem")],
  // Named institutions, programmes and statistics are factual questions → knowledge base first.
  ["knowledge", R("anapec|ofppt|auto[- ]?entrepreneur|مقاول ذاتي|chômage|unemployment|بطالة|hcp|europass|isco|esco|loi|قانون")],
  ["opportunities", R("job|emploi|stage|internship|opportunit|offre|poste|travail|work|فرص|فرصة|خدمة|خدمات|الخدمات|شغل|وظيف|وظائف|مناسبة ليا|تدريب|khdma|lkhdma|stage|t9dar|role|métier")],
  ["skills", R("skill|compétence|competence|مهار|كفاء|mahara|maharat|analy[sz]|حلل|what can i|qu'est-ce que je sais|شنو نقدر|chno n9der")],
];

export function detectIntent(text: string): { kind: IntentKind; calls: Array<{ name: string; input: Record<string, unknown> }> } {
  const t = text.trim();
  const long = t.length >= 80;
  const cvLike = t.length >= 200 && /@|\+212|\b0[67]\d{8}\b/.test(t);
  let kind: IntentKind = "help";
  if (cvLike) kind = "cv";
  // A long statement (not a question) is the student describing what they did → skill analysis.
  else if (long && !/[?؟]/.test(t) && !RULES.find(([k]) => k === "plan")![1].test(t)) kind = "skills";
  else for (const [k, re] of RULES) if (re.test(t)) { kind = k; break; }
  // A long description of something the student did is a skill-analysis request.
  if (kind === "help" && long) kind = "skills";
  switch (kind) {
    case "skills": return { kind, calls: [{ name: "analyze_skills", input: long ? { text: t.slice(0, 4000) } : {} }] };
    case "opportunities": return { kind, calls: [{ name: "match_opportunities", input: { limit: 5 } }] };
    case "gap": return { kind, calls: [{ name: "analyze_skill_gap", input: {} }] };
    case "plan": return { kind, calls: [{ name: "create_learning_roadmap", input: { days: 30 } }] };
    case "cv": {
      const fileId = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i.exec(t)?.[0];
      if (fileId) return { kind, calls: [{ name: "analyze_cv", input: { file_id: fileId } }] };
      return { kind, calls: t.length >= 50 && (cvLike || long) ? [{ name: "analyze_cv", input: { cv_text: t.slice(0, 12000) } }] : [] };
    }
    case "interview": return { kind, calls: [{ name: "interview_simulation", input: { mode: "questions", count: 5 } }] };
    case "progress": return { kind, calls: [{ name: "analyze_progress", input: {} }] };
    case "compare": return { kind, calls: [{ name: "compare_options", input: {} }] };
    case "profile": return { kind, calls: [{ name: "improve_profile", input: {} }] };
    case "resources": return { kind, calls: [{ name: "find_learning_resources", input: {} }] };
    case "knowledge": return { kind, calls: [{ name: "search_knowledge", input: { query: t.slice(0, 300) } }] };
    default: return { kind, calls: [] };
  }
}

type Out = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any -- tool outputs are validated by their zod schemas

const statusTag = (t: TFn, s: string) => (s === "demo" ? t("chat.status.demo") : s === "verified" ? t("chat.status.verified") : t("chat.status.unverified"));
const esc = (s: unknown) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

export function renderBasic(kind: IntentKind, records: ToolCallRecord[], locale: Locale, userText: string): string {
  const t = translator(locale);
  const out = (name: string) => records.find((r) => r.name === name && r.ok)?.output as Out | undefined;
  const failed = records.some((r) => !r.ok);
  const lines: string[] = [];

  switch (kind) {
    case "skills": {
      const o = out("analyze_skills");
      if (!o) break;
      if (!o.found.length) lines.push(userText.length >= 80 ? t("chat.skills.none") : t("chat.skills.ask_text"));
      else {
        lines.push(t("chat.skills.found", { n: o.found.length }));
        for (const f of o.found) lines.push(`- **${f.skill}** — “${esc(f.quote).slice(0, 160)}”${f.already_in_passport ? ` _(${t("chat.skills.already")})_` : ""}`);
        if (o.new_suggestions > 0) lines.push("", t("chat.skills.review"));
      }
      break;
    }
    case "opportunities": {
      const o = out("match_opportunities");
      if (!o) break;
      if (!o.results.length) { lines.push(t("chat.opps.none")); break; }
      lines.push(t("chat.opps.title"), "", `| ${t("chat.opps.th_role")} | ${t("chat.opps.th_fit")} | ${t("chat.opps.th_missing")} | ${t("chat.opps.th_data")} |`, "|---|---|---|---|");
      for (const r of o.results) lines.push(`| ${esc(r.title)} — ${esc(r.organization)} | ${r.fit.score}% (${r.fit.required_have}/${r.fit.required_total}) | ${esc(r.fit.missing_required.join(", ") || "—")} | ${statusTag(t, r.data_status)} |`);
      if (o.results.some((r: Out) => r.data_status === "demo")) lines.push("", t("chat.opps.demo_note"));
      break;
    }
    case "gap": {
      const o = out("analyze_skill_gap");
      if (!o) break;
      lines.push(t("chat.gap.title", { role: o.opportunity.title }));
      lines.push(`- ${t("chat.gap.have")}: ${o.fit.have.join(", ") || "—"}`);
      if (!o.gaps.length) lines.push(`- ${t("chat.gap.none")}`);
      for (const g of o.gaps) lines.push(`- **${g.skill}**${g.required ? "" : ` (${t("chat.gap.nice")})`}${g.resource ? ` — ${g.resource_url ? `[${g.resource}](${g.resource_url})` : g.resource}${g.hours ? ` · ~${g.hours} h` : ""}` : ""}`);
      lines.push("", t("chat.gap.evidence", { evidenced: o.readiness.evidenced, required: o.readiness.required }));
      if (o.opportunity.data_status === "demo") lines.push("", t("chat.opps.demo_note"));
      break;
    }
    case "plan": {
      const o = out("create_learning_roadmap");
      if (!o) break;
      lines.push(t("chat.plan.drafted", { role: o.title, n: o.tasks.length, days: o.days }));
      for (const task of o.tasks.slice(0, 6)) lines.push(`- ${t("chat.plan.day", { n: task.day })}: ${task.title}`);
      if (o.tasks.length > 6) lines.push(`- … ${t("chat.plan.more", { n: o.tasks.length - 6 })}`);
      lines.push("", t("chat.plan.confirm"));
      break;
    }
    case "cv": {
      const o = out("analyze_cv");
      if (!o) { lines.push(t("chat.cv.ask")); break; }
      lines.push(t("chat.cv.title", { words: o.report.words }));
      if (!o.report.issues.length) lines.push(`- ${t("chat.cv.good")}`);
      for (const code of o.report.issues.slice(0, 8)) lines.push(`- ${t(`chat.cv.issue.${code}` as never)}`);
      if (o.skills_found.length) lines.push("", t("chat.cv.skills", { list: o.skills_found.map((s: Out) => s.skill).join(", ") }));
      break;
    }
    case "interview": {
      const o = out("interview_simulation");
      if (!o) break;
      lines.push(t("chat.interview.intro", { role: o.role ?? "" }));
      (o.questions ?? []).forEach((q: Out, i: number) => lines.push(`${i + 1}. ${q.text}`));
      lines.push("", t("chat.interview.how"));
      break;
    }
    case "progress": {
      const o = out("analyze_progress");
      if (!o) break;
      if (o.plan) {
        lines.push(t("chat.progress.plan", { title: o.plan.title, done: o.plan.done, total: o.plan.total }));
        if (o.plan.overdue) lines.push(`- ${t("chat.progress.overdue", { n: o.plan.overdue })}`);
      } else lines.push(t("chat.progress.none"));
      lines.push(`- ${t("chat.progress.skills", { evidenced: o.skills_evidenced, total: o.skills_total })}`);
      lines.push(`- ${t("chat.progress.streak", { n: o.streak_days })}`);
      if (o.next_task) lines.push(`- ${t("chat.progress.next", { task: o.next_task.title })}`);
      if (o.pending_suggestions) lines.push(`- ${t("chat.progress.pending", { n: o.pending_suggestions })}`);
      break;
    }
    case "compare": {
      const o = out("compare_options");
      if (!o || !o.options.length) { lines.push(t("chat.opps.none")); break; }
      lines.push(t("chat.compare.title"), "", `| ${t("chat.opps.th_role")} | ${t("chat.opps.th_fit")} | ${t("chat.opps.th_missing")} | ${t("chat.compare.th_hours")} | ${t("chat.opps.th_data")} |`, "|---|---|---|---|---|");
      for (const op of o.options) lines.push(`| ${esc(op.opportunity.title)} | ${op.fit_score}% | ${esc(op.missing_required.join(", ") || "—")} | ~${op.hours_to_close_gaps} h | ${statusTag(t, op.opportunity.data_status)} |`);
      lines.push("", t("chat.compare.note"));
      break;
    }
    case "profile": {
      const o = out("improve_profile");
      if (!o) break;
      lines.push(t("chat.profile.title", { done: o.completeness.done, total: o.completeness.total }));
      if (!o.actions.length) lines.push(`- ${t("chat.profile.complete")}`);
      for (const a of o.actions) lines.push(`- ${t(`chat.profile.action.${a.code}` as never)} → [${a.page}](${a.page})`);
      break;
    }
    case "resources": {
      const o = out("find_learning_resources");
      if (!o) break;
      if (!o.resources.length) { lines.push(t("chat.resources.none")); break; }
      lines.push(t("chat.resources.title"));
      for (const r of o.resources) lines.push(`- **${r.skill}** — ${r.url ? `[${r.title}](${r.url})` : r.title}${r.hours ? ` · ~${r.hours} h` : ""}`);
      break;
    }
    case "knowledge": {
      const o = out("search_knowledge");
      if (!o || !o.passages.length) { lines.push(t("chat.knowledge.none")); break; }
      lines.push(t("chat.knowledge.title"));
      for (const p of o.passages.slice(0, 3)) lines.push("", `**[${p.n}] ${p.title}**${p.heading ? ` — ${p.heading.split(" › ").slice(-1)[0]}` : ""}`, "", `> ${esc(p.text).slice(0, 420)}${p.text.length > 420 ? "…" : ""}`);
      if (o.passages.slice(0, 3).some((p: Out) => p.status === "unverified")) lines.push("", t("chat.knowledge.unverified"));
      break;
    }
    default:
      lines.push(t("chat.help"));
  }
  if (failed) lines.push("", t("chat.error_tool"));
  lines.push("", `_${t("chat.basic_note")}_`);
  return lines.join("\n");
}
