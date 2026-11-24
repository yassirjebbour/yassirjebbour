import "server-only";
import { asSystem } from "./db";
import { log } from "./log";

/**
 * First-party product analytics. No third-party tracker, no IP or user-agent stored, no free text.
 * Event names are an allowlist (see docs/ANALYTICS.md for the data dictionary).
 */
export const EVENT_NAMES = [
  "account.signed_up", "account.signed_in", "account.deleted",
  "onboarding.completed", "experience.added", "analysis.run", "suggestion.accepted", "suggestion.rejected",
  "skill.declared", "evidence.added", "target.set", "plan.created", "task.completed",
  "chat.message", "tool.executed", "opportunity.viewed", "opportunity.saved", "opportunity.apply_clicked",
  "cv.uploaded", "feedback.sent", "try.used", "search.used", "page.viewed", "client.error",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

const PROPS_ALLOWED = /^[a-z_]{1,30}$/;

export function sanitizeProps(props: Record<string, unknown> = {}) {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props).slice(0, 12)) {
    if (!PROPS_ALLOWED.test(k)) continue;
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
    else if (typeof v === "string") out[k] = v.slice(0, 80);
  }
  return out;
}

export function track(userId: string | null, name: EventName, props?: Record<string, unknown>) {
  asSystem((tx) => tx.query(`INSERT INTO events (user_id, name, props) VALUES ($1,$2,$3)`, [userId, name, JSON.stringify(sanitizeProps(props))]))
    .catch((e) => log.warn("event.write_failed", { name, err: e }));
}
