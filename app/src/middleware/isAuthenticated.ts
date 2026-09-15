import type { Request, Response, NextFunction } from 'express'
import { UserIsNotAuthenticatedError } from '../errors'
import { bearerTokenFromHeader, verifyAccessToken } from '../utility/jwt'

/**
 * Dual-transport authentication.
 *
 * Web browsers keep using the Redis cookie session (`req.session.userId`);
 * API/mobile clients send a JWT access token (`Authorization: Bearer ...`),
 * which is verified here and recorded on `req.auth`. Downstream code reads
 * both uniformly via `getRequestAuth(req)`.
 *
 * req.session is always available because express-session creates a session
 * object for every incoming request, so you can't check for req.session —
 * otherwise the user will always be authenticated.
 */
export function isAuthenticated(req: Request, _: Response, next: NextFunction) {
  if (req.session?.userId) return next()

  const headerToken = bearerTokenFromHeader(req.headers.authorization)
  const payload = headerToken ? verifyAccessToken(headerToken) : null
  if (payload) {
    req.auth = { userId: payload.sub, userRole: payload.role }
    return next()
  }

  return next(new UserIsNotAuthenticatedError())
}
