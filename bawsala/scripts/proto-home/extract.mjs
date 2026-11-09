#!/usr/bin/env node
/**
 * Extracts the public homepage from the original prototype (legacy/prototypes/BAWSALA.html), so the app renders
 * the owner's design exactly instead of a re-drawing of it.
 *
 * For each of the five languages it lets the prototype render its own homepage (with reduced motion, which is the
 * prototype's settled final state) and captures header, sections, footer and the language menu. It then:
 *  - prefixes every class with "p-" so app styles cannot interfere;
 *  - removes controls that point to pages the app does not have (see docs/HOMEPAGE_RESTORATION_SPEC.md);
 *  - extracts only the CSS rules those elements use (plus @keyframes / @media), scoped to ".bwh";
 *  - reads the runtime strings and story data from the prototype dictionaries as data.
 *
 * Output: src/components/public/proto-home/snap.<locale>.ts, strings.ts, and src/styles/proto-home.css.
 * Usage: node scripts/proto-home/extract.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = path.join(ROOT, "legacy", "prototypes", "BAWSALA.html");
const OUT = path.join(ROOT, "src", "components", "public", "proto-home");
const CSS_OUT = path.join(ROOT, "src", "styles", "proto-home.css");
const LOCALES = ["en", "fr", "ar", "ary", "zgh"];

// Prototype actions → what the app can really do. null = no counterpart in the app: the control is removed.
const PUB_SUPPORTED = new Set(["home", "how", "institutions", "trust", "signin"]);
const REMOVE_ACTS = new Set(["portal", "palette", "skip"]);
// Classes added at runtime by the prototype's scripts (and therefore by our port).
const RUNTIME = ["in", "on", "done", "s1", "s2", "s3", "s4", "fin", "out", "paused", "static", "pop", "bounce", "caret", "fm", "lv-fly",
  "fresh", "spl", "open", "is-ex", "lite", "calm", "rv", "show", "try-res", "try-empty", "try-ex-l", "try-n", "try-chips",
  "try-roles", "try-role", "logo", "tr-t", "tr-p", "tr-bar", "try-miss", "try-cta", "eyebrow", "state", "s-conf", "s-miss", "dim", "mute", "num"];

const src = fs.readFileSync(SRC, "utf8");

/* ---------- data from the prototype source (read as literals, never executed as code) ---------- */
function objAt(start) {
  let d = 0, q = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === "\\") { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "{" || c === "[") d++;
    else if (c === "}" || c === "]") { d--; if (d === 0) return src.slice(start, i + 1); }
  }
  throw new Error("unterminated literal");
}
const literal = (marker) => {
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`not found: ${marker}`);
  return vm.runInNewContext(`(${objAt(i + marker.indexOf("{"))})`, Object.create(null), { timeout: 2000 });
};
const T = literal("T={lang_en:"), ZGH = literal("ZGH={lang_en:"), ARY = literal("ARY={lang_en:");
const LIVE_STORY = literal("LIVE_STORY={"), EXAMPLE = literal("EXAMPLE={"), STARTERS = literal("STARTERS={");
// Darija and Tamazight names for catalogue texts (skills, roles, cities), keyed by the English text: tx() in the prototype.
const TXA = literal("TXA={"), TXZ = literal("TXZ={");
const IDX = { en: 0, fr: 1, ar: 2 };
/** The prototype's lookup: own dictionary first, then T in the fallback language (ary→ar, zgh→fr). */
function tr(locale, key) {
  if (locale === "ary" && ARY[key] != null) return ARY[key];
  if (locale === "zgh" && ZGH[key] != null) return ZGH[key];
  const lk = locale === "ary" ? "ar" : locale === "zgh" ? "fr" : locale;
  const v = T[key];
  return Array.isArray(v) ? v[IDX[lk]] : v ?? null;
}
const RUNTIME_KEYS = ["lv_c1", "lv_c2", "lv_c3", "lv_pause", "lv_play", "ls_play", "try_none", "try_ex_res", "try_found", "try_roles",
  "try_miss", "try_save", "h4_f1", "pub_open", "pub_start", "lang_ary", "lang_ar", "lang_fr", "lang_en", "lang_zgh", "h4_h1", "h4_sub", "pb_h", "en_h", "ax_lite_on", "ax_lite_off", "u_demo"];


