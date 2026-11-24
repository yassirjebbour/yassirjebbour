"use client";
/**
 * Motion runtime: scroll reveals and pointer glow. Progressive enhancement only:
 * content is fully visible without JavaScript, and nothing moves when the user asks
 * for reduced motion. Page and shared-element transitions use React <ViewTransition>.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionRuntime() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    const vh = () => window.innerHeight || document.documentElement.clientHeight;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const arm = (el: Element) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      // Already on screen when we arm: show without animating (it was already visible).
      if (r.top < vh() && r.bottom > 0) { el.classList.add("in", "no-anim"); return; }
      io.observe(el);
    };
    document.querySelectorAll("[data-reveal]").forEach(arm);
    root.classList.add("io-ok");
    const mo = new MutationObserver((records) => {
      for (const rec of records) rec.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches("[data-reveal]")) arm(n);
        n.querySelectorAll?.("[data-reveal]").forEach(arm);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Pointer-following glow on .glow surfaces (fine pointers only).
    let raf = 0;
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      const el = (ev.target as Element | null)?.closest?.(".glow") as HTMLElement | null;
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const b = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${ev.clientX - b.left}px`);
        el.style.setProperty("--my", `${ev.clientY - b.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => { io.disconnect(); mo.disconnect(); document.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); root.classList.remove("io-ok"); };
  }, []);
  return null;
}

/** 3D tilt + light sheen that follows the pointer. Static for touch and reduced motion. */
export function Tilt({ children, className, max = 7, style }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const b = el.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
        el.style.setProperty("--rx", `${((.5 - py) * max).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - .5) * max).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        el.dataset.tilting = "";
      });
    };
    const leave = () => { cancelAnimationFrame(raf); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); delete el.dataset.tilting; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
  }, [max]);
  return <div ref={ref} className={`tilt ${className ?? ""}`} style={style}>{children}</div>;
}

/** Celebration burst; re-plays whenever `fire` changes to a new truthy value. */
export function Burst({ fire }: { fire: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!fire || prefersReducedMotion()) return;
    // Mount the particles for one animation cycle after the triggering action.
    const start = setTimeout(() => setShown(fire), 0);
    const stop = setTimeout(() => setShown(0), 900);
    return () => { clearTimeout(start); clearTimeout(stop); };
  }, [fire]);
  if (!shown) return null;
  const colors = ["var(--gold)", "var(--g)", "#E9C98F", "var(--g300)"];
  return (
    <span className="burst" aria-hidden="true" key={shown}>
      {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--a": `${i * 30 + (i % 2) * 9}deg`, "--d": `${26 + (i % 3) * 9}px`, "--c": colors[i % 4] } as CSSProperties} />)}
    </span>
  );
}
