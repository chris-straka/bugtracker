import type { Request, Response, NextFunction } from 'express'
import { UserIsNotAllowedToChangeThisResourceError } from '../errors'

export async function isAllowed(req: Request, _: Response, next: NextFunction) {
  const { userId } = req.params
  const storedSessionId = req.session.userId

  if (storedSessionId === userId) next()
  else next(new UserIsNotAllowedToChangeThisResourceError())
}