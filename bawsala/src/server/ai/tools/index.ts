/**
 * BAWSALA tools. Each one executes real backend logic against the signed-in student's data.
 * Calculations (fit scores, gaps, plans, rubric scores) are deterministic code; the model only
 * chooses which tool to call and explains the results.
 */
import { z } from "zod";
import { defineTool, type AnyTool } from "./registry";
import { pick } from "@/i18n/config";
import { SKILLS } from "../../domain/catalog";
import { computeFit, readiness } from "../../domain/matching";
import { buildQuestions, scoreAnswer } from "../../domain/interview";
import { analyzeCvText } from "../../domain/cv";
import { analyzeText } from "../analysis";
import { retrieve } from "../../rag/retrieve";
import { getPassport, ownedSkills, addSuggestions, pendingSuggestions } from "../../repo/skills";
import { listOpportunities, getOpportunity, rankedForUser, saveOpportunity } from "../../repo/opportunities";
import { getProfile } from "../../repo/profile";
import { listExperiences } from "../../repo/experiences";
import { draftPlanFor, progressStats, getActivePlan } from "../../repo/plans";
import { createPendingAction } from "../../repo/conversations";
import { isEnabled } from "../../flags";
import type { Locale } from "@/i18n/config";
import type { Opportunity } from "../../repo/opportunities";

const uuid = z.string().uuid();
const skillName = (id: string, locale: Locale) => pick(SKILLS.find((s) => s.id === id)?.names, locale) || id;

function oppSummary(o: Opportunity, locale: Locale) {
  return {
    id: o.id,
    title: pick(o.title, locale),
    organization: o.organization,
    city: o.city,
    kind: o.kind,
    data_status: o.is_sample ? ("demo" as const) : o.verification_status === "verified" ? ("verified" as const) : ("unverified" as const),
    source: o.source_name,
    source_url: o.source_url,
    apply_url: o.apply_url,
    updated: new Date(o.source_updated_at).toISOString().slice(0, 10),
  };
}
const OppOut = z.object({
  id: z.string(), title: z.string(), organization: z.string(), city: z.string().nullable(), kind: z.string(),
  data_status: z.enum(["verified", "unverified", "demo"]), source: z.string(), source_url: z.string().nullable(), apply_url: z.string().nullable(), updated: z.string(),
});
const FitOut = z.object({ score: z.number(), required_have: z.number(), required_total: z.number(), have: z.array(z.string()), missing_required: z.array(z.string()), missing_nice: z.array(z.string()) });
const fitOut = (f: ReturnType<typeof computeFit>, locale: Locale) => ({
  score: f.score, required_have: f.requiredHave, required_total: f.requiredTotal,
  have: f.have.map((s) => skillName(s, locale)), missing_required: f.missingRequired.map((s) => skillName(s, locale)), missing_nice: f.missingNice.map((s) => skillName(s, locale)),
});

async function targetOrBest(userId: string, opportunityId?: string) {
  if (opportunityId) return getOpportunity(opportunityId);
  const profile = await getProfile(userId);
  if (profile.target_opportunity_id) return getOpportunity(profile.target_opportunity_id);
  const ranked = await rankedForUser(userId);
  if (!ranked.length) throw Object.assign(new Error("no opportunities"), { code: "not_found" });
  return ranked[0].item;
}

// ---------------------------------------------------------------------------------------------

