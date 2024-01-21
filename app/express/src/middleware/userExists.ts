import type { Request, Response, NextFunction } from 'express'
import { userRepository } from '../repositories'
import { UserNotFoundError } from '../errors'

export async function userExists(req: Request, _: Response, next: NextFunction) {
  const userId = req.params.userId

  const userExists = await userRepository.userExistsById(userId)

  if (!userExists) return next(new UserNotFoundError())

  return next()
}