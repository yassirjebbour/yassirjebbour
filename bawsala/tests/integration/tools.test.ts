import { describe, expect, it } from "vitest";
import { makeUser } from "../support/factory";
import { TOOLS, TOOL_BY_NAME } from "@/server/ai/tools";
import { jsonSchemaFor, runTool, type ToolContext } from "@/server/ai/tools/registry";
import { pendingSuggestions, getPassport, declareSkill } from "@/server/repo/skills";
import { getActivePlan } from "@/server/repo/plans";
import { rankedForUser, savedOpportunities } from "@/server/repo/opportunities";
import { createExperience } from "@/server/repo/experiences";
import { asUser } from "@/server/db";

async function ctxFor(locale: "en" | "ary" | "fr" = "en"): Promise<ToolContext> {
  const user = await makeUser({ locale });
  return { user, locale, conversationId: null, allowLlm: false };
}

describe("tool registry", () => {
  it("exposes valid JSON schemas for every tool", () => {
    expect(TOOLS.length).toBeGreaterThanOrEqual(15);
    for (const t of TOOLS) {
      const s = jsonSchemaFor(t);
      expect(s.type, t.name).toBe("object");
      expect(t.description.length, t.name).toBeGreaterThan(40);
      expect(["read", "suggest", "reversible", "confirm"]).toContain(t.permission);
    }
  });

  it("rejects invalid input without executing", async () => {
    const ctx = await ctxFor();
    const r = await runTool(TOOL_BY_NAME.get("analyze_skill_gap")!, { opportunity_id: "not-a-uuid" }, ctx);
    expect(r.ok).toBe(false);
    expect(r.error?.code).toBe("invalid_input");
    const r2 = await runTool(TOOL_BY_NAME.get("interview_simulation")!, { mode: "evaluate" }, ctx);
    expect(r2.ok).toBe(false);
  });
});

