import type { SessionOptions } from 'express-session'
import session from 'express-session'
import { redisStore } from './redis'

if (!process.env.SESSIONS_SECRET) throw new Error('process.env.SESSIONS_SECRET is not set')

/**
 * Sessions live in Redis; the default MemoryStore is only suitable for dev.
 *
 * resave is off because the Redis store doesn't need it, and rewriting unchanged
 * sessions on every request can race. saveUninitialized is off so empty sessions
 * from visitors who never log in aren't written to the store.
 */
const sessionConfig: SessionOptions = {
  store: redisStore,
  secret: process.env.SESSIONS_SECRET,
  rolling: true,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}

// express-session 1.19 widened `cookie` to also allow a factory function, so
// narrow to the object form before touching it.
if (process.env.NODE_ENV === 'production' && typeof sessionConfig.cookie === 'object') {
  sessionConfig.cookie.secure = true
}

export default session(sessionConfig)
