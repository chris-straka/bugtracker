import type { NextFunction, Request, Response } from 'express'
import { ticketUserService } from '../../services'
import { routeParam } from '../../utility'

// GET /projects/:projectId/tickets/:ticketId/users
export async function getTicketUsers(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)

  try {
    const users = await ticketUserService.getTicketUsers(projectId, ticketId)
    res.status(200).send(users)
  } catch (error) {
    return next(error)
  }
}

// POST /projects/:projectId/tickets/:ticketId/users
export async function addUserToTicket(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)
  // the user being assigned, not the caller
  const userId = String(req.body.userId)

  try {
    await ticketUserService.addUserToTicket(projectId, ticketId, userId)
    res.status(201).send()
  } catch (error) {
    return next(error)
  }
}

// DELETE /projects/:projectId/tickets/:ticketId/users/:userId
export async function removeUserFromTicket(req: Request, res: Response, next: NextFunction) {
  const projectId = routeParam(req.params.projectId)
  const ticketId = routeParam(req.params.ticketId)
  // the user being unassigned, not the caller
  const userId = routeParam(req.params.userId)

  try {
    await ticketUserService.removeUserFromTicket(projectId, ticketId, userId)
    res.status(204).send()
  } catch (error) {
    return next(error)
  }
}
