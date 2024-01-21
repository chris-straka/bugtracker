import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../models/User'
import { UserIsNotTheOwnerOfThisProjectError } from '../errors'
import { projectUserRepository } from '../repositories'

export async function isProjectOwnerOrAdmin(req: Request, _: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const userRole = req.session.userRole as UserRole
  const projectId = req.params.projectId as string

  if (userRole === 'admin' || userRole === 'owner') return next()

  const isProjectOwner = await projectUserRepository.checkIfUserIsOwnerOfProject(projectId, userId)

  if (!isProjectOwner) return next(new UserIsNotTheOwnerOfThisProjectError())

  return next()
}