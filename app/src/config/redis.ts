import { RedisStore } from 'connect-redis'
import { createClient } from 'redis'

if (!process.env.REDIS_HOST) throw new Error('REDIS_HOST not set')
if (!process.env.REDIS_PORT) throw new Error('REDIS_PORT not set')

const redisHost = process.env.REDIS_HOST
const redisPort = parseInt(process.env.REDIS_PORT)

export const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
})

/** The concrete client type, so repositories stay in sync with this config. */
export type AppRedisClient = typeof redisClient

redisClient.connect()

redisClient.on('error', (err: unknown) => console.log('Redis Client Error', err))

/**
 * It will store all my sessions as keys in the redis store
 * The prefix for each key is sess: by default
 */
export const redisStore = new RedisStore({ client: redisClient })

redisStore.on('error', (err: unknown) => console.log('Reddis Store Error', err))

export async function closeRedisConnection() {
  return redisClient.quit()
}
