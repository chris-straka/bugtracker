import type { Request, Response, NextFunction } from 'express'
import { projectCommentRepository } from '../repositories'
import { ProjectCommentNotFoundError } from '../errors'
import { routeParam } from '../utility'

export async function projectCommentExists(req: Request, _: Response, next: NextFunction) {
  const commentId = routeParam(req.params.commentId)

  const projectCommentExists = await projectCommentRepository.projectCommentExists(commentId)
  if (!projectCommentExists) return next(new ProjectCommentNotFoundError())

  return next()
}
