import { Pool } from 'pg'

function assertEnvVarExists (name: string): void {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`process.env.${name} is not set`)
  }
}

/**
 * pg package uses environment variables to connect to postgres
 *
 * https://node-postgres.com/apis/pool
 */
if (process.env.NODE_ENV === 'production') {
  assertEnvVarExists('PGUSER')
  assertEnvVarExists('PGPASSWORD')
  assertEnvVarExists('PGHOST')
  assertEnvVarExists('PGPORT')
  assertEnvVarExists('PGDATABASE')
}

const pool = new Pool()

pool.on('error', (err, client) => {
  console.log(client)
  console.error(err)
  process.exit(-1)
})

export {
  pool as db,
  Pool as dbType
}

export default pool
