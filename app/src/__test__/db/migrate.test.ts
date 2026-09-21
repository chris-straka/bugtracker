import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pool } from '../../config/postgres'
import { listMigrationFiles, migrate, migrationVersion, pendingMigrations } from '../../db/migrate'
import { closeDbConnections, isPortReachable } from '../helper/db'

afterAll(async () => {
  await closeDbConnections()
})

describe('migration file handling (no database)', () => {
  it('parses versions and ignores non-migration files', () => {
    expect(migrationVersion('001_initial_schema.sql')).toBe('001')
    expect(migrationVersion('012_add_index.sql')).toBe('012')
    expect(migrationVersion('README.md')).toBeNull()
    expect(migrationVersion('001.sql')).toBeNull()
    expect(migrationVersion('seed.sql')).toBeNull()
  })

  it('lists files in apply order and computes what is pending', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'migrations-'))
    try {
      await writeFile(path.join(dir, '002_b.sql'), 'SELECT 1;')
      await writeFile(path.join(dir, '001_a.sql'), 'SELECT 1;')
      await writeFile(path.join(dir, 'notes.txt'), 'ignore me')

      const files = await listMigrationFiles(dir)
      expect(files).toEqual(['001_a.sql', '002_b.sql'])
      expect(pendingMigrations(files, ['001'])).toEqual(['002_b.sql'])
      expect(pendingMigrations(files, ['001', '002'])).toEqual([])
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})

describe('migrate (needs postgres)', () => {
  it('records the baseline and is a no-op on the second run', async () => {
    if (!(await isPortReachable(Number(process.env.PGPORT ?? 5432)))) {
      console.log('skipping migration integration test: postgres is not reachable')
      return
    }
    const first = await migrate(pool)
    const second = await migrate(pool)

    expect(second.applied).toEqual([])
    expect(second.baselined).toBe(false)
    const versions = await pool.query<{ version: string }>('SELECT version FROM schema_migrations')
    expect(versions.rows.map((row) => row.version)).toContain('001')
    expect(first.baselined).toBeDefined()
  })
})
