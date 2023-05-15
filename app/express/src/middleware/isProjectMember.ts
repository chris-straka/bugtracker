import type { Request, Response, NextFunction } from 'express'
import { UserIsNotAuthorizedError } from '../errors'
import ProjectRepository from '../repositories/projects'
import { Roles } from '../types'

export async function isProjectMemberOrAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const userRole = req.session.userRole as Roles
  const projectId = req.params.projectId

  if (userRole === 'admin') return next()

  const isProjectMember = await ProjectRepository.checkIfUserIsAssignedToProject(projectId, userId)

  if (!isProjectMember) return next(new UserIsNotAuthorizedError())
  return next()
}