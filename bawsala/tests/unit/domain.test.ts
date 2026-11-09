import { describe, expect, it } from "vitest";
import { computeFit, rankByFit, readiness } from "@/server/domain/matching";
import { buildPlan } from "@/server/domain/roadmap";
import { analyzeCvText } from "@/server/domain/cv";
import { scoreAnswer, buildQuestions } from "@/server/domain/interview";
import { quoteIsGrounded } from "@/server/ai/analysis";
import { streak } from "@/server/repo/plans";
import { bucket } from "@/server/flags";
import { sanitizeProps } from "@/server/events";

describe("matching", () => {
  const reqs = [{ skillId: "sales", required: true }, { skillId: "crm", required: true }, { skillId: "excel", required: false }];
  it("scores required skills, credits evidence above claims", () => {
    const claimed = computeFit(reqs, [{ skillId: "sales", status: "declared" }]);
    const proven = computeFit(reqs, [{ skillId: "sales", status: "evidenced" }]);
    expect(claimed.requiredHave).toBe(1);
    expect(claimed.missingRequired).toEqual(["crm"]);
    expect(proven.score).toBeGreaterThan(claimed.score);
    expect(computeFit(reqs, [{ skillId: "sales", status: "verified" }, { skillId: "crm", status: "verified" }, { skillId: "excel", status: "verified" }]).score).toBe(100);
    expect(computeFit(reqs, []).score).toBe(0);
  });
  it("ranks deterministically", () => {
    const items = [{ id: "b", r: reqs }, { id: "a", r: [{ skillId: "excel", required: true }] }];
    const ranked = rankByFit(items, (i) => i.r, [{ skillId: "excel", status: "inferred" }], (i) => i.id);
    expect(ranked[0].item.id).toBe("a");
  });
  it("readiness counts evidenced required skills", () => {
    expect(readiness(reqs, [{ skillId: "sales", status: "evidenced" }, { skillId: "crm", status: "declared" }])).toEqual({ required: 2, claimed: 2, evidenced: 1 });
  });
});

describe("roadmap", () => {
  it("builds learn→practise→prove per gap, then project and apply, within the period", () => {
    const tasks = buildPlan({ locale: "fr", missingSkillIds: ["crm", "sql"], roleTitle: "Analyste", project: { fr: "Projet" }, days: 30 });
    expect(tasks.map((t) => t.kind)).toEqual(["learn", "practice", "prove", "learn", "practice", "prove", "project", "apply"]);
    expect(tasks[0].day).toBe(1);
    expect(tasks[tasks.length - 1].day).toBe(30);
    expect(tasks.every((t, i) => i === 0 || t.day >= tasks[i - 1].day)).toBe(true);
    expect(tasks[0].title).toContain("CRM");
  });
  it("caps focus at 4 skills and ignores unknown ids", () => {
    const tasks = buildPlan({ locale: "en", missingSkillIds: ["sales", "crm", "sql", "excel", "ads", "nope"] });
    expect(tasks.filter((t) => t.kind === "learn")).toHaveLength(4);
  });
});

describe("CV and interview rubrics", () => {
  it("flags missing contact info, few numbers and sensitive data", () => {
    const r = analyzeCvText("Expérience: vendeur. Formation: licence. CIN AB123456. Célibataire.");
    expect(r.issues).toContain("missing_email");
    expect(r.issues).toContain("sensitive_data");
    expect(r.sensitive).toEqual(expect.arrayContaining(["national_id", "marital_status"]));
  });
  it("recognises a good CV", () => {
    const cv = `Salma Idrissi — salma@example.com — +212 6 12 34 56 78 — linkedin.com/in/salma
Expérience: J'ai géré la caisse (200 clients/jour), organisé 3 événements, augmenté les ventes de 15 %, négocié avec 4 fournisseurs. ${"Détail ".repeat(60)}
Formation: Licence en économie, 2025. Compétences: Excel, CRM. Langues: arabe, français, anglais.`;
    const r = analyzeCvText(cv);
    expect(r.issues).not.toContain("missing_email");
    expect(r.issues).not.toContain("missing_phone");
    expect(r.issues).not.toContain("few_numbers");
  });
  it("scores STAR answers transparently", () => {
    const weak = scoreAnswer("I am good at sales.");
    const strong = scoreAnswer("Last summer, while working at my family's shop, sales were falling. I organized a weekend promotion on Instagram and I trained my brother to handle the till. As a result, sales increased by 20% in one month and we gained 40 new clients. ".repeat(1));
    expect(strong.score).toBeGreaterThan(weak.score);
    expect(weak.tips).toEqual(expect.arrayContaining(["add_result", "add_number"]));
    expect(strong.checks.result).toBe(true);
  });
  it("builds role questions including one gap question", () => {
    const qs = buildQuestions({ locale: "ary", haveSkills: ["sales"], missingSkills: ["crm"], count: 5 });
    expect(qs.some((q) => q.kind === "gap")).toBe(true);
    expect(qs[0].text).toMatch(/[؀-ۿ]/);
  });
});

describe("guards", () => {
  it("accepts only quotes that occur in the student's text", () => {
    const text = "Je gère la caisse du magasin de ma mère.";
    expect(quoteIsGrounded("je gère la caisse", text)).toBe(true);
    expect(quoteIsGrounded("J'ai dirigé une équipe de 10 personnes", text)).toBe(false);
  });
  it("computes streaks ending today or yesterday", () => {
    const today = new Date("2026-11-02T10:00:00Z");
    expect(streak(["2026-11-02", "2026-11-01", "2026-10-31"], today)).toBe(3);
    expect(streak(["2026-11-01", "2026-10-31"], today)).toBe(2);
    expect(streak(["2026-10-29"], today)).toBe(0);
  });
  it("feature-flag buckets are stable and spread", () => {
    expect(bucket("x", "u1")).toBe(bucket("x", "u1"));
    const b = new Set(Array.from({ length: 200 }, (_, i) => Math.floor(bucket("k", `u${i}`) / 10)));
    expect(b.size).toBeGreaterThanOrEqual(8);
  });
  it("analytics props drop free text keys and long values", () => {
    expect(sanitizeProps({ ok: true, "Bad Key": "x", note: "y".repeat(200), n: 3 })).toEqual({ ok: true, note: "y".repeat(80), n: 3 });
  });
});
