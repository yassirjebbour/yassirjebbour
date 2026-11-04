/**
 * Visual primitives shared by the public site and the app. No hooks, so they render on the
 * server (no hydration cost) and inside client components alike. All geometry is
 * deterministic (seeded by ids), so server and client markup always match.
 */
import type { CSSProperties, ReactNode } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- Ring: circular progress ---------- */
export function Ring({ value, max = 100, size = 96, stroke = 8, label, tone, className, children, fs }: {
  value: number; max?: number; size?: number; stroke?: number; label: string; tone?: "gold"; className?: string; children?: ReactNode; fs?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const style: Vars = { width: size, height: size, "--c": `${c.toFixed(2)}px`, "--p": p, ...(fs ? { "--ring-fs": `${fs}px` } : {}) };
  return (
    <div className={`pring ${tone ?? ""} ${className ?? ""}`} style={style} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
        <circle className="track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        {p > 0 ? <circle className="val" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} /> : null}
      </svg>
      {children ? <div className="ring-label" aria-hidden="true">{children}</div> : null}
    </div>
  );
}

/* ---------- Count: number that counts up on first paint (CSS only) ---------- */
export function Count({ value }: { value: number }) {
  const n = Math.max(0, Math.round(value));
  return (
    <>
      <span className="count-vis" {...(n > 0 ? { "data-anim": "" } : {})} style={{ "--to": n } as Vars} aria-hidden="true"><span>{n}</span></span>
      <span className="sr-only">{n}</span>
    </>
  );
}

/* ---------- deterministic randomness ---------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const round = (n: number) => Math.round(n * 100) / 100;

/* ---------- StarField: twinkling background stars for night surfaces ---------- */
export function StarField({ count = 28, seed = "bawsala", className }: { count?: number; seed?: string; className?: string }) {
  const r = rng(hash(seed));
  const stars = Array.from({ length: count }, () => ({ x: round(r() * 100), y: round(r() * 100), s: round(1 + r() * 2.2), d: round(2.5 + r() * 4), dl: round(r() * 5), o: round(.35 + r() * .5) }));
  return (
    <div className={`starfield ${className ?? ""}`} aria-hidden="true">
      {stars.map((s, i) => <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, "--d": `${s.d}s`, "--dl": `${s.dl}s`, "--o": s.o } as Vars} />)}
    </div>
  );
}

/* ---------- Constellation: skills as stars around a compass ---------- */
export type SkyStatus = "suggested" | "declared" | "inferred" | "evidenced" | "verified";
export interface SkyStar { id: string; label: string; category: string; status: SkyStatus }

const SECTOR: Record<string, number> = { communication: 0, people: 60, languages: 120, operations: 180, analysis: 240, digital: 300, other: 330 };
const RANK: Record<SkyStatus, number> = { verified: 4, evidenced: 3, inferred: 2, declared: 2, suggested: 1 };
const RADII = [0.62, 0.84, 0.46, 0.92, 0.72, 0.36, 0.98];
const OFFS = [0, 1, -1, 2, -2, 3, -3];
const C = 200, R = 150;

export function layoutSky(stars: SkyStar[]) {
  const byCat = new Map<string, SkyStar[]>();
  for (const s of stars) { const k = s.category in SECTOR ? s.category : "other"; byCat.set(k, [...(byCat.get(k) ?? []), s]); }
  const placed: Array<SkyStar & { x: number; y: number; a: number; cat: string; k: number }> = [];
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number; root: boolean }> = [];
  for (const [cat, list] of byCat) {
    const sorted = [...list].sort((a, b) => RANK[b.status] - RANK[a.status] || a.id.localeCompare(b.id));
    let prev: { x: number; y: number } | null = null;
    sorted.forEach((s, k) => {
      const h = hash(s.id);
      const a = SECTOR[cat] + OFFS[k % OFFS.length] * 15 + ((h % 1000) / 1000 - .5) * 10;
      const rr = Math.min(.98, RADII[k % RADII.length] + (((h >>> 10) % 1000) / 1000 - .5) * .08) * R;
      const rad = (a * Math.PI) / 180;
      const x = round(C + rr * Math.sin(rad)), y = round(C - rr * Math.cos(rad));
      placed.push({ ...s, x, y, a, cat, k });
      edges.push(prev ? { x1: prev.x, y1: prev.y, x2: x, y2: y, root: false } : { x1: C, y1: C, x2: x, y2: y, root: true });
      prev = { x, y };
    });
  }
  // The needle points at the strongest direction: the category with the most weight.
  let best = "communication", bestW = -1;
  for (const [cat, list] of byCat) { const w = list.reduce((acc, s) => acc + RANK[s.status], 0); if (w > bestW) { bestW = w; best = cat; } }
  return { placed, edges, needle: stars.length ? SECTOR[best] : 0 };
}

