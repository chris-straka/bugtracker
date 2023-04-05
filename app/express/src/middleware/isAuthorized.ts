import type { Request, Response, NextFunction } from 'express'

export function isAuthorized (authorizedUserRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    console.log(authorizedUserRoles)
    console.log(req)
    console.log(res)
    console.log(next)
  }
} 