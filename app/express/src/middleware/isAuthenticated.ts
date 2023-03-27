import type { Request, Response, NextFunction } from 'express'

export const isAuthenticated = (req: Request, _: Response, next: NextFunction): void => {
  if (req.session.user != null) next()
  else next('route')
}
