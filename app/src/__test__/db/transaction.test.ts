import type { Pool, PoolClient, QueryConfig, QueryResult } from 'pg'
import { withTransaction } from '../../db/transaction'

interface RecordingClient {
  queries: string[]
  released: boolean
  failOn: string | null
  rollbackFails: boolean
}

function mockPool(rec: RecordingClient): Pool {
  const empty: QueryResult = { rows: [], rowCount: 0, command: '', oid: 0, fields: [] }
  const client = {
    query: (config: string | QueryConfig): Promise<QueryResult> => {
      const text = typeof config === 'string' ? config : (config.text ?? '')
      rec.queries.push(text)
      if (rec.failOn !== null && text.includes(rec.failOn)) throw new Error('boom')
      if (text === 'ROLLBACK' && rec.rollbackFails) throw new Error('connection lost')
      return Promise.resolve(empty)
    },
    release: () => {
      rec.released = true
    },
  } as unknown as PoolClient
  return { connect: () => Promise.resolve(client) } as unknown as Pool
}

function recorder(): RecordingClient {
  return { queries: [], released: false, failOn: null, rollbackFails: false }
}

describe('withTransaction', () => {
  it('begins, commits, returns the value, and releases on success', async () => {
    const rec = recorder()
    const result = await withTransaction(mockPool(rec), async (client) => {
      await client.query('INSERT INTO app_user DEFAULT VALUES')
      return 42
    })

    expect(result).toBe(42)
    expect(rec.queries).toEqual(['BEGIN', 'INSERT INTO app_user DEFAULT VALUES', 'COMMIT'])
    expect(rec.released).toBe(true)
  })

  it('rolls back, rethrows, and still releases when work fails', async () => {
    const rec = recorder()
    rec.failOn = 'INSERT'

    await expect(
      withTransaction(mockPool(rec), async (client) => {
        await client.query('INSERT INTO app_user DEFAULT VALUES')
      }),
    ).rejects.toThrow('boom')

    expect(rec.queries).toEqual(['BEGIN', 'INSERT INTO app_user DEFAULT VALUES', 'ROLLBACK'])
    expect(rec.released).toBe(true)
  })

  it('reports the original error even when rollback itself fails', async () => {
    const rec = recorder()
    rec.failOn = 'INSERT'
    rec.rollbackFails = true

    await expect(
      withTransaction(mockPool(rec), async (client) => {
        await client.query('INSERT INTO app_user DEFAULT VALUES')
      }),
    ).rejects.toThrow('boom')
    expect(rec.released).toBe(true)
  })
})
