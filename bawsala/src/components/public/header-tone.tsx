"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** The public header sits on the night hero on the home page and turns to paper once scrolled. */
export function HeaderTone({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const home = path === "/";
  const [over, setOver] = useState(true);
  useEffect(() => {
    if (!home) return;
    const hero = document.querySelector<HTMLElement>(".hero-night");
    const check = () => setOver(!!hero && window.scrollY < hero.offsetHeight - 72);
    const raf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [home]);
  return <header className="pub-head" data-tone={home && over ? "night" : undefined}>{children}</header>;
}
