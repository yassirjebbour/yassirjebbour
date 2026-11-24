import { signUp } from "@/server/repo/account";
import { asSystem } from "@/server/db";
import type { SessionUser } from "@/server/auth/session";
import type { Locale } from "@/i18n/config";

let n = 0;
export async function makeUser(opts: { locale?: Locale; role?: SessionUser["role"]; institutionId?: string | null; name?: string } = {}): Promise<SessionUser> {
  const email = `u${Date.now()}${n++}@test.local`;
  const id = await signUp({ email, password: "password-1234", name: opts.name ?? "Test Student", locale: opts.locale ?? "en" });
  if (opts.role || opts.institutionId) await asSystem((tx) => tx.query(`UPDATE users SET role = coalesce($2, role), institution_id = $3 WHERE id = $1`, [id, opts.role ?? null, opts.institutionId ?? null]));
  return { id, email, name: opts.name ?? "Test Student", locale: opts.locale ?? "en", role: opts.role ?? "student", institutionId: opts.institutionId ?? null };
}

export async function makeInstitution(name = "Test University") {
  return asSystem((tx) => tx.one<{ id: string; join_code: string }>(`INSERT INTO institutions (name) VALUES ($1) RETURNING id, join_code`, [name])).then((r) => r!);
}
