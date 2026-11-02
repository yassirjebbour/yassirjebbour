import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
  DATABASE_SSL: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  // AI — optional. Without a key the product runs in "basic mode" (deterministic engine),
  // and the UI says so plainly.
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default("claude-opus-5-5"),
  AI_EFFORT: z.enum(["low", "medium", "high", "xhigh", "max"]).default("low"),
  AI_DAILY_MESSAGES_PER_USER: z.coerce.number().int().min(1).default(60),
  AI_FALLBACKS: z
    .string()
    .optional()
    .transform((v) => v !== "false" && v !== "0"),
  // Email (optional). Without RESEND_API_KEY, emails are written to the server log in dev.
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("BAWSALA <no-reply@bawsala.ma>"),
  // Bootstrap: the first account created with this email becomes platform admin.
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ),
});

export type Env = z.infer<typeof schema>;
let cached: Env | null = null;

export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error("Invalid environment: " + parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }
    cached = parsed.data;
  }
  return cached;
}

export function aiConfigured(): boolean {
  return Boolean(env().ANTHROPIC_API_KEY);
}
