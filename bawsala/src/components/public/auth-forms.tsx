"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useI18n } from "../i18n";
import { api, ApiClientError } from "@/lib/api";
import { Button, Field, useErrorMessage } from "../ui";

function safeNext(n: string | null) {
  return n && n.startsWith("/") && !n.startsWith("//") ? n : null;
}

export function SignInForm() {
  const { t } = useI18n();
  const err = useErrorMessage();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError(null);
    try {
      const r = await api<{ redirect: string }>("/auth/signin", { body: { email: f.get("email"), password: f.get("password") } });
      router.replace(next ?? r.redirect); router.refresh();
    } catch (x) { setError(err(x)); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="stack" noValidate>
      <Field id="email" label={t("auth.email")}><input id="email" name="email" type="email" autoComplete="email" required className="input" dir="ltr" /></Field>
      <Field id="password" label={t("auth.password")}><input id="password" name="password" type="password" autoComplete="current-password" required className="input" dir="ltr" /></Field>
      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      <Button type="submit" loading={busy} size="lg">{t("auth.signin")}</Button>
      <div className="row-between small"><Link href="/forgot">{t("auth.forgot")}</Link><span>{t("auth.no_account")} <Link href="/signup">{t("auth.signup")}</Link></span></div>
    </form>
  );
}

export function SignUpForm() {
  const { t, locale } = useI18n();
  const err = useErrorMessage();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { name: String(f.get("name") ?? ""), email: String(f.get("email") ?? ""), password: String(f.get("password") ?? ""), locale, joinCode: String(f.get("joinCode") ?? "") || null, consent: f.get("consent") === "on" };
    const fe: Record<string, string> = {};
    if (!body.name.trim()) fe.name = t("auth.err_name");
    if (!/^\S+@\S+\.\S+$/.test(body.email)) fe.email = t("auth.err_email");
    if (body.password.length < 10) fe.password = t("auth.err_password_short");
    if (!body.consent) fe.consent = t("auth.err_consent");
    setFieldErr(fe);
    if (Object.keys(fe).length) return;
    setBusy(true); setError(null);
    try {
      const r = await api<{ redirect: string }>("/auth/signup", { body: { ...body, consent: true } });
      router.replace(r.redirect); router.refresh();
    } catch (x) {
      if (x instanceof ApiClientError && x.message === "join_code_invalid") setFieldErr({ joinCode: t("auth.err_join_code") });
      else setError(err(x));
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="stack" noValidate>
      <Field id="name" label={t("auth.name")} error={fieldErr.name}><input id="name" name="name" autoComplete="name" required className="input" aria-invalid={!!fieldErr.name} /></Field>
      <Field id="email" label={t("auth.email")} error={fieldErr.email}><input id="email" name="email" type="email" autoComplete="email" required className="input" dir="ltr" aria-invalid={!!fieldErr.email} /></Field>
      <Field id="password" label={t("auth.password")} hint={t("auth.password_hint")} error={fieldErr.password}><input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required className="input" dir="ltr" aria-invalid={!!fieldErr.password} /></Field>
      <Field id="joinCode" label={<>{t("auth.join_code")} <span className="muted">({t("common.optional")})</span></>} hint={t("auth.join_code_hint")} error={fieldErr.joinCode}><input id="joinCode" name="joinCode" className="input" dir="ltr" autoCapitalize="characters" maxLength={20} /></Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <div className="field">
        <label className="check"><input type="checkbox" name="consent" /><span>{t("auth.consent")} <Link href="/terms" target="_blank">{t("landing.footer_terms")}</Link> · <Link href="/privacy" target="_blank">{t("landing.footer_privacy")}</Link></span></label>
        {fieldErr.consent ? <span className="error" role="alert">{fieldErr.consent}</span> : null}
      </div>
      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      <Button type="submit" loading={busy} size="lg">{t("auth.signup")}</Button>
      <p className="small">{t("auth.have_account")} <Link href="/signin">{t("auth.signin")}</Link></p>
    </form>
  );
}

export function ForgotForm() {
  const { t } = useI18n();
  const err = useErrorMessage();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null);
    try { await api("/auth/forgot", { body: { email: new FormData(e.currentTarget).get("email") } }); setSent(true); }
    catch (x) { setError(err(x)); } finally { setBusy(false); }
  }
  if (sent) return <p className="alert alert-ok" role="status">{t("auth.forgot_sent")}</p>;
  return (
    <form onSubmit={submit} className="stack">
      <Field id="email" label={t("auth.email")}><input id="email" name="email" type="email" autoComplete="email" required className="input" dir="ltr" /></Field>
      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      <Button type="submit" loading={busy}>{t("auth.forgot_send")}</Button>
    </form>
  );
}

export function ResetForm() {
  const { t } = useI18n();
  const err = useErrorMessage();
  const token = useSearchParams().get("token") ?? "";
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (password.length < 10) { setError(t("auth.err_password_short")); return; }
    setBusy(true); setError(null);
    try { await api("/auth/reset", { body: { token, password } }); setDone(true); }
    catch (x) { setError(err(x)); } finally { setBusy(false); }
  }
  if (!token) return <p className="alert alert-err">{t("auth.reset_invalid")}</p>;
  if (done) return <div className="stack"><p className="alert alert-ok">{t("auth.reset_done")}</p><Link className="btn btn-primary" href="/signin">{t("auth.signin")}</Link></div>;
  return (
    <form onSubmit={submit} className="stack">
      <Field id="password" label={t("auth.password_new")} hint={t("auth.password_hint")}><input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required className="input" dir="ltr" /></Field>
      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      <Button type="submit" loading={busy}>{t("common.save")}</Button>
    </form>
  );
}
