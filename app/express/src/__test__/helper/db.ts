import { Socket } from 'net'
import { closePostgresDBConnection } from '../../config/postgres'
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
