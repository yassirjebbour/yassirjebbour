import { describe, expect, it } from "vitest";
import { layoutSky, type SkyStar } from "@/components/viz";
import { SKILL_CATEGORY } from "@/lib/skill-names";

const ALL = Object.keys(SKILL_CATEGORY);
const star = (id: string, status: SkyStar["status"] = "inferred"): SkyStar => ({ id, label: id, category: SKILL_CATEGORY[id], status });

describe("constellation layout", () => {
  it("is deterministic (server and client render the same markup)", () => {
    const s = ALL.slice(0, 8).map((id) => star(id));
    expect(layoutSky(s)).toEqual(layoutSky(s));
  });

  it("keeps labels on the same side at least one row apart (tighter only when a side is crowded) and inside the sky, for any skill set", () => {
    for (let n = 1; n <= ALL.length; n++) {
      for (let offset = 0; offset < ALL.length; offset += 5) {
        const ids = Array.from({ length: n }, (_, i) => ALL[(i + offset) % ALL.length]);
        const { placed, labelY } = layoutSky([...new Set(ids)].map((id) => star(id)));
        for (const east of [true, false]) {
          const ys = placed.filter((p) => (p.x >= 200) === east).map((p) => labelY[p.id]).sort((a, b) => a - b);
          const gap = ys.length > 1 ? Math.min(36, 368 / (ys.length - 1)) : 36;
          for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1], `n=${n} offset=${offset}`).toBeGreaterThanOrEqual(gap - 0.1);
          for (const y of ys) { expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(400); }
        }
      }
    }
  });
});
