export type ErrorCode =
  | "bad_request" | "validation" | "unauthorized" | "forbidden" | "not_found" | "conflict"
  | "rate_limited" | "ai_unavailable" | "ai_quota" | "internal";

const STATUS: Record<ErrorCode, number> = {
  bad_request: 400, validation: 422, unauthorized: 401, forbidden: 403, not_found: 404, conflict: 409,
  rate_limited: 429, ai_unavailable: 503, ai_quota: 429, internal: 500,
};

export class ApiError extends Error {
  constructor(public code: ErrorCode, message?: string, public details?: unknown, public retryAfter?: number) {
    super(message ?? code);
  }
  get status() { return STATUS[this.code]; }
}
