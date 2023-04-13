import RedisStore from 'connect-redis'
import { createClient } from 'redis'

if (!process.env.REDIS_HOST) throw new Error()
if (!process.env.REDIS_PORT) throw new Error()

const redisHost = process.env.REDIS_HOST
const redisPort = parseInt(process.env.REDIS_PORT)

export const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort
  }
})

redisClient.connect().catch(console.error)

/** 
 * It will store all my sessions as keys in the redis store
 * The prefix for each key is sess: by default
 */
export const redisStore = new RedisStore({ client: redisClient })

export async function closeRedisConnection() {
  return await redisClient.quit()
}
