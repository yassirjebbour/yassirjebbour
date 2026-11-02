import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { env } from "../env";

/**
 * Database access.
 *
 * Every query runs inside a short transaction that declares *who* is asking:
 *   - asUser(userId, fn): sets app.user_id → Postgres RLS limits every row to that student.
 *   - asSystem(fn):       sets app.role = 'system' → trusted server code (auth, admin, reports).
 * There is deliberately no "raw" exported query function, so application code cannot forget
 * to scope a query.
 */

export interface Tx {
  query<R extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<R[]>;
  one<R extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<R | null>;
}

const globalForPool = globalThis as unknown as { __bawsalaPool?: Pool };

function pool(): Pool {
  if (!globalForPool.__bawsalaPool) {
    globalForPool.__bawsalaPool = new Pool({
      connectionString: env().DATABASE_URL,
      max: env().DATABASE_POOL_MAX,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: env().DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    });
  }
  return globalForPool.__bawsalaPool;
}

function wrap(client: PoolClient): Tx {
  return {
    async query(text, params) {
      const r = await client.query(text, params as unknown[]);
      return r.rows;
    },
    async one(text, params) {
      const r = await client.query(text, params as unknown[]);
      return r.rows[0] ?? null;
    },
  };
}

async function run<T>(settings: Record<string, string>, fn: (tx: Tx) => Promise<T>): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    for (const [k, v] of Object.entries(settings)) {
      await client.query("SELECT set_config($1, $2, true)", [k, v]);
    }
    const out = await fn(wrap(client));
    await client.query("COMMIT");
    return out;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function asUser<T>(userId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  if (!UUID.test(userId)) throw new Error("asUser: invalid user id");
  return run({ "app.user_id": userId, "app.role": "user" }, fn);
}

export function asSystem<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return run({ "app.role": "system", "app.user_id": "" }, fn);
}

/** Read-only access to public reference tables (skills, opportunities). */
export function asPublic<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return run({ "app.role": "public", "app.user_id": "" }, fn);
}

export async function closeDb() {
  await globalForPool.__bawsalaPool?.end();
  globalForPool.__bawsalaPool = undefined;
}
