import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";
import { SESSION_COOKIE, validateSession, sessionCookieOptions, type Role, type SessionUser } from "../auth/session";
import { ApiError } from "./errors";
import { log } from "../log";

export { ApiError };

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, { ...init, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...(init?.headers ?? {}) } });
}

/** CSRF defence for cookie-authenticated mutations: the Origin must be our own host. */
export function assertSameOrigin(req: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const origin = req.headers.get("origin");
  if (!origin) throw new ApiError("forbidden", "Missing origin");
  let originHost: string;
  try { originHost = new URL(origin).host; } catch { throw new ApiError("forbidden", "Bad origin"); }
  // The allowed host comes from configuration (APP_URL) or the Host header — never from X-Forwarded-Host,
  // which any non-browser client can set.
  const allowed = new Set([req.headers.get("host"), (() => { try { return new URL(process.env.APP_URL ?? "").host; } catch { return null; } })()].filter(Boolean));
  if (!allowed.has(originHost)) throw new ApiError("forbidden", "Cross-origin request rejected");
}

/** Reads the request body with a hard byte limit enforced while streaming (Content-Length can be absent or false). */
export async function readLimited(req: Request, maxBytes: number): Promise<Uint8Array> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw new ApiError("bad_request", "Body too large");
  if (!req.body) return new Uint8Array();
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) { await reader.cancel().catch(() => {}); throw new ApiError("bad_request", "Body too large"); }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.byteLength; }
  return out;
}

export async function readJson<S extends z.ZodType>(req: Request, schema: S, maxBytes = 256 * 1024): Promise<z.infer<S>> {
  const raw = await readLimited(req, maxBytes);
  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(raw) || "null"); } catch { throw new ApiError("bad_request", "Invalid JSON"); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("validation", "Invalid input", parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })));
  }
  return parsed.data;
}

/**
 * Client IP for rate limiting. Only the address appended by OUR reverse proxy is trusted:
 * with TRUSTED_PROXY_HOPS=1 (default; one proxy such as Vercel/Fly/Render/nginx) that is the last
 * X-Forwarded-For entry. Entries a client writes itself come earlier in the list and are ignored.
 */
export function clientIp(req: Request) {
  const hops = Math.max(0, Number(process.env.TRUSTED_PROXY_HOPS ?? 1));
  const xff = (req.headers.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (hops > 0 && xff.length >= hops) return xff[xff.length - hops];
  return "direct";
}

export async function apiUser(roles?: Role[]): Promise<SessionUser> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const res = await validateSession(token);
  if (!res) throw new ApiError("unauthorized", "Sign in required");
  if (res.renewedUntil && token) store.set(SESSION_COOKIE, token, sessionCookieOptions(res.renewedUntil));
  if (roles && !roles.includes(res.user.role)) throw new ApiError("forbidden", "Not allowed");
  return res.user;
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

/** Wraps a route handler: origin check, typed errors → JSON, unexpected errors logged, never leaked. */
export function route<C = unknown>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    const started = Date.now();
    const requestId = crypto.randomUUID();
    const withId = (res: Response) => { try { res.headers.set("X-Request-Id", requestId); } catch { /* immutable */ } return res; };
    try {
      assertSameOrigin(req);
      return withId(await fn(req, ctx));
    } catch (e) {
      if (e instanceof z.ZodError) {
        return withId(json({ error: { code: "validation", message: "Invalid input", details: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) } }, { status: 422 }));
      }
      if (e instanceof ApiError) {
        if (e.status >= 500) log.warn("api.error", { requestId, code: e.code, path: new URL(req.url).pathname });
        return withId(json(
          { error: { code: e.code, message: e.message, details: e.details } },
          { status: e.status, headers: e.retryAfter ? { "Retry-After": String(e.retryAfter) } : undefined },
        ));
      }
      log.error("api.unhandled", { requestId, path: new URL(req.url).pathname, method: req.method, ms: Date.now() - started, err: e });
      return withId(json({ error: { code: "internal", message: "Something went wrong", ref: requestId } }, { status: 500 }));
    }
  };
}
