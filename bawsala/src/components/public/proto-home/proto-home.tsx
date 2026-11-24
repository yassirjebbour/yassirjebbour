"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toggleTheme } from "../../language-switcher";
import { useToast } from "../../ui";
import { mountProtoHome } from "./runtime";
import type { HomeLocale } from "./format";
import type { TryData } from "./try-out";

export interface ProtoHomeProps {
  locale: HomeLocale; header: string; headerMenu: string; main: string; footer: string; pop: string; tryData: TryData; startHref: string;
}

/** The original BAWSALA homepage (prototype markup + styles), driven by the ported prototype runtime. */
export function ProtoHome(p: ProtoHomeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    if (!ref.current) return;
    return mountProtoHome(ref.current, {
      locale: p.locale, headerHtml: p.header, headerMenuHtml: p.headerMenu, popHtml: p.pop, tryData: p.tryData, startHref: p.startHref,
      navigate: (href) => router.push(href),
      setLocale: async (l) => { await api("/locale", { body: { locale: l } }).catch(() => {}); router.refresh(); },
      toggleTheme,
      setTheme: (v) => {
        const el = document.documentElement;
        if (v === "system") { delete el.dataset.theme; try { localStorage.removeItem("bawsala.theme"); } catch { /* private mode */ } return; }
        el.dataset.theme = v; try { localStorage.setItem("bawsala.theme", v); } catch { /* private mode */ }
      },
      toast,
    });
  }, [p.locale, p.header, p.headerMenu, p.pop, p.tryData, p.startHref, router, toast]);
  return <div ref={ref} className="bwh" dangerouslySetInnerHTML={{ __html: `<div class="p-lp2 p-pub">${p.header}<main id="main">${p.main}</main>${p.footer}</div>` }} />;
}
