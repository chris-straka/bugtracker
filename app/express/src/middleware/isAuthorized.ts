import type { Request, Response, NextFunction } from 'express'
import { Roles } from '../types'
import { UserIsNotAuthorizedError } from '../errors'

export function isAuthorized (authorizedRoles: Roles[]) {
  return function (req: Request, _: Response, next: NextFunction) {
    const authorized = authorizedRoles.some((authorizedRole) =>  authorizedRole === req.session.userRole)
    if (!authorized) return next(new UserIsNotAuthorizedError())
    return next()
  }
} 