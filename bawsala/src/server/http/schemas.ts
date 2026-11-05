import { z } from "zod";
import { LOCALES } from "@/i18n/config";

export const zLocale = z.enum(LOCALES);
export const zEmail = z.string().trim().toLowerCase().email().max(254);
export const zPassword = z.string().min(10).max(200);
export const zName = z.string().trim().min(1).max(120);
export const zUuid = z.string().uuid();
export const zUrl = z.string().trim().url().max(2000).refine((u) => /^https?:\/\//i.test(u), "http(s) only");
export const zLocalized = z.object({ en: z.string().max(4000).optional(), fr: z.string().max(4000).optional(), ar: z.string().max(4000).optional(), ary: z.string().max(4000).optional(), zgh: z.string().max(4000).optional() })
  .refine((o) => Object.values(o).some((v) => v && v.trim()), "at least one language");
