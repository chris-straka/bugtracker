import { Pool } from 'pg'

if (!process.env.PGHOST) throw new Error('PGHOST not set')
if (!process.env.PGPORT) throw new Error('PGPORT not set')
if (!process.env.PGDATABASE) throw new Error('PGDATABASE not set')
if (!process.env.PGUSER) throw new Error('PGUSER not set')
if (!process.env.PGPASSWORD) throw new Error('PGPASSWORD not set')

/**
 * pg package uses environment variables to connect to postgres
 *
 * https://node-postgres.com/apis/pool
 */
const pool = new Pool()

pool.on('error', (err, client) => {
  console.log(client)
  console.error(err)
  process.exit(-1)
})

async function closePostgresDBConnection () {
  await pool.end()
}

export async function cleanupDb() { 
  await pool.query('TRUNCATE ticket_history')
  await pool.query('TRUNCATE ticket_comments')
  await pool.query('TRUNCATE ticket_assignments')
  await pool.query('TRUNCATE tickets')
  await pool.query('TRUNCATE project_history')
  await pool.query('TRUNCATE project_comments')
  await pool.query('TRUNCATE project_users')
  await pool.query('TRUNCATE projects')
  await pool.query('TRUNCATE user_history')
  await pool.query('TRUNCATE users')
}

export {
  pool as db,
  Pool as dbType,
  closePostgresDBConnection
}
