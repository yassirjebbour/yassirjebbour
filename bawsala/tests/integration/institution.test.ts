import { describe, expect, it } from "vitest";
import { makeInstitution, makeUser } from "../support/factory";
import { institutionStats, reviewVerification, verificationQueue, MIN_GROUP } from "@/server/repo/institution";
import { declareSkill, getPassport } from "@/server/repo/skills";
import { updateProfile } from "@/server/repo/profile";
import { asUser } from "@/server/db";

describe("institution tenancy", () => {
  it("aggregates only consenting students, hides small groups, and keeps tenants apart", async () => {
    const i1 = await makeInstitution("Uni A");
    const i2 = await makeInstitution("Uni B");
    const students = [];
    for (let k = 0; k < MIN_GROUP; k++) {
      const s = await makeUser({ institutionId: i1.id });
      await declareSkill(s.id, "sales");
      students.push(s);
    }
    expect((await institutionStats(i1.id)).stats).toBeNull(); // nobody shared yet
    for (const s of students.slice(0, MIN_GROUP - 1)) await updateProfile(s.id, { share_with_institution: true });
    expect((await institutionStats(i1.id)).stats).toBeNull(); // below k
    await updateProfile(students[MIN_GROUP - 1].id, { share_with_institution: true });
    const st = await institutionStats(i1.id);
    expect(st.sharing).toBe(MIN_GROUP);
    expect(st.stats?.skills[0]).toMatchObject({ skill_id: "sales", students: MIN_GROUP });
    expect((await institutionStats(i2.id)).sharing).toBe(0);
  });

  it("verification: only the student's own institution can verify, and only a human admin", async () => {
    const i1 = await makeInstitution("Uni C");
    const i2 = await makeInstitution("Uni D");
    const s = await makeUser({ institutionId: i1.id });
    const admin1 = await makeUser({ role: "institution_admin", institutionId: i1.id });
    const admin2 = await makeUser({ role: "institution_admin", institutionId: i2.id });
    await declareSkill(s.id, "event");
    await updateProfile(s.id, { share_with_institution: true });
    const us = (await getPassport(s.id))[0];
    const vr = await asUser(s.id, (tx) => tx.one<{ id: string }>(`INSERT INTO verification_requests (user_id, user_skill_id, institution_id) VALUES ($1,$2,$3) RETURNING id`, [s.id, us.id, i1.id]));
    expect(await verificationQueue(i2.id)).toEqual([]);
    await expect(reviewVerification({ id: admin2.id, institutionId: i2.id }, vr!.id, "approved", null)).rejects.toMatchObject({ code: "not_found" });
    await reviewVerification({ id: admin1.id, institutionId: i1.id }, vr!.id, "approved", null);
    expect((await getPassport(s.id))[0].status).toBe("verified");
  });
});

import { asSystem } from "@/server/db";
import { createSession, validateSession } from "@/server/auth/session";

describe("security regressions (integration)", () => {
  it("F-07: a verification cannot be approved after the student stops sharing / leaves", async () => {
    const inst = await makeInstitution("Uni E");
    const s = await makeUser({ institutionId: inst.id });
    const admin = await makeUser({ role: "institution_admin", institutionId: inst.id });
    await declareSkill(s.id, "sales");
    await updateProfile(s.id, { share_with_institution: true });
    const us = (await getPassport(s.id))[0];
    const vr = await asUser(s.id, (tx) => tx.one<{ id: string }>(`INSERT INTO verification_requests (user_id, user_skill_id, institution_id) VALUES ($1,$2,$3) RETURNING id`, [s.id, us.id, inst.id]));
    await updateProfile(s.id, { share_with_institution: false });
    await expect(reviewVerification({ id: admin.id, institutionId: inst.id }, vr!.id, "approved", null)).rejects.toMatchObject({ code: "not_found" });
    expect((await getPassport(s.id))[0].status).not.toBe("verified");
  });

  it("F-13: sessions have an absolute 90-day lifetime even when active", async () => {
    const u = await makeUser();
    const { token } = await createSession(u.id, {});
    await asSystem((tx) => tx.query(`UPDATE sessions SET created_at = now() - interval '91 days' WHERE user_id = $1`, [u.id]));
    expect(await validateSession(token)).toBeNull();
  });
});
