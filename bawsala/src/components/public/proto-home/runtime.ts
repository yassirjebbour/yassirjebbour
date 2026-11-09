/**
 * Homepage runtime, ported from the original prototype (legacy/prototypes/BAWSALA.html):
 *   livePlay / liveReset / liveFinal / liveStep / liveType / liveFly / liveWires / liveToggle / markAll  (hero story)
 *   pubMount: reveals (.rv, .rv-g stagger), setBars, runCounts/countUp, spotlight                    (scroll motion)
 *   ls-toggle (marquee), tryMount/tryRefresh (try-it), lang-pick menu, pub-menu, listen, lite, fsize   (controls)
 * Timings, keyframes and class names are the prototype's own (classes carry the "p-" prefix).
 * Actions are mapped to the app's real routes and APIs; see docs/HOMEPAGE_RESTORATION_SPEC.md.
 */
import { esc, filmIcon, nfmt, pfmt, LK, type HomeLocale } from "./format";
import { STRINGS, LIVE_STORY, STARTERS } from "./strings";
import { renderTryOut, exampleText, type TryData } from "./try-out";

export interface RuntimeOpts {
  locale: HomeLocale;
  headerHtml: string;
  headerMenuHtml: string;
  popHtml: string;
  tryData: TryData;
  startHref: string;
  navigate: (href: string) => void;
  setLocale: (l: HomeLocale) => Promise<void>;
  toggleTheme: () => void;
  setTheme: (v: "light" | "dark" | "system") => void;
  toast: (msg: string) => void;
}

const PREFS_KEY = "bawsala.home.prefs";
type Prefs = { lite?: boolean; fs?: number };
function readPrefs(): Prefs { try { return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"); } catch { return {}; } }
function writePrefs(p: Prefs) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* storage blocked: preference lasts for this visit */ } }

