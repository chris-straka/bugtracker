import type { Pool, PoolClient } from 'pg'

/** The client handed to the callback: every query in it shares one transaction. */
export type TxClient = PoolClient

/**
 * Runs `work` inside a single Postgres transaction: checks a client out of
 * the pool, BEGINs, COMMITs on success, ROLLBACKs on error, and always
 * releases the client. Multi-statement writes (create-then-link,
 * delete-then-children) must go through here so partial writes are
 * impossible.
 */
export async function withTransaction<T>(pool: Pool, work: (client: TxClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {
      // The connection itself is broken; releasing it still matters, the
      // original error is what the caller needs to see.
    }
    throw error
  } finally {
    client.release()
  }
}
