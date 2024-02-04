import type { SessionOptions } from 'express-session'
import session from 'express-session'
import { redisStore } from './redis'

if (!process.env.SESSIONS_SECRET) throw new Error('process.env.SESSIONS_SECRET is not set')

/**
 * The "store" is what holds all the session data.
 * Default is MemoryStore (server memory), it's only meant for dev
 *
 * resave will save the user's session to the store after every request,
 * regardless of whether or not their session information has changed.
 * It's not recommended (creates race conditions) but your store might require it.
 * Redis does not so it's disabled.
 *
 * saveUninitialized forces a session to be saved to the store even if it has not yet been modified (i.e. {}).
 * It's used if you want to track recurring visitors who haven't done anything on your site yet.
 * Because it's possible to create a session cookie with its own session id but still have nothing in the session itself.
 * The user sends the session cookie with every request and each session cookie has its own ID despite the session being empty.
 */
const sessionConfig: SessionOptions = {
  store: redisStore,
  secret: process.env.SESSIONS_SECRET,
  rolling: true,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}

if (process.env.NODE_ENV === 'production' && sessionConfig.cookie != null) {
  sessionConfig.cookie.secure = true
}

export default session(sessionConfig)
