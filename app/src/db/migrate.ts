import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config({ quiet: true })

export const MIGRATIONS_TABLE = 'schema_migrations'

/** `001_initial_schema.sql` -> `001`. Returns null for non-migration files. */
export function migrationVersion(filename: string): string | null {
  const match = /^(\d+)_.+\.sql$/.exec(path.basename(filename))
  return match ? match[1] : null
}

/** Migration `.sql` filenames in apply order. Ignores anything else in the dir. */
export async function listMigrationFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir)
  return entries.filter((entry) => migrationVersion(entry) !== null).sort()
}

/** Files whose version is not in `applied` yet, still in apply order. */
export function pendingMigrations(files: string[], applied: Iterable<string>): string[] {
  const appliedVersions = new Set(applied)
  return files.filter((file) => !appliedVersions.has(migrationVersion(file) as string))
}

function defaultMigrationsDir(): string {
  // src/db/migrate.ts -> <app>/migrations, and the same relative layout
  // holds for the compiled output (build/db/migrate.js -> <app>/migrations).
  return path.resolve(__dirname, '../../migrations')
}

async function tableExists(
  query: (text: string) => Promise<{ rows: { to_regclass: string | null }[] }>,
  table: string,
): Promise<boolean> {
  const result = await query(`SELECT to_regclass('public.${table}') AS to_regclass`)
  return result.rows[0]?.to_regclass !== null
}

export interface MigrateResult {
  /** Versions applied by this run, in order. Empty when already up to date. */
  applied: string[]
  /** True when the DB already had the baseline schema (e.g. docker entrypoint
   * ran bugtracker.sql) so versions were recorded without re-running them. */
  baselined: boolean
}

/**
 * Applies pending SQL migrations in filename order, tracking them in the
 * `schema_migrations` table. Each file runs inside its own transaction.
 *
 * Baseline rule: a database that already contains the `app_user` table but
 * has no `schema_migrations` table (created from bugtracker.sql by the
 * docker entrypoint or CI) is stamped as up to date instead of failing on
 * `CREATE TABLE` conflicts. bugtracker.sql and migrations/001_* describe the
 * same schema, so re-running 001 there would be wrong.
 */
export async function migrate(pool: Pool, dir: string = defaultMigrationsDir()): Promise<MigrateResult> {
  const files = await listMigrationFiles(dir)
  const client = await pool.connect()
  try {
    if (!(await tableExists(client.query.bind(client), MIGRATIONS_TABLE))) {
      await client.query(
        `CREATE TABLE ${MIGRATIONS_TABLE} (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
      )
      if (await tableExists(client.query.bind(client), 'app_user')) {
        for (const file of files) {
          await client.query(`INSERT INTO ${MIGRATIONS_TABLE}(version) VALUES ($1)`, [
            migrationVersion(file) as string,
          ])
        }
        return { applied: [], baselined: true }
      }
    }

    const appliedRows = await client.query<{ version: string }>(`SELECT version FROM ${MIGRATIONS_TABLE}`)
    const pending = pendingMigrations(
      files,
      appliedRows.rows.map((row) => row.version),
    )

    const applied: string[] = []
    for (const file of pending) {
      const sql = await readFile(path.join(dir, file), 'utf8')
      const version = migrationVersion(file) as string
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query(`INSERT INTO ${MIGRATIONS_TABLE}(version) VALUES ($1)`, [version])
        await client.query('COMMIT')
      } catch (error) {
        await client.query('ROLLBACK')
        throw new Error(`Migration ${file} failed`, { cause: error })
      }
      applied.push(version)
    }
    return { applied, baselined: false }
  } finally {
    client.release()
  }
}

async function runCli(): Promise<void> {
  const pool = new Pool()
  try {
    const result = await migrate(pool)
    if (result.baselined) {
      console.log('Database already had the baseline schema; stamped existing migrations as applied.')
    } else if (result.applied.length === 0) {
      console.log('Database is up to date.')
    } else {
      console.log(`Applied migrations: ${result.applied.join(', ')}`)
    }
  } finally {
    await pool.end()
  }
}

const invokedAsScript = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('src/db/migrate.ts')
if (invokedAsScript) {
  runCli().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
