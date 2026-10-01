import type { QueryConfig, QueryResult } from 'pg'
import { execute, queryExists, queryMany, queryMaybeOne, queryOne } from '../../db/query'
import type { Queryable } from '../../db/query'

function fakeDb(rows: unknown[], rowCount?: number): Queryable {
  const result: QueryResult = {
    rows: rows as never[],
    rowCount: rowCount ?? rows.length,
    command: 'SELECT',
    oid: 0,
    fields: [],
  }
  // The helpers only call `query(config)`, so the fake pool needs nothing else.
  return { query: () => Promise.resolve(result) } as unknown as Queryable
}

const config: QueryConfig = { text: 'SELECT 1' }

describe('typed query helpers', () => {
  it('queryMany returns every row with its declared type', async () => {
    const rows = await queryMany<{ id: number }>(fakeDb([{ id: 1 }, { id: 2 }]), config)
    expect(rows).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('queryMaybeOne returns the row, or undefined when there is none', async () => {
    await expect(queryMaybeOne<{ id: number }>(fakeDb([{ id: 1 }]), config)).resolves.toEqual({ id: 1 })
    await expect(queryMaybeOne<{ id: number }>(fakeDb([]), config)).resolves.toBeUndefined()
  })

  it('queryOne throws when no row comes back', async () => {
    await expect(queryOne<{ id: number }>(fakeDb([]), config)).rejects.toThrow('Expected one row')
  })

  it('queryExists maps rowCount to boolean', async () => {
    await expect(queryExists(fakeDb([{}], 1), config)).resolves.toBe(true)
    await expect(queryExists(fakeDb([], 0), config)).resolves.toBe(false)
  })

  it('execute maps rowCount to boolean', async () => {
    await expect(execute(fakeDb([], 3), config)).resolves.toBe(true)
    await expect(execute(fakeDb([], 0), config)).resolves.toBe(false)
  })
})
