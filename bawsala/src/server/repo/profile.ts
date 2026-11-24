import "server-only";
import { asUser } from "../db";

export interface Profile {
  situation: string | null;
  field_of_study: string | null;
  education_level: string | null;
  school: string | null;
  graduation_year: number | null;
  city: string | null;
  languages: string[];
  goal: string | null;
  target_opportunity_id: string | null;
  share_with_institution: boolean;
  onboarded_at: Date | null;
}

export async function getProfile(userId: string): Promise<Profile> {
  const row = await asUser(userId, (tx) => tx.one<Profile>(`SELECT * FROM profiles WHERE user_id = $1`, [userId]));
  if (row) return row;
  await asUser(userId, (tx) => tx.query(`INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [userId]));
  return getProfile(userId);
}

const FIELDS = ["situation", "field_of_study", "education_level", "school", "graduation_year", "city", "languages", "goal", "share_with_institution"] as const;
export type ProfilePatch = Partial<Pick<Profile, (typeof FIELDS)[number]>> & { onboarded?: boolean };

export async function updateProfile(userId: string, patch: ProfilePatch) {
  const sets: string[] = [];
  const vals: unknown[] = [userId];
  for (const f of FIELDS) {
    if (patch[f] !== undefined) {
      vals.push(patch[f]);
      sets.push(`${f} = $${vals.length}`);
    }
  }
  if (patch.onboarded) sets.push(`onboarded_at = coalesce(onboarded_at, now())`);
  if (!sets.length) return;
  await asUser(userId, (tx) => tx.query(`UPDATE profiles SET ${sets.join(", ")} WHERE user_id = $1`, vals));
}

export async function setTarget(userId: string, opportunityId: string | null) {
  await asUser(userId, (tx) => tx.query(`UPDATE profiles SET target_opportunity_id = $2 WHERE user_id = $1`, [userId, opportunityId]));
}
