"use client";
import { useState } from "react";
import { useI18n } from "./i18n";
import { api } from "@/lib/api";
import { Button, Field, useErrorMessage } from "./ui";

export function FeedbackForm() {
  const { t } = useI18n();
  const err = useErrorMessage();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError(null);
    try { await api("/feedback", { body: { kind: f.get("kind"), message: f.get("message"), page: location.pathname } }); setSent(true); }
    catch (x) { setError(err(x)); } finally { setBusy(false); }
  }
  if (sent) return <p className="alert alert-ok" role="status">{t("help.sent")}</p>;
  return (
    <form onSubmit={submit} className="stack">
      <Field id="kind" label={t("help.kind")}>
        <select id="kind" name="kind" className="select" defaultValue="question">
          <option value="bug">{t("help.kind_bug")}</option>
          <option value="idea">{t("help.kind_idea")}</option>
          <option value="question">{t("help.kind_question")}</option>
          <option value="privacy_request">{t("help.kind_privacy")}</option>
        </select>
      </Field>
      <Field id="message" label={t("help.message")}><textarea id="message" name="message" className="textarea" required minLength={3} maxLength={4000} /></Field>
      {error ? <p className="alert alert-err" role="alert">{error}</p> : null}
      <div><Button type="submit" loading={busy}>{t("help.send")}</Button></div>
    </form>
  );
}
