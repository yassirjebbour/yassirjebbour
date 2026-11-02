"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useI18n } from "./i18n";
import { ApiClientError } from "@/lib/api";

export function Button({ variant = "primary", size, loading, children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "lg"; loading?: boolean }) {
  return (
    <button {...rest} disabled={rest.disabled || loading} aria-busy={loading || undefined} className={`btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`}>
      {loading ? <span className="spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Field({ label, hint, error, id, children }: { label: React.ReactNode; hint?: React.ReactNode; error?: string | null; id: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error ? <span className="hint" id={`${id}-hint`}>{hint}</span> : null}
      {error ? <span className="error" id={`${id}-err`} role="alert">{error}</span> : null}
    </div>
  );
}

export function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function StateBadge({ status }: { status: "suggested" | "declared" | "inferred" | "evidenced" | "verified" }) {
  const { t } = useI18n();
  const label = { suggested: t("landing.state_suggested"), declared: t("passport.status_declared"), inferred: t("passport.status_inferred"), evidenced: t("passport.status_evidenced"), verified: t("passport.status_verified") }[status];
  return <span className={`badge b-${status}`}>{label}</span>;
}

export function DataBadge({ status }: { status: "demo" | "verified" | "unverified" }) {
  const { t } = useI18n();
  return status === "demo" ? <span className="badge b-demo">{t("common.demo")}</span> : status === "verified" ? <span className="badge b-verified-src">{t("common.verified_source")}</span> : <span className="badge b-unverified">{t("common.unverified_source")}</span>;
}

export function Meter({ value, max = 100, label, tone }: { value: number; max?: number; label: string; tone?: "gold" }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return <div className={`meter ${tone ?? ""}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}><span style={{ width: `${pct}%` }} /></div>;
}

export function Empty({ icon, children, action }: { icon?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="empty">{icon}<p>{children}</p>{action}</div>;
}

/** Native <dialog> modal: focus trapping and Escape handling come from the browser. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="modal" onClose={onClose} aria-labelledby="modal-title">
      <div className="modal-body">
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

// ---- toasts ----
const ToastCtx = createContext<(msg: string) => void>(() => {});
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Array<{ id: number; msg: string }>>([]);
  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x.slice(-2), { id, msg }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">{items.map((i) => <div key={i.id} className="toast">{i.msg}</div>)}</div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

/** Maps API error codes to translated, actionable messages. */
export function useErrorMessage() {
  const { t } = useI18n();
  return (e: unknown): string => {
    if (e instanceof ApiClientError) {
      const m: Record<string, string> = {
        invalid_credentials: t("auth.err_credentials"), email_taken: t("auth.err_email_taken"), join_code_invalid: t("auth.err_join_code"),
        reset_invalid: t("auth.reset_invalid"), signup_closed: t("auth.err_signup_closed"), daily_limit: t("assistant.error_quota"),
        assistant_disabled: t("assistant.error_disabled"), file_type: t("profile.cv_error"), file_size: t("profile.cv_error"),
        no_institution: t("passport.verify_need_institution"),
      };
      if (m[e.message]) return m[e.message];
      if (e.code === "rate_limited") return t("common.error_rate");
      if (e.code === "network") return t("common.error_network");
      if (e.code === "validation") return t("errors.validation");
      if (e.code === "forbidden") return t("errors.forbidden");
    }
    return t("common.error_generic");
  };
}
