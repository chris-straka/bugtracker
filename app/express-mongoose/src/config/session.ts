import type { SessionOptions } from 'express-session'
import sessions from 'express-session'

if (!process.env.SESSIONS_SECRET) throw new Error('process.env.SESSIONS_SECRET is not set')

/** 
 * A "store" holds all your session data.
 * By default it's MemoryStore, but you should use a DB in prod.
 * 
 * resave saves the user's session after all of their requests, regardless of whether or not their session information has changed.
 * It's not recommended (race conditions) but your store might require it.
 * 
 * saveUninitialized forces a session to be saved to the store even if it has not yet been modified.
 * you still create a session cookie with its own session id, and the user will send it back to you,
 * except you would have an empty session object on req.session.
 * 
 * saveUninitialized will let you track recurring visitors, because you can read their sessionID in their cookie.
 * 
 * https://expressjs.com/en/resources/middleware/session.html
 */
const sessionConfig: SessionOptions = {
  secret: process.env.SESSIONS_SECRET,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: { secure: false }
}

if (process.env.NODE_ENV === "production") {
  sessionConfig.cookie!.secure = true
}

export default sessions(sessionConfig)
