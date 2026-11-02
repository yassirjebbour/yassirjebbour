import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";
import { SESSION_COOKIE, validateSession, sessionCookieOptions, type Role, type SessionUser } from "../auth/session";
import { ApiError } from "./errors";
import { log } from "../log";

export { ApiError };

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, { ...init, headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) } });
}

/** CSRF defence for cookie-authenticated mutations: the Origin must be our own host. */
export function assertSameOrigin(req: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) throw new ApiError("forbidden", "Missing origin");
  let originHost: string;
  try { originHost = new URL(origin).host; } catch { throw new ApiError("forbidden", "Bad origin"); }
  if (originHost !== host) throw new ApiError("forbidden", "Cross-origin request rejected");
}

export async function readJson<S extends z.ZodType>(req: Request, schema: S): Promise<z.infer<S>> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 256 * 1024) throw new ApiError("bad_request", "Body too large");
  let body: unknown;
  try { body = await req.json(); } catch { throw new ApiError("bad_request", "Invalid JSON"); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("validation", "Invalid input", parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })));
  }
  return parsed.data;
}

export function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "local").trim();
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
    try {
      assertSameOrigin(req);
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return json({ error: { code: "validation", message: "Invalid input", details: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) } }, { status: 422 });
      }
      if (e instanceof ApiError) {
        return json(
          { error: { code: e.code, message: e.message, details: e.details } },
          { status: e.status, headers: e.retryAfter ? { "Retry-After": String(e.retryAfter) } : undefined },
        );
      }
      const ref = Math.random().toString(36).slice(2, 10);
      log.error("api.unhandled", { ref, path: new URL(req.url).pathname, method: req.method, ms: Date.now() - started, err: e });
      return json({ error: { code: "internal", message: "Something went wrong", ref } }, { status: 500 });
    }
  };
}