/* Raw CSS parser: rules are copied exactly as written in the prototype (CSSOM serialisation drops shorthands
   that contain var(), e.g. `font: 600 clamp(...) / .95 var(--f-lat)`). */
function parseCss(text) {
  let i = 0;
  const skip = () => { for (;;) { while (i < text.length && /\s/.test(text[i])) i++; if (text.startsWith("/*", i)) { const e = text.indexOf("*/", i + 2); i = e < 0 ? text.length : e + 2; } else return; } };
  const block = () => { // text[i] === "{": returns inner text and moves past the matching "}"
    let d = 0, q = null; const start = i + 1;
    for (; i < text.length; i++) { const c = text[i];
      if (q) { if (c === "\\") { i++; continue; } if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === "{") d++; else if (c === "}") { d--; if (d === 0) { const inner = text.slice(start, i); i++; return inner; } } }
    throw new Error("unbalanced CSS");
  };
  const list = (end) => { const out = [];
    for (;;) { skip(); if (i >= end || text[i] === "}") return out;
      let q = null, depth = 0; const start = i;
      for (; i < text.length; i++) { const c = text[i]; if (q) { if (c === "\\") { i++; continue; } if (c === q) q = null; continue; }
        if (c === '"' || c === "'") { q = c; continue; } if (c === "(") depth++; else if (c === ")") depth--; else if (depth === 0 && (c === "{" || c === ";")) break; }
      const prelude = text.slice(start, i).trim();
      if (text[i] === ";") { i++; continue; }
      const blockStart = i; const inner = block();
      if (/^@(media|supports|container|layer)\b/.test(prelude)) { const sub = { t: "media", at: prelude.split(/\s/)[0].slice(1), cond: prelude.replace(/^@\S+\s*/, ""), rules: [] }; const save = i; i = blockStart + 1; sub.rules = list(save - 1); i = save; out.push(sub); }
      else if (/^@(-webkit-)?keyframes\b/.test(prelude)) out.push({ t: "kf", name: prelude.split(/\s+/)[1], text: prelude + "{" + inner + "}" });
      else if (prelude.startsWith("@")) out.push({ t: "other", text: prelude + "{" + inner + "}" });
      else out.push({ t: "style", sel: prelude, body: inner.trim() });
    } };
  return list(text.length);
}

/**
 * WCAG 2.5.3 (Label in Name): a control's accessible name must contain its visible text, so a voice-control user
 * can say what they see ("click EN"). The prototype names some controls differently ("EN" is labelled "English");
 * the visible text is put first in the label. Nothing visible changes.
 */
const LABEL_IN_NAME = () => {
  const words = (t) => " " + t.toLowerCase().replace(/[\s:—,.·]+/g, " ").trim() + " ";
  document.querySelectorAll("#app button[aria-label], #app a[aria-label], #pop button[aria-label]").forEach((el) => {
    const seen = el.innerText.replace(/\s+/g, " ").trim(); const label = el.getAttribute("aria-label");
    if (!seen || words(label).includes(words(seen))) return;
    const [head, ...rest] = label.split(" — ");
    el.setAttribute("aria-label", rest.length && words(seen).includes(words(head)) ? [seen, ...rest].join(" — ") : `${seen} — ${label}`);
  });
};

