import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../../models/User'
import { ticketCommentService } from '../../services'
import { routeParam } from '../../utility'

// GET /projects/:projectId/tickets/:ticketId/comments
export async function getTicketComments(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)

  try {
    const ticketComments = await ticketCommentService.getTicketComments(projectId, ticketId)
    res.status(200).send(ticketComments)
  } catch (error) {
    return next(error)
  }
}

// POST /projects/:projectId/tickets/:ticketId/comments
export async function createTicketComment(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)
  const userId = req.session.userId as string
  const comment = req.body.comment

  try {
    const ticketComment = await ticketCommentService.createTicketComment(projectId, ticketId, userId, comment)
    res.status(201).send(ticketComment)
  } catch (error) {
    return next(error)
  }
}

// PUT /projects/:projectId/tickets/:ticketId/comments/:commentId
export async function updateTicketComment(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)
  const commentId = routeParam(req.params.commentId)
  const userId = req.session.userId as string
  const userRole = req.session.userRole as UserRole
  const comment = req.body.comment

  try {
    const ticketComments = await ticketCommentService.updateTicketComment(
      projectId,
      ticketId,
      commentId,
      userId,
      userRole,
      comment,
    )
    res.status(200).send(ticketComments)
  } catch (error) {
    return next(error)
  }
}

// DELETE /projects/:projectId/tickets/:ticketId/comments/:commentId
export async function deleteTicketComment(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)
  const commentId = routeParam(req.params.commentId)

  try {
    await ticketCommentService.deleteTicketComment(projectId, ticketId, commentId)
    res.status(204).send()
  } catch (error) {
    return next(error)
  }
}
