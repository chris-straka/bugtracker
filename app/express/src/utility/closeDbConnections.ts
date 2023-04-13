import { closePostgresDBConnection } from '../config/postgres'
import { closeRedisConnection } from '../config/redis'

export async function closeDBConnections() {
  await closePostgresDBConnection()
  await closeRedisConnection()
}