import { describe, expect, it } from "vitest";
import { asUser, asPublic } from "@/server/db";
import { makeUser } from "../support/factory";
import { createExperience, getExperience, deleteExperience } from "@/server/repo/experiences";
import { createConversation, addMessage, getConversation, listConversations, takePendingAction, createPendingAction } from "@/server/repo/conversations";
import { declareSkill } from "@/server/repo/skills";

describe("row-level security and object-level authorization", () => {
  it("a student cannot read or change another student's rows, even with a raw query", async () => {
    const a = await makeUser();
    const b = await makeUser();
    const exp = await createExperience(a.id, { kind: "job", title: "Shop", organization: null, description: "I sold clothes to customers.", started_on: null, ended_on: null });
    const conv = await createConversation(a.id, "private");
    await addMessage(a.id, conv.id, { role: "user", content: "secret" });
    await declareSkill(a.id, "sales");

    // B, through the normal repository API
    await expect(getExperience(b.id, exp.id)).rejects.toMatchObject({ code: "not_found" });
    await expect(getConversation(b.id, conv.id)).rejects.toMatchObject({ code: "not_found" });
    await expect(deleteExperience(b.id, exp.id)).rejects.toMatchObject({ code: "not_found" });
    expect(await listConversations(b.id)).toEqual([]);
    // B, with raw SQL inside its own session: RLS returns nothing / changes nothing
    const rows = await asUser(b.id, (tx) => tx.query(`SELECT * FROM experiences UNION ALL SELECT * FROM experiences WHERE user_id = $1`, [a.id]));
    expect(rows).toEqual([]);
    const upd = await asUser(b.id, (tx) => tx.query(`UPDATE messages SET content = 'hacked' RETURNING id`));
    expect(upd).toEqual([]);
    const skills = await asUser(b.id, (tx) => tx.query(`SELECT * FROM user_skills`));
    expect(skills).toEqual([]);
    // B cannot insert rows owned by A
    await expect(asUser(b.id, (tx) => tx.query(`INSERT INTO experiences (user_id, kind, title, description) VALUES ($1,'job','x','xxxxxxxxxxxx')`, [a.id]))).rejects.toThrow(/row-level security/);
    // A still sees its data
    expect((await getConversation(a.id, conv.id)).messages[0].content).toBe("secret");
  });

  it("anonymous/public sessions see reference data but no personal data", async () => {
    const a = await makeUser();
    await createExperience(a.id, { kind: "job", title: "x", organization: null, description: "private description", started_on: null, ended_on: null });
    const r = await asPublic(async (tx) => ({
      skills: (await tx.query(`SELECT id FROM skills`)).length,
      users: (await tx.query(`SELECT id FROM users`)).length,
      exps: (await tx.query(`SELECT id FROM experiences`)).length,
      sessions: (await tx.query(`SELECT id FROM sessions`)).length,
    }));
    expect(r.skills).toBeGreaterThan(20);
    expect(r).toMatchObject({ users: 0, exps: 0, sessions: 0 });
  });

  it("a pending action can only be confirmed by its owner, once", async () => {
    const a = await makeUser();
    const b = await makeUser();
    const act = await createPendingAction(a.id, null, "create_plan", { x: 1 });
    await expect(takePendingAction(b.id, act.id, "confirmed")).rejects.toMatchObject({ code: "not_found" });
    expect((await takePendingAction(a.id, act.id, "confirmed")).status).toBe("confirmed");
    await expect(takePendingAction(a.id, act.id, "confirmed")).rejects.toMatchObject({ code: "not_found" });
  });

  it("rejects malformed user ids before touching the database", async () => {
    await expect(asUser("1 OR 1=1", async () => 1)).rejects.toThrow(/invalid user id/);
  });
});
