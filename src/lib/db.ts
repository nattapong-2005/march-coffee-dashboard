import { Pool, PoolConfig } from 'pg';

declare global {
  var __postgresPool: Pool | undefined;
}

export function parseDatabaseConfig(): PoolConfig {
  let dbUrl = process.env.DB_URL || '';
  if (dbUrl.startsWith('jdbc:')) {
    dbUrl = dbUrl.slice(5);
  }

  const user = process.env.DB_USER || '';
  const password = process.env.DB_PASSWORD || '';

  if (dbUrl) {
    try {
      const parsed = new URL(dbUrl);
      return {
        host: parsed.hostname,
        port: parsed.port ? parseInt(parsed.port, 10) : 5432,
        database: parsed.pathname.replace(/^\//, '') || 'postgres',
        user: user || decodeURIComponent(parsed.username),
        password: password || decodeURIComponent(parsed.password),
        ssl: {
          rejectUnauthorized: false,
        },
        max: 3, // Keep pool small for Supabase Session Pooler (max 15 clients shared with Java POS)
        idleTimeoutMillis: 5000,
        connectionTimeoutMillis: 10000,
      };
    } catch {
      // If URL parsing fails, fallback below
    }
  }

  return {
    connectionString: dbUrl,
    user,
    password,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 3,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  };
}

export function getPool(): Pool {
  if (!global.__postgresPool) {
    const pool = new Pool(parseDatabaseConfig());
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
    global.__postgresPool = pool;
  }
  return global.__postgresPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const res = await pool.query(text, params);
  return res.rows as T[];
}

export async function testConnection(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    return { ok: true, latencyMs: Date.now() - start };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, latencyMs: Date.now() - start, error: message };
  }
}
