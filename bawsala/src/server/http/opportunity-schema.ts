import { z } from "zod";
import { zLocalized, zUrl } from "./schemas";

export const OpportunityBody = z.object({
  title: zLocalized,
  organization: z.string().trim().min(2).max(200),
  city: z.string().trim().max(120).nullable().default(null),
  remote: z.boolean().default(false),
  kind: z.enum(["job", "internship", "training", "volunteer", "program"]),
  description: zLocalized,
  project_brief: zLocalized.nullable().default(null),
  eligibility: zLocalized.nullable().default(null),
  apply_url: zUrl.nullable().default(null),
  source_name: z.string().trim().min(2).max(200),
  source_url: zUrl, // real opportunities must cite their source
  verification_status: z.enum(["verified", "unverified"]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  expires_at: z.string().datetime().nullable().default(null),
  requirements: z.array(z.object({ skillId: z.string().regex(/^[a-z0-9_]{2,40}$/), required: z.boolean() })).max(15),
});
