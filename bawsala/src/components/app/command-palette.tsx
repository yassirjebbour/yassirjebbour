"use client";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { toggleTheme } from "../language-switcher";
import { IconHome, IconPassport, IconCompass, IconPath, IconChat, IconUser, IconBell, IconSettings, IconHelp, IconSearch, IconPlus, IconFile, IconSpark, IconGlobe } from "../icons";

type Cmd = { id: string; group: "pages" | "actions"; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; run: () => void; keywords?: string };

/** Folds case and Arabic/Latin diacritics so "telecharger" finds "Télécharger" and hamza forms match. */
function fold(s: string) {
  return s.normalize("NFKD").replace(/\p{M}/gu, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase();
}

export function CommandPalette() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [mac, setMac] = useState(false);
  const listId = useId();

  useEffect(() => {
    // Platform hint is client-only; the first render matches the server ("Ctrl K").
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    if (isMac) queueMicrotask(() => setMac(true));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); requestAnimationFrame(() => input.current?.focus()); }
    if (!open && d.open) d.close();
  }, [open]);

  const go = (href: string) => () => { setOpen(false); router.push(href); };
  const cmds: Cmd[] = useMemo(() => [
    { id: "home", group: "pages", label: t("nav.home"), icon: IconHome, run: go("/app") },
    { id: "passport", group: "pages", label: t("nav.passport"), icon: IconPassport, run: go("/app/passport") },
    { id: "opps", group: "pages", label: t("nav.opportunities"), icon: IconCompass, run: go("/app/opportunities") },
    { id: "plan", group: "pages", label: t("nav.plan"), icon: IconPath, run: go("/app/plan") },
    { id: "assistant", group: "pages", label: t("nav.assistant"), icon: IconChat, run: go("/app/assistant") },
    { id: "profile", group: "pages", label: t("nav.profile"), icon: IconUser, run: go("/app/profile") },
    { id: "notifs", group: "pages", label: t("nav.notifications"), icon: IconBell, run: go("/app/notifications") },
    { id: "settings", group: "pages", label: t("nav.settings"), icon: IconSettings, run: go("/app/settings") },
    { id: "help", group: "pages", label: t("nav.help"), icon: IconHelp, run: go("/help") },
    { id: "add-exp", group: "actions", label: t("shell.add_experience"), icon: IconPlus, run: go("/app/profile#experiences") },
    { id: "new-chat", group: "actions", label: t("shell.new_chat"), icon: IconSpark, run: go("/app/assistant") },
    { id: "print", group: "actions", label: t("shell.print_passport"), icon: IconFile, run: go("/app/passport/print") },
    { id: "export", group: "actions", label: t("shell.export"), icon: IconFile, run: () => { setOpen(false); window.location.assign("/api/v1/me/export"); } },
    { id: "theme", group: "actions", label: t("shell.theme"), icon: IconSettings, run: () => { toggleTheme(); setOpen(false); } },
    ...LOCALES.filter((l) => l !== locale).map((l: Locale): Cmd => ({
      id: `lang-${l}`, group: "actions", label: t("shell.language", { name: LOCALE_META[l].label }), icon: IconGlobe, keywords: l,
      run: () => { setOpen(false); api("/locale", { body: { locale: l } }).then(() => router.refresh()).catch(() => {}); },
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps -- labels change only with the locale
  ], [t, locale]);

  const needle = fold(q.trim());
  const shown = needle ? cmds.filter((c) => fold(`${c.label} ${c.keywords ?? ""}`).includes(needle)) : cmds;
  const ask: Cmd | null = q.trim().length >= 2 ? { id: "ask", group: "actions", label: t("shell.ask", { q: q.trim() }), icon: IconChat, run: go(`/app/assistant?q=${encodeURIComponent(q.trim())}`) } : null;
  const items = ask ? [...shown, ask] : shown;
  const cur = Math.min(sel, Math.max(0, items.length - 1));

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((cur + 1) % Math.max(1, items.length)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((cur - 1 + items.length) % Math.max(1, items.length)); }
    else if (e.key === "Enter") { e.preventDefault(); items[cur]?.run(); }
  }
  useEffect(() => { document.getElementById(`${listId}-${cur}`)?.scrollIntoView({ block: "nearest" }); }, [cur, listId]);

  let lastGroup = "";
  return (
    <>
      <button type="button" className="cmdk-trigger" onClick={() => setOpen(true)} aria-label={t("shell.search_label")} aria-haspopup="dialog">
        <IconSearch /><span>{t("shell.search")}</span><kbd className="kbd">{mac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      <dialog ref={dlg} className="cmdk" aria-label={t("shell.search_label")} onClose={() => { setOpen(false); setQ(""); setSel(0); }} onClick={(e) => { if (e.target === dlg.current) setOpen(false); }}>
        {open ? (
          <div className="cmdk-box">
            <div className="cmdk-input">
              <IconSearch />
              <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKeyDown} placeholder={t("shell.search")} aria-label={t("shell.search_label")}
                role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={items.length ? `${listId}-${cur}` : undefined} aria-autocomplete="list" autoComplete="off" spellCheck={false} />
              <kbd className="kbd">Esc</kbd>
            </div>
            <ul className="cmdk-list" id={listId} role="listbox" aria-label={t("shell.search_label")}>
              {items.length === 0 ? <li className="cmdk-empty" role="presentation">{t("shell.no_results")}</li> : items.map((c, i) => {
                const head = c.group !== lastGroup ? (lastGroup = c.group) : null;
                return (
                  <li key={c.id} role="presentation">
                    {head ? <div className="cmdk-group" role="presentation">{t(head === "pages" ? "shell.pages" : "shell.actions")}</div> : null}
                    <div id={`${listId}-${i}`} role="option" aria-selected={i === cur} className="cmdk-item" onMouseMove={() => i !== cur && setSel(i)} onClick={() => c.run()}>
                      <span className="icon-tile" aria-hidden="true"><c.icon /></span><span className="bidi">{c.label}</span><span className="ret" aria-hidden="true">↵</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="cmdk-foot" aria-hidden="true">
              <span><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd>{t("shell.hint_move")}</span>
              <span><kbd className="kbd">↵</kbd>{t("shell.hint_open")}</span>
              <span><kbd className="kbd">Esc</kbd>{t("shell.hint_close")}</span>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
