import type { Request, Response, NextFunction } from 'express'
import { RoleDoesNotExistError, UserIsNotAuthorizedError } from '../errors'

export function isAuthorized (authorizedRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const userRole = req.session.userRole
    if (!userRole) return next(new RoleDoesNotExistError())

    const authorized = authorizedRoles.some((authorizedRole) =>  authorizedRole === userRole)
    if (!authorized) return next(new UserIsNotAuthorizedError())

    next()
  }
} 