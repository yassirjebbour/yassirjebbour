"use client";
import { useEffect } from "react";
import { track } from "@/lib/api";

/** Front-end error monitoring: reports uncaught errors (message + page only, no user content). */
export function ClientErrorReporter() {
  useEffect(() => {
    let sent = 0;
    const report = (message: string) => {
      if (sent++ > 5) return;
      track("client.error", { message: message.slice(0, 120), page: location.pathname.slice(0, 80) });
    };
    const onError = (e: ErrorEvent) => report(e.message || "error");
    const onRejection = (e: PromiseRejectionEvent) => report(String((e.reason as Error)?.message ?? e.reason ?? "rejection"));
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => { window.removeEventListener("error", onError); window.removeEventListener("unhandledrejection", onRejection); };
  }, []);
  return null;
}
