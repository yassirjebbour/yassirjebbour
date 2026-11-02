import "server-only";
import { asSystem } from "./db";
import { ApiError } from "./http/errors";

/**
 * Fixed-window rate limiter stored in Postgres, so it holds across server instances.
 * Throws ApiError("rate_limited") with Retry-After when the limit is exceeded.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000);
  const row = await asSystem((tx) =>
    tx.one<{ count: number }>(
      `INSERT INTO rate_limits (key, window_start, count) VALUES ($1, $2, 1)
       ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limits.count + 1
       RETURNING count`,
      [key, windowStart],
    ),
  );
  if ((row?.count ?? 0) > limit) {
    const retryAfter = Math.ceil((windowStart.getTime() + windowSeconds * 1000 - now) / 1000);
    throw new ApiError("rate_limited", "Too many requests", undefined, retryAfter);
  }
}

/** Reads a counter without incrementing it; throws rate_limited when it is already over the limit. */
export async function rateLimitPeek(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000);
  const row = await asSystem((tx) => tx.one<{ count: number }>(`SELECT count FROM rate_limits WHERE key = $1 AND window_start = $2`, [key, windowStart]));
  if ((row?.count ?? 0) >= limit) throw new ApiError("rate_limited", "Too many requests", undefined, Math.ceil((windowStart.getTime() + windowSeconds * 1000 - now) / 1000));
}

/** Current count of a fixed-window counter (for display, e.g. AI messages used today). */
export async function rateLimitCount(key: string, windowSeconds: number) {
  const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000);
  const row = await asSystem((tx) => tx.one<{ count: number }>(`SELECT count FROM rate_limits WHERE key = $1 AND window_start = $2`, [key, windowStart]));
  return row?.count ?? 0;
}

/** Housekeeping, called opportunistically (e.g. on sign-in). */
export async function pruneRateLimits() {
  await asSystem((tx) => tx.query(`DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'`));
  await asSystem((tx) => tx.query(`DELETE FROM sessions WHERE expires_at < now()`));
  await asSystem((tx) => tx.query(`DELETE FROM auth_tokens WHERE expires_at < now() - interval '1 day' OR used_at < now() - interval '1 day'`));
  // Delivered/abandoned emails (reset emails contain links) are not kept beyond 30 days.
  await asSystem((tx) => tx.query(`DELETE FROM email_outbox WHERE status IN ('sent','skipped','failed') AND created_at < now() - interval '30 days'`));
}
