import "server-only";
import { asUser } from "../db";
import { ApiError } from "../http/errors";

export interface Experience {
  id: string; kind: string; title: string; organization: string | null; description: string;
  started_on: string | null; ended_on: string | null; analyzed_at: Date | null; created_at: Date;
}
export type ExperienceInput = Pick<Experience, "kind" | "title" | "organization" | "description" | "started_on" | "ended_on">;

const COLS = `id, kind, title, organization, description, to_char(started_on,'YYYY-MM-DD') started_on, to_char(ended_on,'YYYY-MM-DD') ended_on, analyzed_at, created_at`;

export const listExperiences = (userId: string) =>
  asUser(userId, (tx) => tx.query<Experience>(`SELECT ${COLS} FROM experiences WHERE user_id = $1 ORDER BY created_at DESC`, [userId]));

export async function getExperience(userId: string, id: string) {
  const row = await asUser(userId, (tx) => tx.one<Experience>(`SELECT ${COLS} FROM experiences WHERE id = $1`, [id]));
  if (!row) throw new ApiError("not_found");
  return row;
}

export const createExperience = (userId: string, e: ExperienceInput) =>
  asUser(userId, (tx) =>
    tx.one<Experience>(
      `INSERT INTO experiences (user_id, kind, title, organization, description, started_on, ended_on)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${COLS}`,
      [userId, e.kind, e.title, e.organization, e.description, e.started_on, e.ended_on],
    ),
  ).then((r) => r!);

export async function updateExperience(userId: string, id: string, e: ExperienceInput) {
  const row = await asUser(userId, (tx) =>
    tx.one<Experience>(
      `UPDATE experiences SET kind=$2, title=$3, organization=$4, description=$5, started_on=$6, ended_on=$7, analyzed_at = NULL
        WHERE id = $1 RETURNING ${COLS}`,
      [id, e.kind, e.title, e.organization, e.description, e.started_on, e.ended_on],
    ),
  );
  if (!row) throw new ApiError("not_found");
  return row;
}

export async function deleteExperience(userId: string, id: string) {
  const rows = await asUser(userId, (tx) => tx.query(`DELETE FROM experiences WHERE id = $1 RETURNING id`, [id]));
  if (!rows.length) throw new ApiError("not_found");
}
