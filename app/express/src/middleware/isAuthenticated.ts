import type { Request, Response, NextFunction } from 'express'
import { UserIsNotAuthenticatedError } from '../errors'

/** 
 * req.session is always available because express-session creates a session object for every incoming request.
 * so you can't check for req.session otherwise the user will always be authenticated
 */
export function isAuthenticated (req: Request, _: Response, next: NextFunction) {
  if (req.session?.userId) next()
  else next(new UserIsNotAuthenticatedError())
}
