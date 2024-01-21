import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../models/User'
import { UserIsNotAssignedToThisProjectError } from '../errors'
import { projectUserRepository } from '../repositories'

export async function isProjectMemberOrAdmin(req: Request, _: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const userRole = req.session.userRole as UserRole
  const projectId = req.params.projectId as string

  if (userRole === 'admin' || userRole === 'owner') return next()

  const isProjectMember = await projectUserRepository.checkIfUserIsAssignedToProject(projectId, userId)
  if (!isProjectMember) return next(new UserIsNotAssignedToThisProjectError())

  return next()
}