import "server-only";
import { asSystem } from "../db";
import { hashToken, newToken } from "./tokens";

export const SESSION_COOKIE = "bawsala_session";
export const SESSION_DAYS = 30;
const RENEW_WHEN_DAYS_LEFT = 15;

export type Role = "student" | "institution_admin" | "platform_admin";
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  locale: "ar" | "ary" | "fr" | "en" | "zgh";
  role: Role;
  institutionId: string | null;
}

export async function createSession(userId: string, meta: { userAgent?: string | null; ip?: string | null }) {
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await asSystem((tx) =>
    tx.query(`INSERT INTO sessions (id, user_id, expires_at, user_agent, ip) VALUES ($1,$2,$3,$4,$5)`, [
      hashToken(token), userId, expires, meta.userAgent?.slice(0, 300) ?? null, meta.ip?.slice(0, 64) ?? null,
    ]),
  );
  return { token, expires };
}

/** Validates a session token. Returns the user, and a new expiry if the session was renewed. */
export async function validateSession(token: string | undefined | null): Promise<{ user: SessionUser; renewedUntil: Date | null } | null> {
  if (!token || token.length < 20 || token.length > 200) return null;
  const id = hashToken(token);
  return asSystem(async (tx) => {
    const row = await tx.one<{
      user_id: string; expires_at: Date; email: string; name: string; locale: SessionUser["locale"]; role: Role; institution_id: string | null;
    }>(
      `SELECT s.user_id, s.expires_at, u.email, u.name, u.locale, u.role, u.institution_id
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.id = $1`,
      [id],
    );
    if (!row) return null;
    if (row.expires_at.getTime() <= Date.now()) {
      await tx.query(`DELETE FROM sessions WHERE id = $1`, [id]);
      return null;
    }
    let renewedUntil: Date | null = null;
    if (row.expires_at.getTime() - Date.now() < RENEW_WHEN_DAYS_LEFT * 864e5) {
      renewedUntil = new Date(Date.now() + SESSION_DAYS * 864e5);
      await tx.query(`UPDATE sessions SET expires_at = $2, last_seen_at = now() WHERE id = $1`, [id, renewedUntil]);
    }
    await tx.query(`UPDATE users SET last_active_at = now() WHERE id = $1 AND (last_active_at IS NULL OR last_active_at < now() - interval '10 minutes')`, [row.user_id]);
    return {
      user: { id: row.user_id, email: row.email, name: row.name, locale: row.locale, role: row.role, institutionId: row.institution_id },
      renewedUntil,
    };
  });
}

export async function deleteSession(token: string) {
  await asSystem((tx) => tx.query(`DELETE FROM sessions WHERE id = $1`, [hashToken(token)]));
}

export async function deleteAllSessions(userId: string) {
  await asSystem((tx) => tx.query(`DELETE FROM sessions WHERE user_id = $1`, [userId]));
}

export function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}
