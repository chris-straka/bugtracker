import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../models/User'
import { UserIsNotAssignedToThisProjectError } from '../errors'
import { getRequestAuth } from '../utility'

export function isAuthorized(authorizedRoles: UserRole[]) {
  return function (req: Request, _: Response, next: NextFunction) {
    // A role check only needs the role: prefer the unified identity, but still
    // honor a session that carries just the role (see isAuthorized.test.ts).
    const userRole = getRequestAuth(req)?.userRole ?? req.session?.userRole
    const authorized = authorizedRoles.some((authorizedRole) => authorizedRole === userRole)
    if (!authorized) return next(new UserIsNotAssignedToThisProjectError())

    return next()
  }
}
