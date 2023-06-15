import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../models/User'
import { UserIsNotAuthorizedError } from '../errors'
import { projectUserRepository } from '../repositories'

export async function isProjectMemberOrAdmin(req: Request, _: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const userRole = req.session.userRole as UserRole
  const projectId = req.params.projectId

  if (userRole === 'admin') return next()

  const isProjectMember = await projectUserRepository.checkIfUserIsAssignedToProject(projectId, userId)

  if (!isProjectMember) return next(new UserIsNotAuthorizedError())
  return next()
}