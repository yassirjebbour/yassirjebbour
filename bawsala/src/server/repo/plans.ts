import "server-only";
import { asUser } from "../db";
import { ApiError } from "../http/errors";
import { buildPlan, type DraftTask } from "../domain/roadmap";
import { computeFit } from "../domain/matching";
import { getOpportunity } from "./opportunities";
import { ownedSkills, addEvidence } from "./skills";
import { pick, type Locale } from "@/i18n/config";

export interface PlanTask {
  id: string; position: number; kind: DraftTask["kind"]; title: string; detail: string | null; skill_id: string | null;
  resource_url: string | null; estimated_minutes: number | null; due_on: string; completed_at: Date | null;
  proof_url: string | null; proof_note: string | null;
}
export interface Plan { id: string; opportunity_id: string | null; title: string; status: string; starts_on: string; ends_on: string; created_at: Date; tasks: PlanTask[] }

export async function getActivePlan(userId: string): Promise<Plan | null> {
  return asUser(userId, async (tx) => {
    const plan = await tx.one<Omit<Plan, "tasks">>(
      `SELECT id, opportunity_id, title, status, to_char(starts_on,'YYYY-MM-DD') starts_on, to_char(ends_on,'YYYY-MM-DD') ends_on, created_at
         FROM plans WHERE user_id = $1 AND status = 'active'`,
      [userId],
    );
    if (!plan) return null;
    const tasks = await tx.query<PlanTask>(
      `SELECT id, position, kind, title, detail, skill_id, resource_url, estimated_minutes, to_char(due_on,'YYYY-MM-DD') due_on, completed_at, proof_url, proof_note
         FROM plan_tasks WHERE plan_id = $1 ORDER BY position`,
      [plan.id],
    );
    return { ...plan, tasks };
  });
}

/** Draft (not saved) plan towards an opportunity, based on the student's current gaps. */
export async function draftPlanFor(userId: string, opportunityId: string, locale: Locale, days = 30) {
  const opp = await getOpportunity(opportunityId);
  const fit = computeFit(opp.requirements, await ownedSkills(userId));
  const roleTitle = pick(opp.title, locale);
  const tasks = buildPlan({ locale, missingSkillIds: [...fit.missingRequired, ...fit.missingNice], roleTitle, project: opp.project_brief, days });
  return { opportunity: opp, fit, title: roleTitle, days, tasks };
}

/** Saves a plan (replacing any active plan, which is archived — never deleted). */
export async function savePlan(userId: string, input: { opportunityId: string | null; title: string; days: number; tasks: Array<Omit<DraftTask, "position">> }) {
  if (!input.tasks.length) throw new ApiError("validation", "plan_empty");
  return asUser(userId, async (tx) => {
    await tx.query(`UPDATE plans SET status = 'archived' WHERE user_id = $1 AND status = 'active'`, [userId]);
    const plan = await tx.one<{ id: string }>(
      `INSERT INTO plans (user_id, opportunity_id, title, ends_on) VALUES ($1,$2,$3, current_date + $4::int - 1) RETURNING id`,
      [userId, input.opportunityId, input.title.slice(0, 200), input.days],
    );
    let pos = 0;
    for (const t of input.tasks.slice(0, 40)) {
      pos++;
      await tx.query(
        `INSERT INTO plan_tasks (plan_id, user_id, position, kind, title, detail, skill_id, resource_url, estimated_minutes, due_on)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, current_date + $10::int - 1)`,
        [plan!.id, userId, pos, t.kind, t.title.slice(0, 300), t.detail?.slice(0, 2000) ?? null, t.skillId ?? null, t.resourceUrl ?? null, t.estimatedMinutes ?? null, Math.max(1, Math.min(input.days, t.day))],
      );
    }
    if (input.opportunityId) await tx.query(`UPDATE profiles SET target_opportunity_id = $2 WHERE user_id = $1`, [userId, input.opportunityId]);
    return plan!.id;
  });
}