export function Constellation({ stars, labels = true, className, seed = "sky", ariaLabel }: { stars: SkyStar[]; labels?: boolean; className?: string; seed?: string; ariaLabel?: string }) {
  const { placed, edges, needle } = layoutSky(stars);
  const r = rng(hash(seed));
  const dust = Array.from({ length: 42 }, () => ({ x: round(r() * 400), y: round(r() * 400), s: round(.5 + r() * 1.1), d: round(2 + r() * 4), dl: round(r() * 4) }));
  const key = stars.map((s) => `${s.id}:${s.status}`).join("|");
  return (
    <div className={`sky ${labels ? "" : "sky-mini"} ${className ?? ""}`} key={key} {...(ariaLabel ? { role: "img", "aria-label": ariaLabel } : { "aria-hidden": true })}>
      <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        <g className="sky-dust">{dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.s} style={{ "--d": `${d.d}s`, "--dl": `${d.dl}s` } as Vars} />)}</g>
        <g className="sky-rings">
          <circle cx={C} cy={C} r={R} /><circle cx={C} cy={C} r={R * .66} /><circle cx={C} cy={C} r={R * .33} />
          {[0, 90, 180, 270].map((a) => <line key={a} x1={C} y1={C - R - 8} x2={C} y2={C - R + 6} transform={`rotate(${a} ${C} ${C})`} />)}
        </g>
        <g className="sky-edges">
          {edges.map((e, i) => <line key={i} className={e.root ? "root" : ""} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} pathLength={1} style={{ "--i": i } as Vars} />)}
        </g>
        <g className="sky-stars">
          {placed.map((s, i) => (
            <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
              <g className={`star st-${s.status}`} style={{ "--i": i } as Vars}>
                {s.status === "evidenced" || s.status === "verified" ? <circle className="halo" r={s.status === "verified" ? 15 : 11} /> : null}
                {s.status === "verified" ? <path className="spark" d="M0 -13 L2 -2 L13 0 L2 2 L0 13 L-2 2 L-13 0 L-2 -2 Z" /> : null}
                <circle className="core" r={s.status === "verified" ? 5.5 : s.status === "evidenced" ? 5 : s.status === "suggested" ? 3.6 : 4.2} />
              </g>
            </g>
          ))}
        </g>
        <g className="sky-compass">
          <circle className="hub" cx={C} cy={C} r={20} />
          <g className="needle" style={{ "--needle": `${needle}deg` } as Vars}>
            <path className="n" d={`M${C} ${C - 30} L${C + 6} ${C} L${C - 6} ${C} Z`} />
            <path className="s" d={`M${C} ${C + 30} L${C + 6} ${C} L${C - 6} ${C} Z`} />
          </g>
          <circle className="pin" cx={C} cy={C} r={3} />
        </g>
      </svg>
      {labels ? (
        <div className="sky-labels" aria-hidden="true">
          {placed.map((s, i) => (
            <span key={s.id} className={`sky-label ${s.x >= C ? "e" : "w"} st-${s.status}`} style={{ left: `${s.x / 4}%`, top: `${s.y / 4}%`, "--i": i } as Vars}>{s.label}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- CompassRose: decorative drawing for hero and CTA bands ---------- */
export function CompassRose({ className }: { className?: string }) {
  const pts = (a: number, long: number, short: number) => {
    const p = (ang: number, rad: number) => { const t = ((ang - 90) * Math.PI) / 180; return `${round(100 + rad * Math.cos(t))},${round(100 + rad * Math.sin(t))}`; };
    return `${p(a, long)} ${p(a + 12, short)} 100,100 ${p(a - 12, short)}`;
  };
  return (
    <svg className={`rose ${className ?? ""}`} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <circle className="r1" cx="100" cy="100" r="92" pathLength={1} />
      <circle className="r2" cx="100" cy="100" r="70" pathLength={1} />
      {Array.from({ length: 32 }, (_, i) => <line key={i} className="tick" x1="100" y1={i % 4 === 0 ? 4 : 9} x2="100" y2="14" transform={`rotate(${i * 11.25} 100 100)`} />)}
      {[45, 135, 225, 315].map((a) => <polygon key={a} className="minor" points={pts(a, 52, 14)} />)}
      {[0, 90, 180, 270].map((a) => <polygon key={a} className={a === 0 ? "major north" : "major"} points={pts(a, 84, 16)} />)}
      <circle className="pin" cx="100" cy="100" r="5" />
    </svg>
  );
}
