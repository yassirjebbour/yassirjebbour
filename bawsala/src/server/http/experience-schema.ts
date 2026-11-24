import { z } from "zod";
export const ExperienceBody = z.object({
  kind: z.enum(["job", "internship", "volunteer", "project", "family", "club", "education", "course", "other"]),
  title: z.string().trim().min(1).max(200),
  organization: z.string().trim().max(200).nullable().optional().transform((v) => v || null),
  description: z.string().trim().min(10).max(4000),
  started_on: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/).nullable().optional().transform((v) => (v ? (v.length === 7 ? v + "-01" : v) : null)),
  ended_on: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/).nullable().optional().transform((v) => (v ? (v.length === 7 ? v + "-01" : v) : null)),
});
