"use client";
import { useEffect } from "react";
import { useI18n } from "@/components/i18n";
import { track } from "@/lib/api";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => { track("client.error", { message: (error.digest ?? error.message ?? "render").slice(0, 120), page: location.pathname.slice(0, 80) }); }, [error]);
  return (
    <main id="main" className="auth-wrap"><div className="stack" style={{ textAlign: "center", alignItems: "center" }}>
      <h1>{t("errors.error_title")}</h1><p className="muted">{t("errors.error_body")}</p>
      <button className="btn btn-primary" onClick={reset}>{t("common.retry")}</button>
    </div></main>
  );
}
