/**
 * Tool registry. A tool = input schema + output schema + permission class + execute().
 *
 * Permission classes:
 *   read     — reads the current student's data or public data. Executes immediately.
 *   suggest  — writes *suggestions* that still need the student's yes (e.g. skill suggestions).
 *   reversible — small reversible change the student asked for (save/unsave an opportunity).
 *   confirm  — consequential change: the tool only creates a pending action; the student must
 *              press "Confirm" in the UI, which calls /api/v1/actions/:id. The model cannot confirm.
 *
 * The user id always comes from the authenticated session (ToolContext), never from model input,
 * so the model cannot act on another account. Inputs are validated with zod before execution;
 * outputs are validated too (a failing output is a bug and is reported as a tool error).
 */
import { z } from "zod";
import type { SessionUser } from "../../auth/session";
import type { Locale } from "@/i18n/config";
import { log } from "../../log";

export type Permission = "read" | "suggest" | "reversible" | "confirm";

export interface ToolContext {
  user: SessionUser;
  locale: Locale;
  conversationId: string | null;
  allowLlm: boolean; // nested LLM use (e.g. extraction inside analyze_skills)
  signal?: AbortSignal;
}

export interface ToolDef<I extends z.ZodType, O extends z.ZodType> {
  name: string;
  description: string;
  permission: Permission;
  input: I;
  output: O;
  execute(ctx: ToolContext, input: z.infer<I>): Promise<z.infer<O>>;
}

export function defineTool<I extends z.ZodType, O extends z.ZodType>(def: ToolDef<I, O>) {
  return def;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTool = ToolDef<any, any>;

export function jsonSchemaFor(tool: AnyTool): Record<string, unknown> {
  const s = z.toJSONSchema(tool.input, { io: "input" }) as Record<string, unknown>;
  delete s.$schema;
  return s;
}

export interface ToolRunResult { ok: boolean; output: unknown; error?: { code: string; message: string }; ms: number }

export async function runTool(tool: AnyTool, rawInput: unknown, ctx: ToolContext): Promise<ToolRunResult> {
  const t0 = Date.now();
  const parsed = tool.input.safeParse(rawInput ?? {});
  if (!parsed.success) {
    const message = parsed.error.issues.map((i: { path: PropertyKey[]; message: string }) => `${i.path.join(".") || "input"}: ${i.message}`).join("; ");
    log.info("tool.invalid_input", { tool: tool.name, user: ctx.user.id, message });
    return { ok: false, output: null, error: { code: "invalid_input", message }, ms: Date.now() - t0 };
  }
  try {
    const output = await tool.execute(ctx, parsed.data);
    const check = tool.output.safeParse(output);
    if (!check.success) {
      log.error("tool.invalid_output", { tool: tool.name, issues: check.error.issues.slice(0, 3) });
      return { ok: false, output: null, error: { code: "internal", message: "tool produced invalid output" }, ms: Date.now() - t0 };
    }
    log.info("tool.ok", { tool: tool.name, user: ctx.user.id, ms: Date.now() - t0 });
    return { ok: true, output: check.data, ms: Date.now() - t0 };
  } catch (e) {
    const code = (e as { code?: string }).code ?? "error";
    const message = code === "not_found" ? "not found" : code === "validation" ? (e as Error).message : "tool failed";
    log.warn("tool.failed", { tool: tool.name, user: ctx.user.id, code, err: e });
    return { ok: false, output: null, error: { code, message }, ms: Date.now() - t0 };
  }
}
