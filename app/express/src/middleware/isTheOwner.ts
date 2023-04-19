import type { Request, Response, NextFunction } from 'express'
import { UserIsNotAllowedToChangeThisResourceError } from '../errors'

export function isTheOwner(req: Request, _: Response, next: NextFunction) {
  const { userId } = req.params
  const storedSessionId = req.session.userId

  if (storedSessionId === userId) return next() 
  else return next(new UserIsNotAllowedToChangeThisResourceError())
}