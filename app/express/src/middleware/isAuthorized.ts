import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../models/User'
import { UserIsNotAssignedToThisProjectError } from '../errors'

export function isAuthorized (authorizedRoles: UserRole[]) {
  return function (req: Request, _: Response, next: NextFunction) {
    const authorized = authorizedRoles.some((authorizedRole) =>  authorizedRole === req.session.userRole)
    if (!authorized) return next(new UserIsNotAssignedToThisProjectError())
    
    return next()
  }
} 