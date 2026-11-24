/**
 * Skill sky with collision-free labels. The shared <Constellation> draws stars and lines; labels are
 * placed here greedily (most important stars first): each label tries its natural side, then the
 * other side, then small vertical offsets, and takes the first spot that covers no other label or star.
 */
import type { CSSProperties } from "react";
import { Constellation, layoutSky, type SkyStar } from "@/components/viz";

// Geometry in viewBox units (the sky is 400 × 400; at typical sizes 1 unit ≈ 1–1.15 px).
const LINE = 22, CHAR = 6.4, PAD = 16, MAXW = 132, OFF = 9, STAR = 8;
const RANK: Record<string, number> = { verified: 4, evidenced: 3, inferred: 2, declared: 2, suggested: 1 };
type Box = { x0: number; y0: number; x1: number; y1: number };
const hit = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

export function SkyWithLabels({ stars, seed, ariaLabel, className }: { stars: SkyStar[]; seed: string; ariaLabel: string; className?: string }) {
  const { placed } = layoutSky(stars);
  const starBoxes: Box[] = placed.map((s) => ({ x0: s.x - STAR, y0: s.y - STAR, x1: s.x + STAR, y1: s.y + STAR }));
  const hub: Box = { x0: 172, y0: 172, x1: 228, y1: 228 }; // the compass needle stays readable
  const taken: Box[] = [];
  const out = new Map<string, { side: "e" | "w"; ly: number }>();
  const order = placed.map((s, i) => ({ s, i })).sort((a, b) => RANK[b.s.status] - RANK[a.s.status] || a.i - b.i);
  for (const { s, i } of order) {
    const wRaw = s.label.length * CHAR + PAD;
    const w = Math.min(wRaw, MAXW + PAD), h = wRaw > MAXW + PAD ? LINE * 1.8 : LINE;
    const pref: "e" | "w" = s.x >= 200 ? "e" : "w";
    const sides: Array<"e" | "w"> = [pref, pref === "e" ? "w" : "e"];
    const box = (side: "e" | "w", ly: number): Box => side === "e" ? { x0: s.x + OFF, x1: s.x + OFF + w, y0: ly - h / 2, y1: ly + h / 2 } : { x0: s.x - OFF - w, x1: s.x - OFF, y0: ly - h / 2, y1: ly + h / 2 };
    let best: { side: "e" | "w"; ly: number; cost: number } | null = null;
    for (const dy of [0, -0.6, 0.6, -1.1, 1.1, -1.6, 1.6]) {
      for (const side of sides) {
        const ly = s.y + dy * LINE;
        const b = box(side, ly);
        const outside = Math.max(0, -40 - b.x0) + Math.max(0, b.x1 - 440) + Math.max(0, 4 - b.y0) + Math.max(0, b.y1 - 396);
        const cost = taken.filter((t) => hit(t, b)).length * 10 + starBoxes.filter((sb, j) => j !== i && hit(sb, b)).length * 6 + (hit(hub, b) ? 8 : 0) + outside + Math.abs(dy) * .5 + (side === pref ? 0 : .3);
        if (!best || cost < best.cost) best = { side, ly, cost };
        if (cost < 1) break;
      }
      if (best && best.cost < 1) break;
    }
    out.set(s.id, { side: best!.side, ly: best!.ly });
    taken.push(box(best!.side, best!.ly));
  }
  const key = stars.map((s) => `${s.id}:${s.status}`).join("|");
  return (
    <div className={`sky-wrap ${className ?? ""}`}>
      <Constellation stars={stars} labels={false} seed={seed} ariaLabel={ariaLabel} />
      <div className="sky-labels" aria-hidden="true" key={key}>
        {placed.map((s, i) => {
          const o = out.get(s.id)!;
          return <span key={s.id} className={`sky-label ${o.side} st-${s.status}`} style={{ left: `${s.x / 4}%`, top: `${o.ly / 4}%`, "--i": i } as CSSProperties}>{s.label}</span>;
        })}
      </div>
    </div>
  );
}
