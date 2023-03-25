import type { SessionOptions } from 'express-session'
import sessions from 'express-session'

const secret = process.env.SESSIONS_SECRET

if (secret === undefined || secret === '') {
  throw new Error('process.env.SESSIONS_SECRET is not set')
}

/**
 * The "store" is what holds all your session data.
 * By default it's MemoryStore (server memory), but you should use a DB in prod.
 *
 * The resave option will save the user's session to the store after every request
 * It will save regardless of whether or not their session information has changed.
 * It's not recommended (creates race conditions) but your store might require it.
 *
 * saveUninitialized forces a session to be saved to the store even if it has not yet been modified.
 * You still create a session cookie with its own session id, and the user will send it back to you,
 * except you would only store an empty session object on req.session. You would use this option,
 * if you wanted to track recurring visitors who haven't saved anything to your site.
 */
const sessionConfig: SessionOptions = {
  secret,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: { secure: false }
}

if (process.env.NODE_ENV === 'production' && sessionConfig.cookie != null) {
  sessionConfig.cookie.secure = true
}

export default sessions(sessionConfig)
