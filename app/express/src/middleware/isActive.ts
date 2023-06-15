import type { Request, Response, NextFunction } from 'express'
import { UserIsSuspended, UserIsDisabled } from '../errors'
import { userRepository } from '../repositories'

/** 
 * An admin can disable or suspend a user
 * This checks whether or not they're currently disabled
 */
export async function accountIsActive(req: Request, _: Response, next: NextFunction) {
  const userId = req.session?.userId as string
  const { account_status } = await userRepository.getUserAccountStatus(userId)

  if (account_status === 'active') return next()
  if (account_status === 'suspended') return next(new UserIsSuspended())
  if (account_status === 'disabled') return next(new UserIsDisabled())
}
