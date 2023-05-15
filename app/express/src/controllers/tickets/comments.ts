import type { Request, Response, NextFunction } from 'express'
import { TicketCommentService } from '../../services/tickets'

// GET /projects/:projectId/tickets/:ticketId/comments
export async function getTicketComments(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const ticketId = req.params.ticketId

  try {
    const ticketComments = await TicketCommentService.getTicketComments(projectId, ticketId)
    res.status(200).send(ticketComments)
  } catch (error) {
    return next(error) 
  }
}

// POST /projects/:projectId/tickets/:ticketId/comments
export async function createTicketComment(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const ticketId = req.params.ticketId
  const userId = req.session.userId as string
  const comment = req.body.comment

  try {
    const ticketComment = await TicketCommentService.createTicketComment(projectId, ticketId, userId, comment)
    res.status(201).send(ticketComment)
  } catch (error) {
    return next(error) 
  }
}

// PUT /projects/:projectId/tickets/:ticketId/comments/:commentId
export async function updateTicketComment(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const ticketId = req.params.ticketId
  const commentId = req.params.commentId
  const comment = req.body.comment

  try {
    const ticketComments = await TicketCommentService.updateTicketComment(projectId, ticketId, commentId, comment)
    res.status(200).send(ticketComments)
  } catch (error) {
    return next(error) 
  }
}

// DELETE /projects/:projectId/tickets/:ticketId/comments/:commentId
export async function deleteTicketComment(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const ticketId = req.params.ticketId
  const commentId = req.params.commentId

  try {
    const ticketComments = await TicketCommentService.deleteTicketComment(projectId, ticketId, commentId)
    res.status(200).send(ticketComments)
  } catch (error) {
    return next(error) 
  }
}