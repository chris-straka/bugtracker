import { NextFunction, Request, Response } from 'express'
import { ProjectCommentService } from '../../services/projects'
import { Roles } from '../../types'

// GET /projects/:projectId/comments
export async function getProjectComments(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId 

  try {
    const projectComments = await ProjectCommentService.getProjectComments(projectId)
    res.status(200).send(projectComments)
  } catch (error) {
    return next(error) 
  }
}

// POST /projects/:projectId/comments
export async function createProjectComment(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId 
  const userId = req.session.userId as string
  const comment = req.body.comment

  try {
    const projectComment = await ProjectCommentService.createProjectComment(projectId, userId, comment)
    res.status(201).send(projectComment)
  } catch (error) {
    return next(error) 
  }
}

// PUT /projects/:projectId/comments/:commentId
export async function updateProjectComment(req: Request, res: Response, next: NextFunction) {
  const commentId = req.params.commentId
  const userId = req.session.userId as string
  const userRole = req.session.userRole as Roles
  const newComment = req.body.comment

  try {
    await ProjectCommentService.updateProjectComment(commentId, userId, userRole, newComment)
    res.status(200).send()
  } catch (error) {
    return next(error) 
  }
}

// DELETE /projects/:projectId/comments/:commentId
export async function deleteProjectComment(req: Request, res: Response, next: NextFunction) {
  const commentId = req.params.commentId 
  const userId = req.session.userId as string
  const userRole = req.session.userRole as Roles

  try {
    await ProjectCommentService.deleteProjectComment(commentId, userId, userRole)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}