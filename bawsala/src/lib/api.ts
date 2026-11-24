"use client";
/** Typed fetch helper for the v1 API. Errors carry the server's error code for translated messages. */
export class ApiClientError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) { super(message); }
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/v1${path}`, {
      method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
      headers: init.body !== undefined && !(init.body instanceof FormData) ? { "content-type": "application/json" } : undefined,
      body: init.body === undefined ? undefined : init.body instanceof FormData ? init.body : JSON.stringify(init.body),
      signal: init.signal,
      credentials: "same-origin",
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiClientError(0, "network", "network");
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = data?.error ?? {};
    throw new ApiClientError(res.status, err.code ?? "internal", err.message ?? "error", err.details);
  }
  return data as T;
}

export function track(name: "page.viewed" | "opportunity.apply_clicked" | "client.error", props?: Record<string, string | number | boolean>) {
  try {
    const body = JSON.stringify({ name, props });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/v1/events", new Blob([body], { type: "application/json" }));
    else fetch("/api/v1/events", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  } catch { /* analytics must never break the app */ }
}
