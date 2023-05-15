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
  if (process.env.NODE_ENV === 'production') throw new Error('Tried to delete the production DB')
  await pool.query('TRUNCATE ticket_history CASCADE')
  await pool.query('TRUNCATE ticket_comments CASCADE')
  await pool.query('TRUNCATE ticket_user CASCADE')
  await pool.query('TRUNCATE tickets CASCADE')
  await pool.query('TRUNCATE project_history CASCADE')
  await pool.query('TRUNCATE project_comments CASCADE')
  await pool.query('TRUNCATE project_users CASCADE')
  await pool.query('TRUNCATE projects CASCADE')
  await pool.query('TRUNCATE user_history CASCADE')
  await pool.query('TRUNCATE users CASCADE')
}

export {
  pool as db,
  Pool as dbType,
  closePostgresDBConnection
}