export const analyzeSkills = defineTool({
  name: "analyze_skills",
  description:
    "Detect skills in a description of something the student did (job, internship, family business, club, project). Saves them as *suggestions* that the student must accept or reject on the Passport page; nothing is added to the passport directly. Use when the student describes an experience or asks what skills they have. If no text is given, analyses the student's saved experiences.",
  permission: "suggest",
  input: z.object({ text: z.string().min(10).max(4000).optional().describe("The student's own words. Omit to analyse saved experiences.") }),
  output: z.object({
    engine: z.string(), new_suggestions: z.number(), discarded_hallucinations: z.number(),
    found: z.array(z.object({ skill: z.string(), skill_id: z.string(), quote: z.string(), reason: z.string().nullable(), already_in_passport: z.boolean() })),
    next_step: z.string(),
  }),
  async execute(ctx, input) {
    const allowLlm = ctx.allowLlm && (await isEnabled("ai.analysis", ctx.user));
    const owned = new Set((await ownedSkills(ctx.user.id)).map((s) => s.skillId));
    const texts = input.text ? [{ id: null as string | null, text: input.text }] : (await listExperiences(ctx.user.id)).slice(0, 5).map((e) => ({ id: e.id, text: `${e.title}. ${e.description}` }));
    let saved = 0, discarded = 0, engine = "rules";
    const found: Array<{ skill: string; skill_id: string; quote: string; reason: string | null; already_in_passport: boolean }> = [];
    for (const t of texts) {
      const r = await analyzeText(t.text, { userId: ctx.user.id, allowLlm, signal: ctx.signal });
      engine = r.engine; discarded += r.discardedHallucinations;
      saved += await addSuggestions(ctx.user.id, r.candidates.filter((c) => !owned.has(c.skillId)).map((c) => ({ ...c, experienceId: t.id })));
      for (const c of r.candidates) if (!found.some((f) => f.skill_id === c.skillId)) found.push({ skill: skillName(c.skillId, ctx.locale), skill_id: c.skillId, quote: c.quote, reason: c.reason, already_in_passport: owned.has(c.skillId) });
    }
    return { engine, new_suggestions: saved, discarded_hallucinations: discarded, found, next_step: saved ? "Ask the student to review the suggestions on the Passport page (/app/passport) and accept only the ones that are true." : "No new suggestion. Ask for a more detailed description: what they did, for whom, and one number." };
  },
});

export const analyzeCv = defineTool({
  name: "analyze_cv",
  description: "Check a CV the student pasted (or uploaded, if a file id is given): structure, contact details, measurable results, action verbs, sensitive data that should be removed, and skills found in it (with quotes). Read-only: does not change the passport.",
  permission: "read",
  input: z.object({ cv_text: z.string().min(50).max(12000).optional(), file_id: uuid.optional() }),
  output: z.object({
    report: z.object({ words: z.number(), sections: z.record(z.string(), z.boolean()), contact: z.record(z.string(), z.boolean()), numbers: z.number(), action_verbs: z.number(), sensitive: z.array(z.string()), issues: z.array(z.string()) }),
    skills_found: z.array(z.object({ skill: z.string(), quote: z.string() })),
    engine: z.string(),
  }),
  async execute(ctx, input) {
    let text = input.cv_text ?? "";
    if (!text && input.file_id) {
      const { getFileText } = await import("../../repo/files");
      text = (await getFileText(ctx.user.id, input.file_id)) ?? "";
    }
    if (text.length < 50) throw Object.assign(new Error("cv text missing or too short"), { code: "validation" });
    const r = analyzeCvText(text);
    const skills = await analyzeText(text.slice(0, 4000), { userId: ctx.user.id, allowLlm: ctx.allowLlm && (await isEnabled("ai.analysis", ctx.user)), signal: ctx.signal });
    return {
      report: { words: r.words, sections: r.sections, contact: r.contact, numbers: r.numbers, action_verbs: r.actionVerbs, sensitive: r.sensitive, issues: r.issues },
      skills_found: skills.candidates.map((c) => ({ skill: skillName(c.skillId, ctx.locale), quote: c.quote })),
      engine: skills.engine,
    };
  },
});

export const discoverCareers = defineTool({
  name: "discover_careers",
  description: "Suggest career directions from the student's confirmed skills: roles they already fit, and roles that are one or two skills away. Explains each with the skills they have and the ones they lack. Use for 'what can I do with my skills?' questions.",
  permission: "read",
  input: z.object({ limit: z.number().int().min(1).max(8).default(5) }),
  output: z.object({ skills_considered: z.number(), directions: z.array(z.object({ role: z.string(), opportunity_id: z.string(), data_status: z.string(), fit: FitOut, why: z.string() })) }),
  async execute(ctx, input) {
    const owned = await ownedSkills(ctx.user.id);
    const ranked = (await rankedForUser(ctx.user.id)).slice(0, input.limit);
    return {
      skills_considered: owned.length,
      directions: ranked.map(({ item, fit }) => ({
        role: pick(item.title, ctx.locale), opportunity_id: item.id, data_status: item.is_sample ? "demo" : "listed",
        fit: fitOut(fit, ctx.locale),
        why: fit.missingRequired.length === 0 ? "Has every required skill" : `${fit.requiredHave}/${fit.requiredTotal} required skills; missing ${fit.missingRequired.length}`,
      })),
    };
  },
});

