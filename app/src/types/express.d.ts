import type { UserRole } from '../models/User'
import type { RequestAuth } from '../utility/requestAuth'

declare global {
  namespace Express {
    interface Request {
      /**
       * Identity established from a JWT access token by `isAuthenticated`.
       * Cookie-session requests leave this unset and read `req.session` instead;
       * use `getRequestAuth(req)` to handle both uniformly.
       */
      auth?: RequestAuth | undefined
    }
  }
}

export interface SessionIdentity {
  userId: string | null
  userRole: UserRole | null
}
