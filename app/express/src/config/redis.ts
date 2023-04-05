import { createClient } from 'redis'
import RedisStore from 'connect-redis'

if (!process.env.REDIS_HOST) throw new Error()
if (!process.env.REDIS_PORT) throw new Error()

const redisHost = process.env.REDIS_HOST
const redisPort = parseInt(process.env.REDIS_PORT)

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort
  }
})

export const redisStore = new RedisStore({
  client: redisClient,
})

