import { describe, expect, it } from "vitest";
import { makeUser } from "../support/factory";
import { checkCredentials, exportAccount, deleteAccount, changePassword } from "@/server/repo/account";
import { createExperience } from "@/server/repo/experiences";
import { analyzeText } from "@/server/ai/analysis";
import { addSuggestions, pendingSuggestions, acceptSuggestion, rejectSuggestion, getPassport } from "@/server/repo/skills";
import { rankedForUser, getOpportunity } from "@/server/repo/opportunities";
import { setTarget, getProfile, updateProfile } from "@/server/repo/profile";
import { draftPlanFor, savePlan, getActivePlan, completeTask, progressStats } from "@/server/repo/plans";
import { asSystem } from "@/server/db";
import { createSession, validateSession, deleteAllSessions } from "@/server/auth/session";

describe("core student journey (repositories against real Postgres)", () => {
  it("signs up, analyses Darija text, confirms skills, matches, plans, proves, exports, deletes", async () => {
    const u = await makeUser({ locale: "ary", name: "Salma" });
    expect(await checkCredentials(u.email, "password-1234")).toBe(u.id);
    expect(await checkCredentials(u.email, "wrong-password")).toBeNull();
    expect(await checkCredentials("nobody@test.local", "password-1234")).toBeNull();

    await updateProfile(u.id, { situation: "student", field_of_study: "Économie", languages: ["ar", "fr"], onboarded: true });
    expect((await getProfile(u.id)).onboarded_at).not.toBeNull();

    const exp = await createExperience(u.id, { kind: "family", title: "الحانوت", organization: null, description: "كنعاون الواليد فالحانوت: كنسيّر الكاسة، كنهضر مع الكليان وكنتبع السلعة فExcel.", started_on: null, ended_on: null });
    const analysis = await analyzeText(exp.description, { userId: u.id, allowLlm: false });
    expect(analysis.engine).toBe("rules");
    const created = await addSuggestions(u.id, analysis.candidates.map((c) => ({ ...c, experienceId: exp.id })));
    expect(created).toBeGreaterThanOrEqual(3);
    expect(await addSuggestions(u.id, analysis.candidates.map((c) => ({ ...c, experienceId: exp.id })))).toBe(0); // idempotent

    const pending = await pendingSuggestions(u.id);
    await acceptSuggestion(u.id, pending[0].id);
    await rejectSuggestion(u.id, pending[1].id);
    for (const s of pending.slice(2)) await acceptSuggestion(u.id, s.id);
    const passport = await getPassport(u.id);
    expect(passport.length).toBe(pending.length - 1);
    expect(passport.every((s) => s.status === "inferred")).toBe(true); // never "verified" from analysis
    expect(passport[0].evidence[0].kind).toBe("quote");

    const ranked = await rankedForUser(u.id);
    expect(ranked.length).toBeGreaterThan(5);
    const best = ranked[0];
    expect(best.fit.requiredHave).toBeGreaterThan(0);
    await setTarget(u.id, best.item.id);

    const draft = await draftPlanFor(u.id, best.item.id, "ary", 30);
    const planId = await savePlan(u.id, { opportunityId: best.item.id, title: draft.title, days: 30, tasks: draft.tasks });
    const plan = (await getActivePlan(u.id))!;
    expect(plan.id).toBe(planId);
    expect(plan.tasks.length).toBe(draft.tasks.length);

    const prove = plan.tasks.find((t) => t.kind === "prove" && t.skill_id)!;
    const r = await completeTask(u.id, prove.id, { url: "https://example.com/my-dashboard", note: "Tableau de 120 produits" });
    expect(r.evidenced).toBe(true);
    const after = await getPassport(u.id);
    expect(after.find((s) => s.skill_id === prove.skill_id)?.status).toBe("evidenced");
    const stats = await progressStats(u.id);
    expect(stats.plan?.done).toBe(1);
    expect(stats.streakDays).toBe(1);

    // saving a new plan archives the old one (one active plan per student)
    await savePlan(u.id, { opportunityId: best.item.id, title: "v2", days: 14, tasks: draft.tasks.slice(0, 2) });
    expect((await getActivePlan(u.id))!.title).toBe("v2");

    const exported = await exportAccount(u.id);
    expect(exported.user).toMatchObject({ id: u.id });
    expect(exported.skills.length).toBe(after.length);
    expect(exported.plan_tasks.length).toBeGreaterThan(0);
    expect(JSON.stringify(exported)).not.toContain("password");

    await expect(deleteAccount(u.id, "wrong")).rejects.toMatchObject({ code: "validation" });
    await deleteAccount(u.id, "password-1234");
    const left = await asSystem((tx) => tx.one<{ n: number }>(
      `SELECT (SELECT count(*) FROM users WHERE id = $1) + (SELECT count(*) FROM user_skills WHERE user_id = $1) + (SELECT count(*) FROM plans WHERE user_id = $1)
            + (SELECT count(*) FROM experiences WHERE user_id = $1) + (SELECT count(*) FROM skill_suggestions WHERE user_id = $1) AS n`, [u.id]));
    expect(Number(left!.n)).toBe(0);
  });

  it("sessions expire, renew and can be revoked; password change works", async () => {
    const u = await makeUser();
    const { token } = await createSession(u.id, { userAgent: "test" });
    expect((await validateSession(token))?.user.id).toBe(u.id);
    expect(await validateSession("x".repeat(30))).toBeNull();
    await asSystem((tx) => tx.query(`UPDATE sessions SET expires_at = now() + interval '1 day' WHERE user_id = $1`, [u.id]));
    expect((await validateSession(token))?.renewedUntil).toBeInstanceOf(Date);
    await asSystem((tx) => tx.query(`UPDATE sessions SET expires_at = now() - interval '1 second' WHERE user_id = $1`, [u.id]));
    expect(await validateSession(token)).toBeNull();
    const s2 = await createSession(u.id, {});
    await deleteAllSessions(u.id);
    expect(await validateSession(s2.token)).toBeNull();
    await expect(changePassword(u.id, "bad", "new-password-123")).rejects.toMatchObject({ code: "validation" });
    await changePassword(u.id, "password-1234", "new-password-123");
    expect(await checkCredentials(u.email, "new-password-123")).toBe(u.id);
  });

  it("demo opportunities are flagged and real ones require a source", async () => {
    const ranked = await rankedForUser((await makeUser()).id);
    const demo = await getOpportunity(ranked[0].item.id);
    expect(demo.is_sample).toBe(true);
    expect(demo.verification_status).toBe("demo");
    await expect(asSystem((tx) => tx.query(`INSERT INTO opportunities (title, organization, kind, source_name, is_sample, verification_status) VALUES ('{"en":"x"}','Org','job','src', false, 'unverified')`)))
      .rejects.toThrow(/check constraint/);
  });
});
