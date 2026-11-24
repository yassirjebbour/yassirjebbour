import { route, json, apiUser } from "@/server/http/api";
import { zUuid } from "@/server/http/schemas";
import { getExperience } from "@/server/repo/experiences";
import { addSuggestions, ownedSkills } from "@/server/repo/skills";
import { analyzeText } from "@/server/ai/analysis";
import { rateLimit } from "@/server/ratelimit";
import { isEnabled } from "@/server/flags";
import { asUser } from "@/server/db";
import { notify } from "@/server/notify";
import { track } from "@/server/events";
import { spentTodayUsd } from "@/server/ai/usage";
import { env } from "@/server/env";

type Ctx = { params: Promise<{ id: string }> };

/** Runs skill extraction on one experience and stores the results as suggestions (consent required). */
export const POST = route<Ctx>(async (_req, { params }) => {
  const user = await apiUser();
  await rateLimit(`analyze:${user.id}`, 30, 3600);
  const exp = await getExperience(user.id, zUuid.parse((await params).id));
  const allowLlm = (await isEnabled("ai.llm", user)) && (await isEnabled("ai.analysis", user)) && (await spentTodayUsd()) < env().AI_DAILY_BUDGET_USD;
  const result = await analyzeText(`${exp.title}. ${exp.description}`, { userId: user.id, allowLlm });
  const owned = new Set((await ownedSkills(user.id)).map((s) => s.skillId));
  const created = await addSuggestions(user.id, result.candidates.filter((c) => !owned.has(c.skillId)).map((c) => ({ ...c, experienceId: exp.id })));
  await asUser(user.id, (tx) => tx.query(`UPDATE experiences SET analyzed_at = now() WHERE id = $1`, [exp.id]));
  if (created) await notify(user.id, "skill_suggestions", { n: created }, `sugg:${exp.id}:${Date.now() >> 16}`);
  track(user.id, "analysis.run", { engine: result.engine, found: result.candidates.length, created, discarded: result.discardedHallucinations });
  return json({ engine: result.engine, created, candidates: result.candidates, discarded: result.discardedHallucinations });
});