describe("tools execute real backend operations for the signed-in student only", () => {
  it("analyze_skills stores suggestions (consent pending), never passport entries", async () => {
    const ctx = await ctxFor("ary");
    const r = await runTool(TOOL_BY_NAME.get("analyze_skills")!, { text: "kanbi3 lhwayej f insta w kandir sponso, w kanhder m3a lklyan kol nhar" }, ctx);
    expect(r.ok).toBe(true);
    const out = r.output as { new_suggestions: number; found: Array<{ skill_id: string }> };
    expect(out.new_suggestions).toBeGreaterThanOrEqual(2);
    expect((await pendingSuggestions(ctx.user.id)).length).toBe(out.new_suggestions);
    expect(await getPassport(ctx.user.id)).toEqual([]);
  });

  it("matching, gap, careers, comparison and resources return consistent facts", async () => {
    const ctx = await ctxFor();
    await declareSkill(ctx.user.id, "sales");
    await declareSkill(ctx.user.id, "customer_service");
    const m = (await runTool(TOOL_BY_NAME.get("match_opportunities")!, { limit: 3 }, ctx)).output as { results: Array<{ id: string; data_status: string; fit: { required_have: number } }> };
    expect(m.results).toHaveLength(3);
    expect(m.results.every((x) => x.data_status === "demo")).toBe(true); // seeded demo data is labelled
    const gap = (await runTool(TOOL_BY_NAME.get("analyze_skill_gap")!, { opportunity_id: m.results[0].id }, ctx)).output as { fit: { required_have: number }; gaps: unknown[] };
    expect(gap.fit.required_have).toBe(m.results[0].fit.required_have);
    const cmp = await runTool(TOOL_BY_NAME.get("compare_options")!, {}, ctx);
    expect(cmp.ok).toBe(true);
    expect((cmp.output as { options: unknown[] }).options).toHaveLength(3);
    const dc = await runTool(TOOL_BY_NAME.get("discover_careers")!, { limit: 2 }, ctx);
    expect((dc.output as { directions: unknown[] }).directions).toHaveLength(2);
    const res = await runTool(TOOL_BY_NAME.get("find_learning_resources")!, { skill_ids: ["crm", "sql"] }, ctx);
    expect((res.output as { resources: Array<{ url: string | null }> }).resources.every((x) => x.url?.startsWith("https://"))).toBe(true);
  });

  it("create_learning_roadmap only proposes: nothing is saved until confirmation", async () => {
    const ctx = await ctxFor("fr");
    const r = await runTool(TOOL_BY_NAME.get("create_learning_roadmap")!, { days: 21 }, ctx);
    expect(r.ok).toBe(true);
    const out = r.output as { pending_action_id: string; requires_confirmation: boolean; tasks: unknown[] };
    expect(out.requires_confirmation).toBe(true);
    expect(out.tasks.length).toBeGreaterThan(2);
    expect(await getActivePlan(ctx.user.id)).toBeNull();
    const pa = await asUser(ctx.user.id, (tx) => tx.query(`SELECT status FROM pending_actions WHERE id = $1`, [out.pending_action_id]));
    expect(pa[0]).toMatchObject({ status: "pending" });
  });

  it("CV analysis, interview practice, progress and profile tools", async () => {
    const ctx = await ctxFor();
    const cv = await runTool(TOOL_BY_NAME.get("analyze_cv")!, { cv_text: "Experience: I managed the till of a shop and sold to 50 customers a day. Education: Licence. Skills: Excel. Languages: Arabic, French. CIN AB123456" }, ctx);
    expect(cv.ok).toBe(true);
    expect((cv.output as { report: { sensitive: string[] } }).report.sensitive).toContain("national_id");
    const q = await runTool(TOOL_BY_NAME.get("interview_simulation")!, { mode: "questions", count: 4 }, ctx);
    expect((q.output as { questions: unknown[] }).questions).toHaveLength(4);
    const ev = await runTool(TOOL_BY_NAME.get("interview_simulation")!, { mode: "evaluate", answer: "Last summer I organized a sale and as a result we sold 30% more." }, ctx);
    expect((ev.output as { evaluation: { score: number } }).evaluation.score).toBeGreaterThan(50);
    const pr = await runTool(TOOL_BY_NAME.get("analyze_progress")!, {}, ctx);
    expect(pr.output).toMatchObject({ plan: null, streak_days: 0 });
    const ip = await runTool(TOOL_BY_NAME.get("improve_profile")!, {}, ctx);
    expect((ip.output as { actions: Array<{ code: string }> }).actions.map((a) => a.code)).toContain("add_experience");
  });

  it("application assistant is read-only and uses only the student's own evidence", async () => {
    const ctx = await ctxFor();
    const exp = await createExperience(ctx.user.id, { kind: "job", title: "Shop", organization: null, description: "I sold clothes to customers.", started_on: null, ended_on: null });
    void exp;
    await declareSkill(ctx.user.id, "sales");
    const opp = (await rankedForUser(ctx.user.id))[0].item;
    const r = await runTool(TOOL_BY_NAME.get("application_assistant")!, { opportunity_id: opp.id }, ctx);
    expect(r.ok).toBe(true);
    expect((r.output as { checklist: string[] }).checklist).toContain("demo_data_do_not_apply");
    expect(await savedOpportunities(ctx.user.id)).toEqual([]); // no side effect
  });

  it("knowledge search returns attributed passages (RAG)", async () => {
    const ctx = await ctxFor();
    const r = await runTool(TOOL_BY_NAME.get("search_knowledge")!, { query: "How do I register with ANAPEC?" }, ctx);
    expect(r.ok).toBe(true);
    const out = r.output as { mode: string; passages: Array<{ title: string; status: string; source: string }> };
    expect(out.mode).toBe("hybrid");
    const anapec = out.passages.slice(0, 3).find((p) => /ANAPEC/.test(p.title));
    expect(anapec, "ANAPEC document within the top 3 passages").toBeTruthy();
    expect(anapec!.status).toBe("unverified");
  });
});
