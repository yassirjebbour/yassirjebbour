"use client";
import { useState } from "react";
import { useI18n } from "../i18n";
import { IconCheck, IconCopy } from "../icons";

/** The institution's join code with a one-tap copy (students type it at sign-up). */
export function CopyCode({ code }: { code: string }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* clipboard blocked: the code stays selectable */ }
  }
  return (
    <span className="inst-code">
      <code dir="ltr">{code}</code>
      <button type="button" className={`btn btn-secondary btn-icon ${done ? "is-done" : ""}`} onClick={copy} aria-label={done ? t("common.copied") : t("flow.inst.copy_code")} title={t("flow.inst.copy_code")}>
        {done ? <IconCheck width={18} height={18} /> : <IconCopy width={18} height={18} />}
      </button>
    </span>
  );
}
