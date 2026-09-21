import type { Pool, PoolClient, QueryConfig, QueryResultRow } from 'pg'

/**
 * Anything we can run a parameterized query against: either the shared pool
 * or a single client checked out for a transaction. Accepting this union
 * instead of `Pool` lets transactional code reuse the same typed helpers.
 */
export type Queryable = Pool | PoolClient

/** A row that came back when none was expected (INSERT/UPDATE/DELETE). */
export type EmptyRow = Record<string, unknown>

/** `SELECT 1 ...` existence probes return a single marker column. */
export interface ExistsRow {
  '?column?': number
}

export async function queryMany<T extends QueryResultRow>(db: Queryable, config: QueryConfig): Promise<T[]> {
  const result = await db.query<T>(config)
  return result.rows
}

export async function queryMaybeOne<T extends QueryResultRow>(
  db: Queryable,
  config: QueryConfig,
): Promise<T | undefined> {
  const result = await db.query<T>(config)
  return result.rows[0]
}

export async function queryOne<T extends QueryResultRow>(db: Queryable, config: QueryConfig): Promise<T> {
  const row = await queryMaybeOne<T>(db, config)
  if (row === undefined) {
    throw new Error(`Expected one row for query ${config.name ?? 'anonymous'} but got none`)
  }
  return row
}

/** Runs a `SELECT 1 ...` probe and reports whether any row matched. */
export async function queryExists(db: Queryable, config: QueryConfig): Promise<boolean> {
  const result = await db.query<ExistsRow>(config)
  return (result.rowCount ?? 0) > 0
}

/**
 * Runs a write that returns no rows and reports whether it touched anything.
 * Use for INSERT/UPDATE/DELETE without a RETURNING clause.
 */
export async function execute(db: Queryable, config: QueryConfig): Promise<boolean> {
  const result = await db.query<EmptyRow>(config)
  return (result.rowCount ?? 0) > 0
}
