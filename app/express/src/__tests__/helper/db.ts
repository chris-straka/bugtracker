import { closePostgresDBConnection } from '../../config/postgres'
import { closeRedisConnection } from '../../config/redis'

export async function closeDbConnections() {
  await closePostgresDBConnection()
  await closeRedisConnection()
}
