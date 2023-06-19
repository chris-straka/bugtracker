import type { Request, Response, NextFunction } from 'express'
import { UserIsDisabledError, UserIsNotAuthenticatedError } from '../errors'
import { userRepository } from '../repositories'

/** 
 * An admin can disable or suspend a user
 * This checks whether or not they're currently disabled
 */
export async function isActive(req: Request, _: Response, next: NextFunction) {
  if (!req.session?.userId) return next(new UserIsNotAuthenticatedError())

  const userId = req.session.userId

  const { account_status } = await userRepository.getUserAccountStatus(userId)

  if (account_status === 'active') return next()

  return next(new UserIsDisabledError())
}