/* ---------- render with the prototype ---------- */
async function capture(browser, locale) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 860 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("file://" + SRC);
  await page.waitForSelector("main#main");
  if (locale !== "en") { await page.click(`footer [data-act=lang][data-l=${locale}]`); await page.waitForTimeout(600); }
  const lang = await page.evaluate(() => document.documentElement.lang);
  // Language menu, as the prototype draws it.
  await page.click("header [data-act=lang-pick]"); await page.waitForTimeout(300);
  await page.evaluate(LABEL_IN_NAME);
  const pop = await page.evaluate(() => document.querySelector("#pop")?.outerHTML ?? "");
  await page.keyboard.press("Escape"); await page.waitForTimeout(200);
  await page.evaluate(LABEL_IN_NAME);
  const parts = await page.evaluate(({ PUB, REMOVE }) => {
    const app = document.querySelector("#app");
    const drop = (el) => { const li = el.closest("li"); (li && li.querySelectorAll("[data-act]").length === 1 ? li : el).remove(); };
    app.querySelectorAll("[data-act]").forEach((el) => {
      const a = el.dataset.act;
      if (REMOVE.includes(a)) return drop(el);
      if (a === "pub" && !PUB.includes(el.dataset.p)) return drop(el);
      // In-page links only scroll to a section; one that sits inside its own target section would do nothing.
      const target = { how: "engine", institutions: "inst", trust: "trust-h" }[el.dataset.p];
      if (a === "pub" && target && el.closest("#" + target)) return drop(el);
    });
    // Settled, accessible no-JS state: bars at their value, live story playing (pause control shown).
    app.querySelectorAll("[data-w]").forEach((el) => { el.style.width = Math.max(2, +el.dataset.w) + "%"; });
    const lv = app.querySelector("#lv"); if (lv) lv.classList.remove("paused", "static");
    const tryOut = app.querySelector("#tryOut"); const tryOrig = tryOut ? tryOut.innerHTML : ""; if (tryOut) tryOut.innerHTML = "<!--TRYOUT-->";
    const ta = app.querySelector("#tryT"); if (ta) ta.textContent = "";
    const header = app.querySelector("header.pub-nav")?.outerHTML ?? "";
    const main = app.querySelector("main#main")?.innerHTML ?? "";
    const footer = app.querySelector("footer.pub-foot")?.outerHTML ?? "";
    return { header, main, footer, tryOrig };
  }, { PUB: [...PUB_SUPPORTED], REMOVE: [...REMOVE_ACTS] });
  // Mobile menu: the prototype redraws its header with the menu open.
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
  await page.click("header [data-act=pub-menu]"); await page.waitForTimeout(300);
  await page.evaluate(LABEL_IN_NAME);
  const headerMenu = await page.evaluate(({ PUB, REMOVE }) => {
    const h = document.querySelector("header.pub-nav");
    h.querySelectorAll("[data-act]").forEach((el) => { const a = el.dataset.act; const drop = () => { const li = el.closest("li"); (li && li.querySelectorAll("[data-act]").length === 1 ? li : el).remove(); }; if (REMOVE.includes(a) || (a === "pub" && !PUB.includes(el.dataset.p))) drop(); });
    return h.outerHTML;
  }, { PUB: [...PUB_SUPPORTED], REMOVE: [...REMOVE_ACTS] });
  await ctx.close();
  return { lang, pop, headerMenu, ...parts };
}

/* ---------- transforms ---------- */
const prefixClasses = (html) => html.replace(/\sclass="([^"]*)"/g, (_, v) => ` class="${v.split(/\s+/).filter(Boolean).map((c) => "p-" + c).join(" ")}"`);
const classesIn = (html) => new Set([...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/).filter(Boolean)));
const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]));

function splitTop(sel) { const out = []; let d = 0, cur = ""; for (const c of sel) { if ("([".includes(c)) d++; if (")]".includes(c)) d--; if (c === "," && d === 0) { out.push(cur.trim()); cur = ""; } else cur += c; } if (cur.trim()) out.push(cur.trim()); return out; }
function renameClasses(part) { let out = "", inAttr = 0; for (let i = 0; i < part.length; i++) { const c = part[i]; if (c === "[") inAttr++; if (c === "]") inAttr--; if (!inAttr && c === "." && /[a-zA-Z_]/.test(part[i + 1] || "")) { out += ".p-"; continue; } out += c; } return out; }
function scopePart(part) {
  // Root-level selectors (tokens, theme): keep the html condition, apply to the .bwh container.
  const m = part.match(/^(:root|html)((?:\[[^\]]*\]|:not\([^)]*\)|\.[\w-]+)*)\s*(.*)$/);
  if (m) {
    // The app's language codes are more precise than the prototype's (ary for Darija, zgh-Tfng for Tamazight in
    // Tifinagh), so the prototype's language rules must match them too.
    const cond = m[2].replace(/\.([\w-]+)/g, ".$1")
      .replace(/\[lang\|=ar\]/g, ":is([lang|=ar],[lang|=ary])")
      .replace(/\[lang=zgh\]/g, ":is([lang=zgh],[lang|=zgh])");
    const rest = m[3].replace(/^body\b/, "").trim();
    return `html${cond} .bwh${rest ? " " + renameClasses(rest) : ""}`;
  }
  const t = part.match(/^((?:\[data-theme[^\]]*\]|:not\(\[data-theme[^)]*\)\))+)\s+(.*)$/);
  if (t) return `html${t[1]} .bwh ${renameClasses(t[2].replace(/^body\b\s*/, ""))}`.trim();
  if (/^body\b/.test(part)) { const rest = part.replace(/^body\b/, "").trim(); return rest.startsWith(".") || rest.startsWith(":") || rest.startsWith("[") ? `.bwh${renameClasses(rest)}` : `.bwh ${renameClasses(rest)}`.trim(); }
  if (part === "*" || part.startsWith("*")) return `.bwh ${part}`;
  return `.bwh ${renameClasses(part)}`;
}

