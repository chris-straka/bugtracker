import type { Request, Response, NextFunction } from 'express'

export function isAuthenticated (req: Request, _: Response, next: NextFunction) {
  if (req.session) next()
  else next('route')
}
