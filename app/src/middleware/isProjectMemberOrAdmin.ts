import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../models/User'
import { UserIsNotAssignedToThisProjectError } from '../errors'
import { projectUserRepository } from '../repositories'
import { getRequestAuth, routeParam } from '../utility'

export async function isProjectMemberOrAdmin(req: Request, _: Response, next: NextFunction) {
  const userId = getRequestAuth(req)?.userId as string
  const userRole = getRequestAuth(req)?.userRole as UserRole
  const projectId = routeParam(req.params.projectId) as string

  if (userRole === 'admin' || userRole === 'owner') return next()

  const isProjectMember = await projectUserRepository.checkIfUserIsAssignedToProject(projectId, userId)
  if (!isProjectMember) return next(new UserIsNotAssignedToThisProjectError())

  return next()
}