export const matchOpportunities = defineTool({
  name: "match_opportunities",
  description: "List opportunities ranked by how well they fit the student's skills, with source, last update date and data status (verified / unverified / demo). Always tell the student when a result is demo data. Optional filters: city, kind (job, internship, training, volunteer, program).",
  permission: "read",
  input: z.object({ city: z.string().max(80).optional(), kind: z.enum(["job", "internship", "training", "volunteer", "program"]).optional(), limit: z.number().int().min(1).max(10).default(5) }),
  output: z.object({ total_listed: z.number(), results: z.array(OppOut.extend({ fit: FitOut })) }),
  async execute(ctx, input) {
    const ranked = await rankedForUser(ctx.user.id, { city: input.city, kind: input.kind });
    return { total_listed: ranked.length, results: ranked.slice(0, input.limit).map(({ item, fit }) => ({ ...oppSummary(item, ctx.locale), fit: fitOut(fit, ctx.locale) })) };
  },
});

export const analyzeSkillGap = defineTool({
  name: "analyze_skill_gap",
  description: "Compare the student's skills with one opportunity's requirements (their target role by default): what they have, what is missing, in priority order, with a free learning resource for each gap and the share of required skills backed by evidence.",
  permission: "read",
  input: z.object({ opportunity_id: uuid.optional() }),
  output: z.object({
    opportunity: OppOut, fit: FitOut,
    readiness: z.object({ required: z.number(), claimed: z.number(), evidenced: z.number() }),
    gaps: z.array(z.object({ skill: z.string(), required: z.boolean(), resource: z.string().nullable(), resource_url: z.string().nullable(), hours: z.number().nullable() })),
  }),
  async execute(ctx, input) {
    const opp = await targetOrBest(ctx.user.id, input.opportunity_id);
    const owned = await ownedSkills(ctx.user.id);
    const fit = computeFit(opp.requirements, owned);
    const gaps = [...fit.missingRequired.map((s) => ({ s, required: true })), ...fit.missingNice.map((s) => ({ s, required: false }))].map(({ s, required }) => {
      const def = SKILLS.find((x) => x.id === s);
      return { skill: skillName(s, ctx.locale), required, resource: def?.learn ? pick(def.learn.title, ctx.locale) : null, resource_url: def?.learn?.url ?? null, hours: def?.learn?.hours ?? null };
    });
    return { opportunity: oppSummary(opp, ctx.locale), fit: fitOut(fit, ctx.locale), readiness: readiness(opp.requirements, owned), gaps };
  },
});

export const createLearningRoadmap = defineTool({
  name: "create_learning_roadmap",
  description: "Draft a personalised path (7–90 days, default 30) towards an opportunity (the student's target by default): learn → practise → prove for each missing skill, then a portfolio project and an application step, with dates. The plan is NOT saved: the student sees it and must press Confirm. Replaces the current active plan only after confirmation.",
  permission: "confirm",
  input: z.object({ opportunity_id: uuid.optional(), days: z.number().int().min(7).max(90).default(30) }),
  output: z.object({ pending_action_id: z.string(), requires_confirmation: z.literal(true), title: z.string(), days: z.number(), tasks: z.array(z.object({ day: z.number(), kind: z.string(), title: z.string(), detail: z.string().nullable() })), fit: FitOut }),
  async execute(ctx, input) {
    const opp = await targetOrBest(ctx.user.id, input.opportunity_id);
    const draft = await draftPlanFor(ctx.user.id, opp.id, ctx.locale, input.days);
    const action = await createPendingAction(ctx.user.id, ctx.conversationId, "create_plan", { opportunityId: opp.id, title: draft.title, days: draft.days, tasks: draft.tasks });
    return {
      pending_action_id: action.id, requires_confirmation: true as const, title: draft.title, days: draft.days,
      tasks: draft.tasks.map((t) => ({ day: t.day, kind: t.kind, title: t.title, detail: t.detail ?? null })), fit: fitOut(draft.fit, ctx.locale),
    };
  },
});

