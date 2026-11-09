"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api } from "@/lib/api";
import { Button, Field, Modal, useErrorMessage, useToast } from "../ui";
import { LanguageSwitcher, ThemeToggle } from "../language-switcher";
import { SignOutButton } from "./nav";

export function SettingsView({ name, email, role, institution, prefs, aiUsed, aiMax }: { name: string; email: string; role: string; institution: string | null; prefs: { in_app: boolean; email_reminders: boolean; email_security: boolean }; aiUsed: number; aiMax: number }) {
  const { t } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const err = useErrorMessage();
  const [busy, setBusy] = useState<string | null>(null);
  const [del, setDel] = useState(false);
  const [p, setP] = useState(prefs);

  async function run(key: string, fn: () => Promise<unknown>, ok?: string) {
    setBusy(key);
    try { await fn(); if (ok) toast(ok); router.refresh(); } catch (x) { toast(err(x)); } finally { setBusy(null); }
  }
  return (
    <div className="stack-lg">
      <section className="panel stack" aria-labelledby="acc-h">
        <h2 id="acc-h">{t("settings.account")}</h2>
        <p className="small muted" dir="ltr" style={{ textAlign: "start" }}>{email}</p>
        <form className="row" style={{ alignItems: "flex-end" }} onSubmit={(e) => { e.preventDefault(); const v = String(new FormData(e.currentTarget).get("name") ?? ""); run("name", () => api("/me", { method: "PATCH", body: { name: v } }), t("common.saved")); }}>
          <div style={{ flex: 1, minWidth: 200 }}><Field id="name" label={t("settings.name")}><input id="name" name="name" className="input" defaultValue={name} required maxLength={120} /></Field></div>
          <Button type="submit" variant="secondary" loading={busy === "name"}>{t("common.save")}</Button>
        </form>
        <div className="field"><span className="label">{t("settings.language")}</span><div className="row"><LanguageSwitcher /><ThemeToggle /></div></div>
        <p className="small muted">{t("settings.ai_usage", { n: aiUsed, max: aiMax })}</p>
      </section>

      <section className="panel stack" aria-labelledby="pw-h">
        <h2 id="pw-h">{t("settings.password")}</h2>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const form = e.currentTarget; run("pw", async () => { await api("/me/password", { body: { current: f.get("current"), next: f.get("next") } }); form.reset(); }, t("settings.password_changed")); }}>
          <div className="grid-2">
            <Field id="current" label={t("settings.password_current")}><input id="current" name="current" type="password" autoComplete="current-password" required className="input" dir="ltr" /></Field>
            <Field id="next" label={t("auth.password_new")} hint={t("auth.password_hint")}><input id="next" name="next" type="password" autoComplete="new-password" minLength={10} required className="input" dir="ltr" /></Field>
          </div>
          <div className="row"><Button type="submit" variant="secondary" loading={busy === "pw"}>{t("common.save")}</Button>
            <Button type="button" variant="ghost" loading={busy === "all"} onClick={() => run("all", () => api("/auth/signout-all", { body: {} }), t("settings.sessions_done"))}>{t("settings.sessions")}</Button></div>
        </form>
      </section>

      {role === "student" ? (
        <section className="panel stack" aria-labelledby="inst-h">
          <h2 id="inst-h">{t("settings.institution")}</h2>
          {institution ? (
            <div className="row-between"><span>{t("settings.institution_linked", { name: institution })}</span><Button size="sm" variant="ghost" onClick={() => run("leave", () => api("/me/institution", { method: "DELETE" }))}>{t("common.remove")}</Button></div>
          ) : (
            <form className="row" style={{ alignItems: "flex-end" }} onSubmit={(e) => { e.preventDefault(); const code = String(new FormData(e.currentTarget).get("code") ?? ""); run("join", () => api("/me/institution", { body: { joinCode: code } })); }}>
              <div style={{ flex: 1, minWidth: 200 }}><Field id="code" label={t("settings.institution_join")} hint={t("settings.institution_none")}><input id="code" name="code" className="input" dir="ltr" required maxLength={20} /></Field></div>
              <Button type="submit" variant="secondary" loading={busy === "join"}>{t("common.confirm")}</Button>
            </form>
          )}
        </section>
      ) : null}

      <section className="panel stack" aria-labelledby="notif-h">
        <h2 id="notif-h">{t("settings.notif")}</h2>
        {([["in_app", "settings.notif_in_app"], ["email_reminders", "settings.notif_email_reminders"], ["email_security", "settings.notif_email_security"]] as const).map(([k, label]) => (
          <label key={k} className="check"><input type="checkbox" checked={p[k]} onChange={(e) => { const v = e.target.checked; setP({ ...p, [k]: v }); api("/me/notification-prefs", { method: "PATCH", body: { [k]: v } }).catch((x) => toast(err(x))); }} /><span>{t(label)}</span></label>
        ))}
      </section>

      <section className="panel stack" aria-labelledby="priv-h">
        <h2 id="priv-h">{t("settings.privacy")}</h2>
        <div className="row-between"><span className="small muted" style={{ maxWidth: 420 }}>{t("settings.export_d")}</span><a className="btn btn-secondary" href="/api/v1/me/export">{t("settings.export")}</a></div>
        <hr className="divider" />
        <div className="row-between"><span className="small muted" style={{ maxWidth: 420 }}>{t("settings.delete_d")}</span><Button variant="danger" onClick={() => setDel(true)}>{t("settings.delete")}</Button></div>
      </section>

      <div className="panel"><SignOutButton /></div>

      <Modal open={del} onClose={() => setDel(false)} title={t("settings.delete")}>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); const pw = String(new FormData(e.currentTarget).get("pw") ?? ""); run("del", async () => { await api("/me", { method: "DELETE", body: { password: pw } }); toast(t("settings.deleted")); router.replace("/"); router.refresh(); }); }}>
          <p className="alert alert-err">{t("settings.delete_d")}</p>
          <Field id="pw" label={t("settings.delete_confirm_pw")}><input id="pw" name="pw" type="password" required className="input" dir="ltr" autoComplete="current-password" /></Field>
          <div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setDel(false)}>{t("common.cancel")}</Button><Button type="submit" variant="danger" loading={busy === "del"}>{t("settings.delete")}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
