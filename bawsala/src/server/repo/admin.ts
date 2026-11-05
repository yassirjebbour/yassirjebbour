import "server-only";
import { asSystem } from "../db";

/** Funnel, retention and AI-cost numbers computed from real events — nothing is estimated or seeded. */
export async function adminOverview() {
  return asSystem(async (tx) => {
    const funnel = await tx.one<Record<string, number>>(`
      WITH s AS (SELECT DISTINCT user_id FROM events WHERE name = 'account.signed_up' AND created_at > now() - interval '30 days')
      SELECT (SELECT count(*) FROM s)::int signup,
             (SELECT count(*) FROM profiles WHERE onboarded_at IS NOT NULL AND user_id IN (SELECT user_id FROM s))::int onboarded,
             (SELECT count(DISTINCT user_id) FROM user_skills WHERE user_id IN (SELECT user_id FROM s))::int skill,
             (SELECT count(*) FROM profiles WHERE target_opportunity_id IS NOT NULL AND user_id IN (SELECT user_id FROM s))::int target,
             (SELECT count(DISTINCT user_id) FROM plans WHERE user_id IN (SELECT user_id FROM s))::int plan,
             (SELECT count(DISTINCT user_id) FROM plan_tasks WHERE completed_at IS NOT NULL AND user_id IN (SELECT user_id FROM s))::int task`);
    const wau = await tx.one<{ n: number }>(`SELECT count(DISTINCT e.user_id)::int n FROM events e JOIN users u ON u.id = e.user_id AND u.role = 'student' WHERE e.created_at > now() - interval '7 days'`);
    const northStar = await tx.one<{ n: number }>(`SELECT count(DISTINCT t.user_id)::int n FROM plan_tasks t JOIN users u ON u.id = t.user_id AND u.role = 'student' WHERE t.completed_at > now() - interval '7 days' AND t.kind IN ('prove','project')`);
    const users = await tx.one<{ total: number; students: number }>(`SELECT count(*)::int total, count(*) FILTER (WHERE role = 'student')::int students FROM users`);
    const ai = await tx.query<{ feature: string; engine: string; calls: number; errors: number; cost: string; p50: number | null; tokens_in: number; tokens_out: number }>(`
      SELECT feature, engine, count(*)::int calls, count(*) FILTER (WHERE NOT ok)::int errors, coalesce(sum(est_cost_usd),0)::text cost,
             percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms)::int p50, coalesce(sum(input_tokens),0)::int tokens_in, coalesce(sum(output_tokens),0)::int tokens_out
        FROM ai_usage WHERE created_at > now() - interval '30 days' GROUP BY 1,2 ORDER BY 1,2`);
    const tools = await tx.query<{ tool: string; runs: number; failures: number }>(`
      SELECT props->>'tool' tool, count(*)::int runs, count(*) FILTER (WHERE props->>'ok' = 'false')::int failures
        FROM events WHERE name = 'tool.executed' AND created_at > now() - interval '30 days' GROUP BY 1 ORDER BY 2 DESC`);
    const retrieval = await tx.one<{ n: number; p50: number | null; empty: number }>(`
      SELECT count(*)::int n, percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms)::int p50, count(*) FILTER (WHERE jsonb_array_length(results) = 0)::int empty
        FROM retrieval_log WHERE created_at > now() - interval '30 days'`);
    const feedback = await tx.one<{ up: number; down: number }>(`SELECT count(*) FILTER (WHERE feedback = 1)::int up, count(*) FILTER (WHERE feedback = -1)::int down FROM messages WHERE created_at > now() - interval '30 days'`);
    const outbox = await tx.query<{ status: string; n: number }>(`SELECT status, count(*)::int n FROM email_outbox GROUP BY 1`);
    return { funnel: funnel!, wau: wau!.n, northStar: northStar!.n, users: users!, ai, tools, retrieval: retrieval!, feedback: feedback!, outbox };
  });
}