export const findLearningResources = defineTool({
  name: "find_learning_resources",
  description: "Find free learning resources for specific skills (by id) or for the student's current gaps, from BAWSALA's catalogue and knowledge base, with links and estimated hours.",
  permission: "read",
  input: z.object({ skill_ids: z.array(z.string().max(40)).max(6).optional() }),
  output: z.object({ resources: z.array(z.object({ skill: z.string(), title: z.string(), url: z.string().nullable(), hours: z.number().nullable(), source: z.string() })) }),
  async execute(ctx, input) {
    let ids = input.skill_ids ?? [];
    if (!ids.length) {
      try {
        const opp = await targetOrBest(ctx.user.id);
        const fit = computeFit(opp.requirements, await ownedSkills(ctx.user.id));
        ids = [...fit.missingRequired, ...fit.missingNice].slice(0, 4);
      } catch { ids = []; }
    }
    const resources = ids.flatMap((id) => {
      const def = SKILLS.find((s) => s.id === id);
      return def?.learn ? [{ skill: skillName(id, ctx.locale), title: pick(def.learn.title, ctx.locale), url: def.learn.url, hours: def.learn.hours, source: "BAWSALA catalogue" }] : [];
    });
    return { resources };
  },
});

export const interviewSimulation = defineTool({
  name: "interview_simulation",
  description: "Interview practice for a role (target by default). mode 'questions' returns tailored questions (based on skills the student has and one gap). mode 'evaluate' scores one answer with a transparent STAR rubric (situation, action, result, number, length) and returns improvement tips. Ask one question at a time and evaluate each answer.",
  permission: "read",
  input: z.object({ mode: z.enum(["questions", "evaluate"]), opportunity_id: uuid.optional(), count: z.number().int().min(1).max(8).default(5), question: z.string().max(600).optional(), answer: z.string().max(4000).optional() }),
  output: z.object({
    role: z.string().nullable(),
    questions: z.array(z.object({ id: z.string(), text: z.string(), kind: z.string() })).optional(),
    evaluation: z.object({ score: z.number(), words: z.number(), checks: z.record(z.string(), z.union([z.boolean(), z.string()])), tips: z.array(z.string()) }).optional(),
  }),
  async execute(ctx, input) {
    if (input.mode === "evaluate") {
      if (!input.answer || input.answer.trim().length < 5) throw Object.assign(new Error("answer is required in evaluate mode"), { code: "validation" });
      return { role: null, evaluation: scoreAnswer(input.answer) };
    }
    const opp = await targetOrBest(ctx.user.id, input.opportunity_id);
    const fit = computeFit(opp.requirements, await ownedSkills(ctx.user.id));
    const qs = buildQuestions({ locale: ctx.locale, haveSkills: fit.have, missingSkills: fit.missingRequired, count: input.count });
    return { role: pick(opp.title, ctx.locale), questions: qs.map((q) => ({ id: q.id, text: q.text, kind: q.kind })) };
  },
});

export const applicationAssistant = defineTool({
  name: "application_assistant",
  description: "Prepare an application for one opportunity: maps each requirement to the student's own evidence (quotes, links), lists what is missing, returns a checklist, and the facts the model may use to draft a cover letter or message. Never invent experience: use only the evidence returned here. Read-only.",
  permission: "read",
  input: z.object({ opportunity_id: uuid, language: z.enum(["fr", "en", "ar"]).default("fr") }),
  output: z.object({
    opportunity: OppOut,
    matched_evidence: z.array(z.object({ requirement: z.string(), evidence: z.array(z.string()) })),
    missing: z.array(z.string()),
    checklist: z.array(z.string()),
    letter_language: z.string(),
  }),
  async execute(ctx, input) {
    const opp = await getOpportunity(input.opportunity_id);
    const passport = await getPassport(ctx.user.id);
    const byId = new Map(passport.map((p) => [p.skill_id, p]));
    const matched = opp.requirements.filter((r) => byId.has(r.skillId)).map((r) => ({
      requirement: skillName(r.skillId, ctx.locale),
      evidence: byId.get(r.skillId)!.evidence.map((e) => [e.text, e.url].filter(Boolean).join(" — ")).filter(Boolean).slice(0, 3),
    }));
    const missing = opp.requirements.filter((r) => r.required && !byId.has(r.skillId)).map((r) => skillName(r.skillId, ctx.locale));
    return {
      opportunity: oppSummary(opp, ctx.locale), matched_evidence: matched, missing,
      checklist: ["cv_one_page_in_offer_language", "one_number_per_experience", "cover_letter_names_two_requirements_with_evidence", "passport_link_or_portfolio", "check_deadline_and_source", ...(opp.is_sample ? ["demo_data_do_not_apply"] : [])],
      letter_language: input.language,
    };
  },
});