/** Complete a task. A "prove" task with a link or note becomes evidence in the passport. */
export async function completeTask(userId: string, taskId: string, proof?: { url?: string | null; note?: string | null }) {
  const task = await asUser(userId, (tx) =>
    tx.one<{ id: string; kind: string; skill_id: string | null; title: string }>(
      `UPDATE plan_tasks SET completed_at = coalesce(completed_at, now()), proof_url = coalesce($2, proof_url), proof_note = coalesce($3, proof_note)
        WHERE id = $1 RETURNING id, kind, skill_id, title`,
      [taskId, proof?.url ?? null, proof?.note ?? null],
    ),
  );
  if (!task) throw new ApiError("not_found");
  let evidenced = false;
  if (task.skill_id && (task.kind === "prove" || task.kind === "project") && (proof?.url || proof?.note)) {
    await addEvidence(userId, task.skill_id, { kind: "task", url: proof.url ?? null, text: proof.note ?? task.title, planTaskId: task.id });
    evidenced = true;
  }
  await maybeCompletePlan(userId);
  return { evidenced };
}

export async function reopenTask(userId: string, taskId: string) {
  const rows = await asUser(userId, (tx) => tx.query(`UPDATE plan_tasks SET completed_at = NULL WHERE id = $1 RETURNING id`, [taskId]));
  if (!rows.length) throw new ApiError("not_found");
  await asUser(userId, (tx) => tx.query(`UPDATE plans SET status = 'active' WHERE user_id = $1 AND status = 'completed' AND id = (SELECT plan_id FROM plan_tasks WHERE id = $2)`, [userId, taskId]));
}

async function maybeCompletePlan(userId: string) {
  await asUser(userId, (tx) =>
    tx.query(
      `UPDATE plans p SET status = 'completed' WHERE p.user_id = $1 AND p.status = 'active'
         AND NOT EXISTS (SELECT 1 FROM plan_tasks t WHERE t.plan_id = p.id AND t.completed_at IS NULL)`,
      [userId],
    ),
  );
}

export async function archivePlan(userId: string) {
  await asUser(userId, (tx) => tx.query(`UPDATE plans SET status = 'archived' WHERE user_id = $1 AND status = 'active'`, [userId]));
}

/** Progress numbers. Every figure says what it counts. */
export async function progressStats(userId: string) {
  return asUser(userId, async (tx) => {
    const plan = await tx.one<{ id: string; starts_on: string; ends_on: string; title: string }>(
      `SELECT id, to_char(starts_on,'YYYY-MM-DD') starts_on, to_char(ends_on,'YYYY-MM-DD') ends_on, title FROM plans WHERE user_id = $1 AND status = 'active'`, [userId]);
    const t = plan
      ? await tx.one<{ total: number; done: number; overdue: number; due_today: number }>(
          `SELECT count(*)::int total, count(completed_at)::int done,
                  count(*) FILTER (WHERE completed_at IS NULL AND due_on < current_date)::int overdue,
                  count(*) FILTER (WHERE completed_at IS NULL AND due_on = current_date)::int due_today
             FROM plan_tasks WHERE plan_id = $1`, [plan.id])
      : null;
    const days = await tx.query<{ d: string }>(
      `SELECT DISTINCT to_char(completed_at::date,'YYYY-MM-DD') d FROM plan_tasks WHERE user_id = $1 AND completed_at IS NOT NULL ORDER BY d DESC LIMIT 60`, [userId]);
    const skills = await tx.one<{ total: number; evidenced: number }>(
      `SELECT count(*)::int total, count(*) FILTER (WHERE status IN ('evidenced','verified'))::int evidenced FROM user_skills WHERE user_id = $1`, [userId]);
    const next = plan
      ? await tx.one<{ id: string; title: string; due_on: string; kind: string }>(
          `SELECT id, title, to_char(due_on,'YYYY-MM-DD') due_on, kind FROM plan_tasks WHERE plan_id = $1 AND completed_at IS NULL ORDER BY position LIMIT 1`, [plan.id])
      : null;
    return {
      plan: plan ? { ...plan, ...t! } : null,
      streakDays: streak(days.map((r) => r.d)),
      activeDays: days.length,
      skills: skills!,
      next,
    };
  });
}

/** Consecutive days (ending today or yesterday) with at least one completed task. */
export function streak(sortedDescDays: string[], today = new Date()): number {
  const set = new Set(sortedDescDays);
  const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const key = (x: Date) => x.toISOString().slice(0, 10);
  if (!set.has(key(d))) d.setUTCDate(d.getUTCDate() - 1);
  let n = 0;
  while (set.has(key(d))) { n++; d.setUTCDate(d.getUTCDate() - 1); }
  return n;
}
