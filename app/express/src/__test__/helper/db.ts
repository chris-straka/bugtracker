import { Socket } from 'net'
import { pool, closePostgresDBConnection } from '../../config/postgres'
import { closeRedisConnection } from '../../config/redis'

export async function closeDbConnections() {
  await closePostgresDBConnection()
  await closeRedisConnection()
}

export async function isPortReachable (port: number, host = 'localhost'): Promise<boolean> {
  return new Promise((res) => {
    const socket = new Socket()

    const onError = () => {
      socket.destroy()
      res(false)
    }

    socket.setTimeout(1000)
    socket.once('error', onError)
    socket.once('timeout', onError)

    socket.connect(port, host, () => {
      socket.end()
      res(true)
    })
  })
}

export async function cleanupDb() { 
  if (process.env.NODE_ENV === 'production') throw new Error('Tried to delete the production DB')
  await pool.query('TRUNCATE ticket_history CASCADE')
  await pool.query('TRUNCATE ticket_comment CASCADE')
  await pool.query('TRUNCATE ticket_user CASCADE')
  await pool.query('TRUNCATE ticket CASCADE')
  await pool.query('TRUNCATE project_history CASCADE')
  await pool.query('TRUNCATE project_comment CASCADE')
  await pool.query('TRUNCATE project_user CASCADE')
  await pool.query('TRUNCATE project CASCADE')
  await pool.query('TRUNCATE user_history CASCADE')
  await pool.query('TRUNCATE app_user CASCADE')
}