export const analyzeProgress = defineTool({
  name: "analyze_progress",
  description: "Summarise the student's progress: active plan completion (tasks done/total, overdue, due today), streak of active days, skills with evidence, next task, and pending skill suggestions.",
  permission: "read",
  input: z.object({}),
  output: z.object({
    plan: z.object({ title: z.string(), done: z.number(), total: z.number(), overdue: z.number(), due_today: z.number(), ends_on: z.string() }).nullable(),
    streak_days: z.number(), active_days: z.number(), skills_total: z.number(), skills_evidenced: z.number(), pending_suggestions: z.number(),
    next_task: z.object({ title: z.string(), due_on: z.string(), kind: z.string() }).nullable(),
  }),
  async execute(ctx) {
    const s = await progressStats(ctx.user.id);
    const pending = (await pendingSuggestions(ctx.user.id)).length;
    return {
      plan: s.plan ? { title: s.plan.title, done: s.plan.done, total: s.plan.total, overdue: s.plan.overdue, due_today: s.plan.due_today, ends_on: s.plan.ends_on } : null,
      streak_days: s.streakDays, active_days: s.activeDays, skills_total: s.skills.total, skills_evidenced: s.skills.evidenced, pending_suggestions: pending,
      next_task: s.next ? { title: s.next.title, due_on: s.next.due_on, kind: s.next.kind } : null,
    };
  },
});

export const compareOptions = defineTool({
  name: "compare_options",
  description: "Career decision support: compare 2–4 opportunities side by side for this student — fit score, missing required skills, estimated learning hours to close the gaps, evidence coverage, city, data status. Without ids, compares the top 3 matches. Returns facts; the decision stays with the student.",
  permission: "read",
  input: z.object({ opportunity_ids: z.array(uuid).min(2).max(4).optional() }),
  output: z.object({ options: z.array(z.object({ opportunity: OppOut, fit_score: z.number(), missing_required: z.array(z.string()), hours_to_close_gaps: z.number(), evidenced_required: z.number(), required_total: z.number() })) }),
  async execute(ctx, input) {
    const owned = await ownedSkills(ctx.user.id);
    const opps = input.opportunity_ids?.length ? await Promise.all(input.opportunity_ids.map((id) => getOpportunity(id))) : (await rankedForUser(ctx.user.id)).slice(0, 3).map((r) => r.item);
    return {
      options: opps.map((o) => {
        const fit = computeFit(o.requirements, owned);
        const hours = fit.missingRequired.reduce((h, s) => h + (SKILLS.find((x) => x.id === s)?.learn?.hours ?? 4), 0);
        const rd = readiness(o.requirements, owned);
        return { opportunity: oppSummary(o, ctx.locale), fit_score: fit.score, missing_required: fit.missingRequired.map((s) => skillName(s, ctx.locale)), hours_to_close_gaps: hours, evidenced_required: rd.evidenced, required_total: rd.required };
      }),
    };
  },
});

