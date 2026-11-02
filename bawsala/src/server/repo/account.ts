import "server-only";
import { asSystem, asUser } from "../db";
import { hashPassword, verifyPassword, DUMMY_HASH } from "../auth/password";
import { ApiError } from "../http/errors";
import { env } from "../env";
import type { Locale } from "@/i18n/config";

export async function signUp(input: { email: string; password: string; name: string; locale: Locale; joinCode?: string | null }) {
  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);
  const isAdmin = env().ADMIN_EMAILS.includes(email);
  return asSystem(async (tx) => {
    const exists = await tx.one(`SELECT 1 FROM users WHERE email = $1`, [email]);
    if (exists) throw new ApiError("conflict", "email_taken");
    let institutionId: string | null = null;
    if (input.joinCode) {
      const inst = await tx.one<{ id: string }>(`SELECT id FROM institutions WHERE join_code = upper($1)`, [input.joinCode.trim()]);
      if (!inst) throw new ApiError("validation", "join_code_invalid");
      institutionId = inst.id;
    }
    const user = await tx.one<{ id: string }>(
      `INSERT INTO users (email, password_hash, name, locale, role, institution_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [email, passwordHash, input.name.trim(), input.locale, isAdmin ? "platform_admin" : "student", institutionId],
    );
    await tx.query(`INSERT INTO profiles (user_id) VALUES ($1)`, [user!.id]);
    await tx.query(`INSERT INTO audit_log (actor_id, action) VALUES ($1, 'account.created')`, [user!.id]);
    return user!.id;
  });
}

export async function checkCredentials(emailRaw: string, password: string): Promise<string | null> {
  const email = emailRaw.trim().toLowerCase();
  const row = await asSystem((tx) => tx.one<{ id: string; password_hash: string }>(`SELECT id, password_hash FROM users WHERE email = $1`, [email]));
  const ok = await verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
  return row && ok ? row.id : null;
}

export async function changePassword(userId: string, current: string, next: string) {
  const row = await asUser(userId, (tx) => tx.one<{ password_hash: string }>(`SELECT password_hash FROM users WHERE id = $1`, [userId]));
  if (!row || !(await verifyPassword(current, row.password_hash))) throw new ApiError("validation", "wrong_password");
  const hash = await hashPassword(next);
  await asUser(userId, (tx) => tx.query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [userId, hash]));
  await asSystem((tx) => tx.query(`INSERT INTO audit_log (actor_id, action) VALUES ($1, 'account.password_changed')`, [userId]));
}

export async function setLocale(userId: string, locale: Locale) {
  await asUser(userId, (tx) => tx.query(`UPDATE users SET locale = $2 WHERE id = $1`, [userId, locale]));
}

export async function updateName(userId: string, name: string) {
  await asUser(userId, (tx) => tx.query(`UPDATE users SET name = $2 WHERE id = $1`, [userId, name.trim()]));
}

/** Everything we hold about a student, as JSON (right of access / portability). */
export async function exportAccount(userId: string) {
  return asUser(userId, async (tx) => {
    const q = (sql: string) => tx.query(sql, [userId]);
    const [user] = await q(`SELECT id, email, name, locale, role, created_at, last_active_at FROM users WHERE id = $1`);
    return {
      exported_at: new Date().toISOString(),
      format: "bawsala-export/1",
      user,
      profile: (await q(`SELECT * FROM profiles WHERE user_id = $1`))[0] ?? null,
      experiences: await q(`SELECT * FROM experiences WHERE user_id = $1 ORDER BY created_at`),
      skills: await q(`SELECT us.*, s.names FROM user_skills us JOIN skills s ON s.id = us.skill_id WHERE us.user_id = $1`),
      evidence: await q(`SELECT * FROM skill_evidence WHERE user_id = $1`),
      suggestions: await q(`SELECT * FROM skill_suggestions WHERE user_id = $1`),
      saved_opportunities: await q(`SELECT * FROM saved_opportunities WHERE user_id = $1`),
      plans: await q(`SELECT * FROM plans WHERE user_id = $1`),
      plan_tasks: await q(`SELECT * FROM plan_tasks WHERE user_id = $1 ORDER BY plan_id, position`),
      conversations: await q(`SELECT * FROM conversations WHERE user_id = $1`),
      messages: await q(`SELECT id, conversation_id, role, content, tool_calls, status, feedback, engine, created_at FROM messages WHERE user_id = $1 ORDER BY created_at`),
    };
  });
}

/** Permanent deletion. Cascades remove every student-owned row (see FK ON DELETE CASCADE). */
export async function deleteAccount(userId: string, password: string) {
  const row = await asUser(userId, (tx) => tx.one<{ password_hash: string }>(`SELECT password_hash FROM users WHERE id = $1`, [userId]));
  if (!row || !(await verifyPassword(password, row.password_hash))) throw new ApiError("validation", "wrong_password");
  await asSystem(async (tx) => {
    await tx.query(`INSERT INTO audit_log (actor_id, action, target) VALUES (NULL, 'account.deleted', $1)`, [userId]);
    await tx.query(`DELETE FROM users WHERE id = $1`, [userId]);
  });
}
