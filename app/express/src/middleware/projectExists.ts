import type { Request, Response, NextFunction } from 'express'
import { projectRepository } from '../repositories'
import { ProjectNotFoundError } from '../errors'

export async function projectExists(req: Request, _: Response, next: NextFunction) {
  const projectId = req.params.projectId

  const projectExists = await projectRepository.projectExistsById(projectId)
  if (!projectExists) return next(new ProjectNotFoundError())

  return next()
}