export function mountProtoHome(root: HTMLElement, o: RuntimeOpts): () => void {
  const S = STRINGS[o.locale];
  const $ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = root) => el.querySelector<T & HTMLElement>(sel);
  const $$ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = root) => [...el.querySelectorAll<T & HTMLElement>(sel)];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const cleanups: Array<() => void> = [];
  let prefs = readPrefs();
  const RM = () => !!prefs.lite || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const applyPrefs = () => { root.classList.toggle("p-lite", !!prefs.lite); root.style.setProperty("zoom", prefs.fs && prefs.fs !== 1 ? String(prefs.fs) : ""); };
  applyPrefs();
  const bounce = (el: Element | null, cls = "p-bounce") => { if (!el) return; el.classList.remove(cls); void (el as HTMLElement).offsetWidth; el.classList.add(cls); };

  /* ---------------- hero: live story ---------------- */
  const LIVE = { tok: 0, paused: false };
  const story = LIVE_STORY[o.locale] ?? LIVE_STORY[LK(o.locale)];
  const D = { text: story.text, terms: story.terms, from: 2, to: 9, n: 11 };
  const lvFrac = (x: number) => nfmt(x, o.locale) + "/" + nfmt(D.n, o.locale);
  const lvPct = (x: number) => Math.round((100 * x) / D.n);
  const markAll = (text: string, terms: string[]) => {
    let a = esc(text);
    terms.filter(Boolean).forEach((term, s) => {
      const i = esc(term), at = a.toLowerCase().indexOf(i.toLowerCase());
      if (at < 0) return;
      let r = at, l = at + i.length; const c = /[\s.,;:!?،؟]/;
      for (; r > 0 && !c.test(a[r - 1]);) r--;
      for (; l < a.length && !c.test(a[l]);) l++;
      a = a.slice(0, r) + `<mark class="p-fm" data-i="${s}">` + a.slice(r, l) + "</mark>" + a.slice(l);
    });
    return a;
  };
  const liveAt = (fn: () => void, ms: number, tok: number) => later(() => { if (tok === LIVE.tok && $("#lv")) fn(); }, ms);
  const liveStep = (e: number) => {
    const lv = $("#lv"); if (!lv) return;
    lv.dataset.step = String(e);
    $$(".p-lv-steps li", lv).forEach((li, i) => { li.classList.toggle("p-on", i === e); li.classList.toggle("p-done", i < e); });
    const cap = $("#lvCap"); if (cap) cap.textContent = S[`lv_c${e + 1}` as "lv_c1"];
  };
  const ringTo = (pct: number) => { const v = $<SVGPathElement>(".p-lv-ring .p-g-val"); if (v) v.style.strokeDasharray = pct + " 100"; };
  const liveWires = () => {
    const lv = $("#lv"); if (!lv) return;
    const stage = $(".p-lv-stage", lv)!, a = stage.getBoundingClientRect(), svg = $<SVGSVGElement>(".p-lv-wires", stage)!;
    svg.setAttribute("viewBox", `0 0 ${a.width} ${a.height}`); svg.setAttribute("width", String(a.width)); svg.setAttribute("height", String(a.height));
    const box = (el: Element) => { const s = el.getBoundingClientRect(); return { l: s.left - a.left, t: s.top - a.top, r: s.right - a.left, b: s.bottom - a.top, cx: (s.left + s.right) / 2 - a.left, cy: (s.top + s.bottom) / 2 - a.top }; };
    const link = (e1: Element, e2: Element) => {
      const p = box(e1), q = box(e2);
      if (Math.abs(p.cx - q.cx) > 0.9 * Math.abs(p.cy - q.cy)) { const right = q.cx > p.cx, s = right ? p.r : p.l, t = right ? q.l : q.r, c = (s + t) / 2; return `M${s} ${p.cy} C${c} ${p.cy} ${c} ${q.cy} ${t} ${q.cy}`; }
      const down = q.cy > p.cy, r = down ? p.b : p.t, l = down ? q.t : q.b, d = (r + l) / 2; return `M${p.cx} ${r} C${p.cx} ${d} ${q.cx} ${d} ${q.cx} ${l}`;
    };
    $(".p-w1", svg)?.setAttribute("d", link($(".p-lv-a", stage)!, $(".p-lv-b", stage)!));
    $(".p-w2", svg)?.setAttribute("d", link($(".p-lv-b", stage)!, $(".p-lv-c", stage)!));
  };
  const liveReset = () => {
    const lv = $("#lv"); if (!lv) return;
    lv.classList.remove("p-s1", "p-s2", "p-s3", "p-s4", "p-fin");
    $("#lvT")!.innerHTML = "&nbsp;"; $("#lvN")!.textContent = nfmt(0, o.locale); $("#lvP")!.textContent = lvFrac(0);
    $$(".p-lv-slot", lv).forEach((e) => e.classList.remove("p-on")); $$(".p-lv-path i", lv).forEach((e) => e.classList.remove("p-on"));
    const v = $<SVGPathElement>(".p-lv-ring .p-g-val", lv);
    if (v) { v.style.transition = "none"; v.style.strokeDasharray = "0 100"; v.getBoundingClientRect(); v.style.transition = ""; }
    $$(".p-lv-fly", lv).forEach((e) => e.remove());
  };
  const liveFinal = () => {
    const lv = $("#lv"); if (!lv) return;
    lv.classList.add("p-s1", "p-s2", "p-s3", "p-s4", "p-fin");
    $("#lvT")!.innerHTML = markAll(D.text, D.terms).replace(/class="p-fm"/g, 'class="p-fm p-on"');
    $("#lvN")!.textContent = nfmt(D.terms.length, o.locale);
    $$(".p-lv-slot", lv).forEach((e) => e.classList.add("p-on")); $$(".p-lv-path i", lv).forEach((e) => e.classList.add("p-on"));
    $("#lvP")!.textContent = lvFrac(D.to); ringTo(lvPct(D.to));
    liveStep(2); liveWires();
  };
  const liveType = (el: HTMLElement, text: string, tok: number, done: () => void) => {
    const chars = [...text]; let r = 0;
    const tick = () => {
      if (tok !== LIVE.tok || !el.isConnected) return;
      r++; el.innerHTML = esc(chars.slice(0, r).join("")) + '<span class="p-caret"></span>';
      if (r < chars.length) later(tick, 22 + 26 * Math.random()); else later(() => { if (tok === LIVE.tok) done(); }, 260);
    };
    tick();
  };
  const liveFly = (from: Element, slot: HTMLElement, done: () => void) => {
    const lv = $("#lv")!, L0 = lv.getBoundingClientRect(), r = from.getBoundingClientRect(), t = slot.getBoundingClientRect();
    const c = slot.firstElementChild!.cloneNode(true) as HTMLElement;
    c.classList.add("p-lv-fly"); c.style.left = r.left - L0.left + "px"; c.style.top = r.top - L0.top - 4 + "px"; lv.appendChild(c);
    const p = t.left - r.left, d = t.top - r.top + 4;
    c.animate([{ transform: "translate(0,0) scale(.7)", opacity: 0 }, { transform: `translate(${0.5 * p}px,${0.5 * d - 28}px) scale(1.06)`, opacity: 1, offset: 0.55 }, { transform: `translate(${p}px,${d}px) scale(1)`, opacity: 1 }],
      { duration: 820, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }).onfinish = () => { c.remove(); done(); };
  };
  const livePlay = () => {
    const tok = ++LIVE.tok, lv = $("#lv"); if (!lv) return;
    if (RM()) { liveFinal(); return; }
    liveReset(); liveStep(0); liveWires();
    const T = $("#lvT")!;
    lv.classList.add("p-s1");
    liveAt(() => liveType(T, D.text, tok, () => {
      T.innerHTML = markAll(D.text, D.terms); lv.classList.add("p-s2"); liveStep(1);
      const marks = $$(".p-fm", T), slots = $$(".p-lv-slot", lv);
      slots.forEach((slot, i) => {
        const m = marks[i] || T;
        liveAt(() => m.classList && m.classList.add("p-on"), 200 + 320 * i, tok);
        liveAt(() => liveFly(m, slot, () => { if (tok === LIVE.tok) { slot.classList.add("p-on"); $("#lvN")!.textContent = nfmt(i + 1, o.locale); bounce($(".p-lv-cnt", lv), "p-pop"); } }), 850 + 360 * i, tok);
      });
      const base = 850 + 360 * slots.length + 900;
      liveAt(() => { lv.classList.add("p-s3"); liveStep(2); ringTo(lvPct(D.from)); $("#lvP")!.textContent = lvFrac(D.from); }, base, tok);
      $$(".p-lv-path i", lv).forEach((dot, i) => liveAt(() => { dot.classList.add("p-on"); const v = Math.round(D.from + ((D.to - D.from) * (i + 1)) / 7); ringTo(lvPct(v)); $("#lvP")!.textContent = lvFrac(v); }, base + 1500 + 260 * i, tok));
      liveAt(() => { lv.classList.add("p-s4", "p-fin"); bounce($(".p-lv-ring", lv), "p-pop"); }, base + 1500 + 1820 + 200, tok);
      liveAt(() => { if (!LIVE.paused) lv.classList.add("p-out"); }, base + 6800, tok);
      liveAt(() => { lv.classList.remove("p-out"); if (!LIVE.paused) livePlay(); }, base + 7300, tok);
    }), 350, tok);
  };
  const liveToggle = () => {
    const lv = $("#lv"); if (!lv) return;
    LIVE.paused = !LIVE.paused; lv.classList.toggle("p-paused", LIVE.paused);
    const b = $(".p-lv-btn", lv)!; b.innerHTML = filmIcon(LIVE.paused); b.setAttribute("aria-label", LIVE.paused ? S.lv_play : S.lv_pause);
    if (LIVE.paused) { LIVE.tok++; liveFinal(); } else livePlay();
  };
  // liveMount: show the finished story, then after 2.6 s fade out and play; pointer tilt on the hero;
  // the story pauses while the hero is off screen and replays when it comes back.
  const liveMount = () => {
    const lv = $("#lv"); if (!lv) return;
    LIVE.paused = false; liveWires();
    const st = $(".p-lv-stage", lv);
    if (st && "ResizeObserver" in window) { const ro = new ResizeObserver(() => liveWires()); ro.observe(st); cleanups.push(() => ro.disconnect()); }
    liveFinal();
    if (RM()) { lv.classList.add("p-static"); return; }
    const hero = lv.closest<HTMLElement>(".p-hero3");
    if (hero && st && matchMedia("(hover:hover) and (pointer:fine)").matches) {
      let raf = 0;
      const move = (ev: PointerEvent) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const b = hero.getBoundingClientRect(), ox = (ev.clientX - b.left) / b.width - 0.5, oy = (ev.clientY - b.top) / b.height - 0.5; st.style.setProperty("--ry", (7 * ox).toFixed(2) + "deg"); st.style.setProperty("--rx", (5 * -oy).toFixed(2) + "deg"); hero.style.setProperty("--px", (14 * ox).toFixed(1) + "px"); hero.style.setProperty("--py", (10 * oy).toFixed(1) + "px"); }); };
      const leave = () => { st.style.setProperty("--ry", "0deg"); st.style.setProperty("--rx", "0deg"); hero.style.setProperty("--px", "0px"); hero.style.setProperty("--py", "0px"); };
      hero.addEventListener("pointermove", move); hero.addEventListener("pointerleave", leave);
      cleanups.push(() => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); });
    }
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { if (lv.dataset.idle && !LIVE.paused) { delete lv.dataset.idle; livePlay(); } }
        else { LIVE.tok++; lv.dataset.idle = "1"; }
      }), { threshold: 0.2 });
      io.observe(lv); cleanups.push(() => io.disconnect());
    }
    const tok = LIVE.tok;
    later(() => { if (tok === LIVE.tok && !LIVE.paused && lv.isConnected) { lv.classList.add("p-out"); later(() => { lv.classList.remove("p-out"); livePlay(); }, 380); } }, 2600);
  };
  liveMount();

  /* ---------------- scroll motion (pubMount) ---------------- */
  const countUp = (el: HTMLElement, to: number, ms: number) => {
    const digits = el.dataset.pct != null ? +(el.dataset.pct || 0) : null;
    const out = (v: number) => (digits != null ? pfmt(v, o.locale, digits) : nfmt(Math.round(v), o.locale) + (el.dataset.suffix || ""));
    if (RM()) { el.textContent = out(to); return; }
    const t0 = performance.now();
    const step = (t: number) => { const r = Math.min(1, (t - t0) / ms), p = 1 - Math.pow(1 - r, 3), d = to * p; el.textContent = out(digits ? Math.round(d * 10 ** digits) / 10 ** digits : Math.round(d)); if (r < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const setBars = (el: ParentNode) => requestAnimationFrame(() => requestAnimationFrame(() => $$("[data-w]", el).forEach((b) => { b.style.width = Math.max(2, +(b.dataset.w || 0)) + "%"; })));
  const runCounts = (el: ParentNode) => $$("[data-cv]", el).forEach((c) => countUp(c, +(c.dataset.cv || 0), 1200));
  const REVEAL = ".p-rv, .p-chain, .p-jy, .p-xl, .p-feat, .p-engine, .p-imp";
  if (!RM() && "IntersectionObserver" in window) {
    const vh = () => window.innerHeight || document.documentElement.clientHeight;
    const onScreen = (el: Element) => { const r = el.getBoundingClientRect(); return r.top < vh() && r.bottom > 0; };
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const t = en.target as HTMLElement;
      t.classList.add("p-in");
      if ($("[data-w]", t)) setBars(t);
      if ($("[data-cv]", t)) runCounts(t);
      io.unobserve(t);
    }), { rootMargin: "0px 0px -8% 0px" });
    $$(".p-rv-g").forEach((g) => $$(":scope > *", g).forEach((c, i) => { c.classList.add("p-rv"); c.style.transitionDelay = (i % 4) * 80 + "ms"; }));
    // The page was served in its settled state; anything still below the fold is re-armed so it plays on arrival.
    $$(REVEAL).forEach((el) => {
      if (onScreen(el)) { el.classList.add("p-in"); return; }
      el.classList.remove("p-in");
      $$("[data-w]", el).forEach((b) => { b.style.width = "0%"; });
      $$("[data-cv]", el).forEach((c) => { const d = c.dataset.pct != null ? +(c.dataset.pct || 0) : null; c.textContent = d != null ? pfmt(0, o.locale, d) : nfmt(0, o.locale); });
      io.observe(el);
    });
    cleanups.push(() => io.disconnect());
  } else $$(REVEAL).forEach((el) => el.classList.add("p-in"));
  if (!RM() && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    $$(".p-feat, .p-ht-states li, .p-ht-priv, .p-hw-vis, .p-mt-c, .p-pb-st, .p-pb-par, .p-see, .p-try-out, .p-xl, .p-eco, .p-rmap > li").forEach((el) => {
      el.classList.add("p-spl");
      const move = (ev: PointerEvent) => { const a = el.getBoundingClientRect(); el.style.setProperty("--mx", ev.clientX - a.left + "px"); el.style.setProperty("--my", ev.clientY - a.top + "px"); };
      el.addEventListener("pointermove", move); cleanups.push(() => el.removeEventListener("pointermove", move));
    });
  }

  /* ---------------- try-it ---------------- */
  const ta = $<HTMLTextAreaElement>("#tryT");
  let tryT: ReturnType<typeof setTimeout> | undefined;
  const tryRefresh = () => {
    const out = $("#tryOut"); if (!out) return;
    out.innerHTML = renderTryOut(ta?.value ?? "", o.locale, o.tryData);
    out.classList.remove("p-fresh"); void out.offsetWidth; out.classList.add("p-fresh");
  };
  const onInput = () => { clearTimeout(tryT); tryT = setTimeout(tryRefresh, 160); const c = $(".p-try-clear"); if (c) c.hidden = !ta!.value; };
  ta?.addEventListener("input", onInput);
  cleanups.push(() => { ta?.removeEventListener("input", onInput); clearTimeout(tryT); });

  /* ---------------- language menu ---------------- */
  let pop: HTMLElement | null = null;
  const closePop = () => { if (!pop) return; pop.remove(); pop = null; $$("[data-act=lang-pick]").forEach((b) => b.setAttribute("aria-expanded", "false")); };
  const openPop = (btn: HTMLElement) => {
    const tpl = document.createElement("template"); tpl.innerHTML = o.popHtml.trim();
    pop = tpl.content.firstElementChild as HTMLElement; pop.removeAttribute("style"); root.appendChild(pop);
    const r = btn.getBoundingClientRect(), w = pop.offsetWidth, rtl = getComputedStyle(root).direction === "rtl";
    const left = Math.max(8, Math.min(window.innerWidth - w - 8, rtl ? r.left : r.right - w));
    Object.assign(pop.style, { left: left + "px", top: r.bottom + 6 + "px", transformOrigin: `${rtl ? 0 : w}px 0px` });
    btn.setAttribute("aria-expanded", "true");
    $<HTMLElement>("[aria-checked=true]", pop)?.focus();
  };
  const onDocDown = (e: PointerEvent) => { if (pop && !pop.contains(e.target as Node) && !(e.target as Element).closest?.("[data-act=lang-pick]")) closePop(); };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { closePop(); if (menuOpen) toggleMenu(); } };
  document.addEventListener("pointerdown", onDocDown); document.addEventListener("keydown", onKey);
  cleanups.push(() => { document.removeEventListener("pointerdown", onDocDown); document.removeEventListener("keydown", onKey); closePop(); });

  /* ---------------- mobile menu: the prototype redraws its header ---------------- */
  let menuOpen = false;
  const toggleMenu = () => {
    menuOpen = !menuOpen;
    const h = $("header.p-pub-nav"); if (!h) return;
    h.outerHTML = menuOpen ? o.headerMenuHtml : o.headerHtml;
    $<HTMLElement>(".p-pub-menu")?.focus();
  };

  /* ---------------- actions ---------------- */
  const scrollToId = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: RM() ? "auto" : "smooth", block: "start" }); };
  const SECTION: Record<string, string> = { how: "engine", institutions: "inst", trust: "trust-h" };
  const ACT: Record<string, (el: HTMLElement) => void> = {
    start: () => o.navigate(o.startHref),
    pub: (el) => { const p = el.dataset.p || ""; if (menuOpen) toggleMenu(); if (p === "home") window.scrollTo({ top: 0, behavior: RM() ? "auto" : "smooth" }); else if (p === "signin") o.navigate("/signin"); else if (SECTION[p]) scrollToId(SECTION[p]); },
    "scroll-to": (el) => scrollToId(el.dataset.id || ""),
    "live-toggle": () => liveToggle(),
    "ls-toggle": (el) => {
      const life = el.closest(".p-life"); const paused = !(life?.classList.contains("p-paused"));
      life?.classList.toggle("p-paused", paused); el.setAttribute("aria-pressed", String(paused)); el.setAttribute("aria-label", paused ? S.ls_play : S.lv_pause); el.innerHTML = filmIcon(paused);
    },
    "try-ex": () => { if (!ta) return; ta.value = exampleText(o.locale); ta.dispatchEvent(new Event("input")); ta.focus({ preventScroll: true }); },
    "try-st": (el) => { if (!ta) return; const st = (STARTERS[o.locale] ?? STARTERS[LK(o.locale)])[+(el.dataset.i || 0)] ?? ""; ta.value = (ta.value.trim() ? ta.value.trim() + " " : "") + st; ta.dispatchEvent(new Event("input")); ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); },
    "try-clear": () => { if (!ta) return; ta.value = ""; ta.dispatchEvent(new Event("input")); ta.focus({ preventScroll: true }); },
    "try-save": () => o.navigate("/signup"),
    "lang-pick": (el) => (el.getAttribute("aria-expanded") === "true" ? closePop() : openPop(el)),
    lang: (el) => { closePop(); const l = el.dataset.l as HomeLocale; if (l && l !== o.locale) void o.setLocale(l); },
    "theme-toggle": () => o.toggleTheme(),
    theme: (el) => { const v = el.dataset.v as "light" | "dark" | "system"; o.setTheme(v); $$("[data-act=theme]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); },
    "pub-menu": () => toggleMenu(),
    listen: (el) => {
      if (!("speechSynthesis" in window)) return;
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); el.classList.remove("p-on"); return; }
      const u = new SpeechSynthesisUtterance([S.h4_h1, S.h4_sub, S.pb_h, S.en_h].join(". "));
      u.lang = { en: "en-US", fr: "fr-FR", ar: "ar-MA" }[LK(o.locale)]; u.rate = 0.98;
      u.onend = () => el.classList.remove("p-on"); el.classList.add("p-on"); speechSynthesis.speak(u);
    },
    lite: () => { prefs = { ...prefs, lite: !prefs.lite }; writePrefs(prefs); applyPrefs(); o.toast(prefs.lite ? S.ax_lite_on : S.ax_lite_off); if (prefs.lite) { LIVE.tok++; liveFinal(); $$(REVEAL).forEach((el) => el.classList.add("p-in")); } },
    fsize: (el) => { prefs = { ...prefs, fs: +(el.dataset.v || 1) }; writePrefs(prefs); applyPrefs(); $$("[data-act=fsize]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); },
    pilot: () => o.navigate("/help"),
  };
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element).closest?.<HTMLElement>("[data-act]");
    if (!el || !root.contains(el)) return;
    const fn = ACT[el.dataset.act || ""];
    if (fn) { e.preventDefault(); fn(el); }
  };
  root.addEventListener("click", onClick);
  cleanups.push(() => root.removeEventListener("click", onClick));
  if ("speechSynthesis" in window === false) $$("[data-act=listen]").forEach((b) => (b.hidden = true));

  return () => { LIVE.tok++; timers.forEach(clearTimeout); timers.clear(); cleanups.forEach((f) => f()); if ("speechSynthesis" in window) speechSynthesis.cancel(); };
}