export const improveProfile = defineTool({
  name: "improve_profile",
  description: "Career profile improvement: checks what is missing or weak in the student's profile and passport (education, city, languages, goal, experiences, confirmed skills, evidence, target role) and returns prioritised actions with the page where to do each.",
  permission: "read",
  input: z.object({}),
  output: z.object({ completeness: z.object({ done: z.number(), total: z.number() }), actions: z.array(z.object({ code: z.string(), priority: z.number(), page: z.string() })) }),
  async execute(ctx) {
    const [p, exps, passport, pending] = await Promise.all([getProfile(ctx.user.id), listExperiences(ctx.user.id), getPassport(ctx.user.id), pendingSuggestions(ctx.user.id)]);
    const checks: Array<[boolean, string, number, string]> = [
      [!!p.field_of_study && !!p.education_level, "add_education", 2, "/app/profile"],
      [!!p.city, "add_city", 3, "/app/profile"],
      [p.languages.length >= 2, "add_languages", 3, "/app/profile"],
      [!!p.goal, "add_goal", 2, "/app/profile"],
      [exps.length >= 2, "add_experience", 1, "/app/profile#experiences"],
      [pending.length === 0, "review_suggestions", 1, "/app/passport"],
      [passport.length >= 3, "confirm_skills", 1, "/app/passport"],
      [passport.some((s) => s.status === "evidenced" || s.status === "verified"), "add_evidence", 2, "/app/passport"],
      [!!p.target_opportunity_id, "choose_target", 2, "/app/opportunities"],
    ];
    const actions = checks.filter(([ok]) => !ok).map(([, code, priority, page]) => ({ code, priority, page })).sort((a, b) => a.priority - b.priority);
    return { completeness: { done: checks.filter(([ok]) => ok).length, total: checks.length }, actions };
  },
});

export const searchKnowledge = defineTool({
  name: "search_knowledge",
  description: "Search BAWSALA's knowledge base (Moroccan labour-market figures, institutions such as ANAPEC and OFPPT, self-employment, CV/interview guides, skill and role profiles). Returns passages with numbered sources, their verification status and dates. Use it for factual questions; cite sources as [1], [2]. If a source is 'unverified', tell the student to confirm it on the official site.",
  permission: "read",
  input: z.object({ query: z.string().min(2).max(300), kinds: z.array(z.enum(["skill", "occupation", "pathway", "resource", "labor_market", "institution", "program", "guide", "policy"])).max(4).optional() }),
  output: z.object({ mode: z.string(), passages: z.array(z.object({ n: z.number(), text: z.string(), title: z.string(), source: z.string(), url: z.string().nullable(), status: z.string(), verified_at: z.string().nullable(), heading: z.string().nullable() })) }),
  async execute(ctx, input) {
    if (!(await isEnabled("rag.search", ctx.user))) return { mode: "disabled", passages: [] };
    const r = await retrieve(input.query, { k: 5, kinds: input.kinds, userId: ctx.user.id });
    return {
      mode: r.mode,
      passages: r.results.map((c, i) => ({ n: i + 1, text: c.content.slice(0, 1200), title: c.doc.title, source: c.doc.sourceName, url: c.doc.sourceUrl, status: c.doc.verificationStatus, verified_at: c.doc.verifiedAt, heading: c.heading })),
    };
  },
});

export const saveOpportunityTool = defineTool({
  name: "save_opportunity",
  description: "Save an opportunity to the student's list (reversible; they can remove it on the Opportunities page). Only call when the student asks to save or bookmark it.",
  permission: "reversible",
  input: z.object({ opportunity_id: uuid }),
  output: z.object({ saved: z.boolean(), title: z.string() }),
  async execute(ctx, input) {
    const o = await getOpportunity(input.opportunity_id);
    await saveOpportunity(ctx.user.id, o.id, "saved");
    return { saved: true, title: pick(o.title, ctx.locale) };
  },
});

export const getMyPlan = defineTool({
  name: "get_my_plan",
  description: "Read the student's active plan with every task, due date and completion state.",
  permission: "read",
  input: z.object({}),
  output: z.object({ plan: z.object({ title: z.string(), starts_on: z.string(), ends_on: z.string(), tasks: z.array(z.object({ title: z.string(), kind: z.string(), due_on: z.string(), done: z.boolean() })) }).nullable() }),
  async execute(ctx) {
    const p = await getActivePlan(ctx.user.id);
    return { plan: p ? { title: p.title, starts_on: p.starts_on, ends_on: p.ends_on, tasks: p.tasks.map((t) => ({ title: t.title, kind: t.kind, due_on: t.due_on, done: !!t.completed_at })) } : null };
  },
});

export const TOOLS: AnyTool[] = [
  analyzeSkills, analyzeCv, discoverCareers, matchOpportunities, analyzeSkillGap, createLearningRoadmap, findLearningResources,
  interviewSimulation, applicationAssistant, analyzeProgress, compareOptions, improveProfile, searchKnowledge, saveOpportunityTool, getMyPlan,
];
export const TOOL_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

export { listOpportunities };
