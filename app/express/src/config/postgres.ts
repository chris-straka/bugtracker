import { Pool } from "pg";

if (!process.env.PGPASSWORD) throw new Error('process.env.PGPASSWORD is not set')
// if (!process.env.PGHOST) throw new Error('process.env.PGHOST is not set')
// if (!process.env.PGPORT) throw new Error('process.env.PGPORT is not set')
// if (!process.env.PGDATABASE) throw new Error('process.env.PGDATABASE is not set')
// if (!process.env.PGUSER) throw new Error('process.env.PGUSER is not set')

/** 
 * Pool() uses environment variables to connect to postgres 
 * 
 * https://node-postgres.com/apis/pool
 */
const pool = new Pool();

pool.on('error', (err, client) => {
  console.error(`Unexpected error on ${client} -- ${err}`)

  process.exit(-1);
})

export { 
  pool as db,
  Pool as dbType
}

export default pool