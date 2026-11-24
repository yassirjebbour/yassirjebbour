/**
 * Structured JSON logging to stdout (collected by the host: Vercel, Fly, Render, Docker…).
 * Never log passwords, tokens, or the content students write; log ids and sizes instead.
 * A hosted error tracker is not wired yet (see docs/OBSERVABILITY.md); errors carry a requestId
 * that is also returned to the client in the X-Request-Id header and the error body (`ref`).
 */
type Level = "debug" | "info" | "warn" | "error";

function serializeErr(e: unknown) {
  if (e instanceof Error) return { name: e.name, message: e.message, stack: e.stack?.split("\n").slice(0, 8).join("\n") };
  return e;
}

function write(level: Level, event: string, data?: Record<string, unknown>) {
  if (level === "debug" && process.env.NODE_ENV === "production") return;
  const rec: Record<string, unknown> = { t: new Date().toISOString(), level, event };
  if (data) for (const [k, v] of Object.entries(data)) rec[k] = k === "err" ? serializeErr(v) : v;
  const line = JSON.stringify(rec);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  debug: (e: string, d?: Record<string, unknown>) => write("debug", e, d),
  info: (e: string, d?: Record<string, unknown>) => write("info", e, d),
  warn: (e: string, d?: Record<string, unknown>) => write("warn", e, d),
  error: (e: string, d?: Record<string, unknown>) => write("error", e, d),
};
