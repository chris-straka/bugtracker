import type { Request, Response, NextFunction } from 'express'
import { projectCommentRepository } from '../repositories'
import { ProjectNotFoundError } from '../errors'

export async function ticketCommentExists(req: Request, _: Response, next: NextFunction) {
  const commentId = req.params.commentId

  const projectCommentExists = await projectCommentRepository.projectCommentExists(commentId)
  if (!projectCommentExists) return next(new ProjectNotFoundError())

  return next()
}