function buildCss(rules, classes, ids) {
  const used = new Set();
  const okPart = (p) => {
    const cls = [...p.replace(/\[[^\]]*\]/g, "").matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
    const id = [...p.replace(/\[[^\]]*\]/g, "").matchAll(/#([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
    return cls.every((c) => classes.has(c)) && id.every((x) => ids.has(x));
  };
  const emit = (list, indent) => list.map((r) => {
    if (r.t === "style") {
      const parts = splitTop(r.sel).filter(okPart);
      if (!parts.length || !r.body) return "";
      for (const m of r.body.matchAll(/animation(?:-name)?:\s*([^;]+)/g)) m[1].split(",").forEach((a) => a.trim().split(/\s+/).forEach((w) => used.add(w)));
      return `${indent}${parts.map(scopePart).join(", ")} { ${r.body} }`;
    }
    if (r.t === "media" || r.t === "supports") { const inner = emit(r.rules, indent + "  ").filter(Boolean); return inner.length ? `${indent}@${r.at || (r.t === "media" ? "media" : "supports")} ${r.cond} {\n${inner.join("\n")}\n${indent}}` : ""; }
    return "";
  });
  const body = emit(rules, "").filter(Boolean);
  const kfs = [];
  const walkKf = (list) => list.forEach((r) => { if (r.t === "kf" && used.has(r.name)) kfs.push(r.text); if (r.rules) walkKf(r.rules); });
  walkKf(rules);
  return body.join("\n") + "\n\n/* keyframes used by the homepage */\n" + [...new Set(kfs)].join("\n");
}

(async () => {
  const browser = await chromium.launch();
  const snaps = {};
  for (const l of LOCALES) { snaps[l] = await capture(browser, l); console.log(l, "lang=" + snaps[l].lang, "main", snaps[l].main.length); }
  const rawCss = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
  const rules = parseCss(rawCss);
  await browser.close();

  const all = LOCALES.map((l) => snaps[l].header + snaps[l].headerMenu + snaps[l].main + snaps[l].footer + snaps[l].pop).join("");
  const classes = new Set([...classesIn(all), ...RUNTIME]);
  const ids = idsIn(all);
  ["app", "layer", "toasts"].forEach((x) => ids.add(x));
  fs.mkdirSync(OUT, { recursive: true });
  const banner = "/* Generated by scripts/proto-home/extract.mjs from legacy/prototypes/BAWSALA.html. Do not edit by hand. */\n";
  for (const l of LOCALES) {
    const s = snaps[l];
    const data = { header: prefixClasses(s.header), headerMenu: prefixClasses(s.headerMenu), main: prefixClasses(s.main), footer: prefixClasses(s.footer), pop: prefixClasses(s.pop) };
    fs.writeFileSync(path.join(OUT, `snap.${l}.ts`), banner + `const snap = ${JSON.stringify(data)};\nexport default snap;\n`);
  }
  // Icons used by the try-it result, taken from the prototype's own rendering of that result.
  const firstSvg = (html, marker) => { const i = html.indexOf(marker); if (i < 0) return null; const a = html.indexOf("<svg", i), b = html.indexOf("</svg>", a); return a < 0 ? null : html.slice(a, b + 6); };
  const o = snaps.en.tryOrig;
  const chipSvgs = [...o.matchAll(/class="state s-conf"[^>]*>(<svg[\s\S]*?<\/svg>)/g)].map((m) => m[1]);
  const ICONS = { user: firstSvg(o, 'class="try-ex-l"'), star: chipSvgs[0], check: chipSvgs[chipSvgs.length - 1], target: firstSvg(o, 'class="try-miss"'), pass: firstSvg(o, 'data-act="try-save"') };
  if (ICONS.star === ICONS.check) throw new Error("star and check icons not distinguished");
  for (const [k, v] of Object.entries(ICONS)) if (!v) throw new Error("icon not found: " + k);
  const strings = Object.fromEntries(LOCALES.map((l) => [l, Object.fromEntries(RUNTIME_KEYS.map((k) => [k, tr(l, k)]))]));
  fs.writeFileSync(path.join(OUT, "strings.ts"), banner + `export const STRINGS = ${JSON.stringify(strings, null, 1)} as const;\n` +
    `export const LIVE_STORY: Record<string, { text: string; terms: string[] }> = ${JSON.stringify(LIVE_STORY)};\n` +
    `export const EXAMPLE: Record<string, string> = ${JSON.stringify(EXAMPLE)};\n` +
    `export const STARTERS: Record<string, string[]> = ${JSON.stringify(STARTERS)};\n` +
    `export const ICONS = ${JSON.stringify(ICONS)};\n` +
    `export const TXA: Record<string, string> = ${JSON.stringify(TXA)};\n` +
    `export const TXZ: Record<string, string> = ${JSON.stringify(TXZ)};\n`);
  const css = buildCss(rules, classes, ids);
  // The prototype was designed on browser defaults; the app adds a CSS reset (Tailwind preflight) and its own
  // element styles. Inside .bwh every property first goes back to the browser default, then the prototype's
  // own rules (higher specificity, later in this file) apply, exactly as in the original file.
  // SVG is excluded: its drawing attributes (fill, stroke…) sit at the same level and must not be reverted;
  // only the reset's display/vertical-align change on svg is undone.
  // Fonts: the prototype's own @font-face declarations, copied as written (same weights and unicode ranges),
  // under homepage-only family names. The files are the same ones the app serves from /public/fonts
  // (byte-identical to the fonts embedded in the prototype), so no font data is duplicated.
  const FILE = { "IBM Plex Sans": "ibm-plex-sans", "IBM Plex Sans Arabic": "ibm-plex-sans-arabic", "Noto Sans Tifinagh": "noto-sans-tifinagh" };
  const faces = [...rawCss.matchAll(/@font-face\{font-family:'([^']+)';([^}]*?)src:url\(data:font\/woff2;base64,[A-Za-z0-9+/=]+\)\s*format\('woff2'\);?([^}]*)\}/g)].map((m) => {
    const weight = (m[2].match(/font-weight:(\d+)/) || [])[1];
    const file = `/fonts/${FILE[m[1]]}-${weight}.woff2`;
    if (!fs.existsSync(path.join(ROOT, "public", file))) throw new Error("font file missing: " + file);
    return `@font-face{font-family:'BWH ${m[1]}';${m[2]}src:url(${file}) format('woff2');${m[3]}}`;
  });
  if (faces.length !== 9) throw new Error("expected 9 prototype font faces, got " + faces.length);
  const fontCss = css.replace(/(['"])(IBM Plex Sans Arabic|IBM Plex Sans|Noto Sans Tifinagh)\1/g, (_, q, f) => `${q}BWH ${f}${q}`);
  const reset = ".bwh :where(*:not(svg, svg *)), .bwh :where(*:not(svg, svg *))::before, .bwh :where(*:not(svg, svg *))::after { all: revert; }\n" +
    ".bwh :where(svg) { display: revert; vertical-align: revert; max-width: revert; height: revert; }\n";
  fs.writeFileSync(CSS_OUT, "/* Generated by scripts/proto-home/extract.mjs from legacy/prototypes/BAWSALA.html (homepage rules only, scoped to .bwh). Do not edit by hand. */\n" + faces.join("\n") + "\n" + reset + fontCss + "\n");
  console.log("classes", classes.size, "css bytes", css.length);
})().catch((e) => { console.error(e); process.exit(1); });
