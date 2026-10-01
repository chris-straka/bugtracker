import type { Pool, PoolClient } from 'pg'

/** The client handed to the callback: every query in it shares one transaction. */
export type TxClient = PoolClient

/**
 * Runs `work` inside a single Postgres transaction. Commits on success, rolls
 * back on error, and releases the client either way. Use it for multi-statement
 * writes (create-then-link, delete-then-children) so a failure leaves no partial
 * writes.
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
      // ROLLBACK fails only if the connection is broken. Rethrow the original
      // error, which is the one the caller needs.
    }
    throw error
  } finally {
    client.release()
  }
}
