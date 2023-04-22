import type { Request, Response, NextFunction } from 'express'
import { UserIsNotAuthorizedError } from '../errors'

export function isAuthorized (authorizedRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const authorized = authorizedRoles.some((authorizedRole) =>  authorizedRole === req.session.userRole)
    if (!authorized) return next(new UserIsNotAuthorizedError())

    next()
  }
} 