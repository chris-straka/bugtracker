import type { Request, Response, NextFunction } from 'express'
import { UserIsDisabledError, UserIsNotAuthenticatedError } from '../errors'
import { userRepository } from '../repositories'
import { getRequestAuth } from '../utility'

/** Rejects users whose account an admin has disabled or suspended. */
export async function isActive(req: Request, _: Response, next: NextFunction) {
  const userId = getRequestAuth(req)?.userId
  if (!userId) return next(new UserIsNotAuthenticatedError())

  const { account_status } = await userRepository.getUserAccountStatus(userId)
  if (account_status === 'active') return next()

  return next(new UserIsDisabledError())
}
