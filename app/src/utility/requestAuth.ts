import type { Request } from 'express'
import type { UserRole } from '../models/User'

/**
 * Identity for the current request, regardless of transport.
 *
 * Web browsers keep using the Redis cookie session (`req.session`), while
 * API/mobile clients send a JWT access token (`req.auth`, set by
 * `isAuthenticated` when it verifies a `Bearer` token).
 */
export interface RequestAuth {
  userId: string
  userRole: UserRole
}

export function getRequestAuth(req: Request): RequestAuth | null {
  if (req.auth?.userId && req.auth?.userRole) return req.auth
  if (req.session?.userId && req.session?.userRole) {
    return { userId: req.session.userId, userRole: req.session.userRole }
  }
  return null
}
