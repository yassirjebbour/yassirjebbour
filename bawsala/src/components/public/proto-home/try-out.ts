/**
 * The try-it analysis and its result panel, ported from the prototype's tryRead() and tryOut().
 * Detection uses the app's production rules engine (detectSkills: pure, deterministic, no network), so the
 * sentence is read on the device, as the prototype's own note says ("Read on this device by the built-in reader").
 * Role ranking follows tryRead's fitWith on the app's real role requirements.
 */
import { detectSkills } from "@/server/domain/skills-engine";
import { esc, fmt, list, nfmt, LK, type HomeLocale } from "./format";
import { STRINGS, EXAMPLE, ICONS } from "./strings";

export interface TryRole { ini: string; title: string; org: string; city: string; req: Array<[string, boolean]> }
export interface TryData { roles: TryRole[]; names: Record<string, string>; hours: Record<string, number | null> }

/** Skills the prototype marks as rare (star icon, listed first): RARE in legacy/prototypes/BAWSALA.html. */
const RARE = new Set(["negotiation", "cash", "inventory", "leadership", "event", "multilingual"]);

/** The prototype's numLabel: the formatted message with its number set in bold. */
function numLabel(template: string, n: number, l: HomeLocale) {
  const text = fmt(template, { n }, l), num = nfmt(n, l), at = text.indexOf(num);
  return at < 0 ? `<span>${text}</span>` : `<span>${text.slice(0, at)}<b class="p-num">${num}</b>${text.slice(at + num.length)}</span>`;
}

export const exampleText = (l: HomeLocale) => EXAMPLE[l] ?? EXAMPLE[LK(l)];

export function tryRead(text: string, data: TryData) {
  // sortFinds: rare skills first, otherwise the engine order (stable sort), then the top 10.
  const found = detectSkills(text).map((d) => d.skillId).sort((a, b) => Number(RARE.has(b)) - Number(RARE.has(a))).slice(0, 10);
  const have = new Set(found);
  const fitWith = (r: TryRole) => { const s = r.req.filter(([id]) => have.has(id)); const req = s.filter(([, required]) => required).length; return s.length ? s.length / r.req.length + req / 1000 : 0; };
  const roles = found.length ? data.roles.map((o) => ({ o, p: fitWith(o) })).filter((x) => x.p > 0).sort((a, b) => b.p - a.p).slice(0, 3) : [];
  return { found, roles, have };
}

/** Result panel HTML (prototype classes, "p-" prefixed). `typed` = the visitor wrote something (else: the example). */
export function renderTryOut(typed: string, l: HomeLocale, data: TryData) {
  const S = STRINGS[l];
  const e = typed.trim();
  const r = tryRead(e || exampleText(l), data);
  if (!r.found.length) return `<div class="p-try-empty"><p class="p-mute">${S.try_none}</p></div>`;
  const top = r.roles[0];
  const miss = top ? top.o.req.filter(([id]) => !r.have.has(id)).map(([id]) => id) : [];
  const hours = miss.reduce((acc, id) => acc + (data.hours[id] ?? 4), 0);
  const name = (id: string) => esc(data.names[id] ?? id);
  return `<div class="p-try-res ${e ? "" : "p-is-ex"}">${e ? "" : `<p class="p-try-ex-l">${ICONS.user}${S.try_ex_res}</p>`}
    <p class="p-try-n">${numLabel(S.try_found, r.found.length, l)}</p>
    <div class="p-try-chips">${r.found.map((id, i) => `<span class="p-state p-s-conf" style="--j:${i}">${RARE.has(id) ? ICONS.star : ICONS.check}${name(id)}</span>`).join("")}</div>
    ${r.roles.length ? `<p class="p-eyebrow">${S.try_roles}</p><div class="p-try-roles">${r.roles.map(({ o }, i) => {
      const got = o.req.filter(([id]) => r.have.has(id)).length;
      return `<div class="p-try-role" style="--j:${i}"><span class="p-logo">${esc(o.ini)}</span><span class="p-tr-t"><b>${esc(o.title)}</b><small><bdi>${esc(o.org)}</bdi> · ${esc(o.city)} · ${S.u_demo}</small></span><span class="p-tr-p p-num">${nfmt(got, l)}/${nfmt(o.req.length, l)}</span><span class="p-tr-bar" aria-hidden="true"><i style="width:${Math.round((100 * got) / o.req.length)}%"></i></span></div>`;
    }).join("")}</div>` : ""}
    ${top && miss.length ? `<p class="p-try-miss">${ICONS.target}<span>${fmt(S.try_miss, { role: esc(top.o.title), miss: esc(list(miss.map((id) => data.names[id] ?? id), l)), h: hours }, l)}</span></p>` : ""}
    <div class="p-try-cta"><button class="p-btn" data-act="try-save">${ICONS.pass}${S.try_save}</button><span class="p-dim">${S.h4_f1}</span></div>
  </div>`;
}
