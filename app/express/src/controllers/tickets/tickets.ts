import { NextFunction, Request, Response } from 'express'
import TicketService from '../../services/tickets/ticket'
import { Roles } from '../../types'

// GET /projects/:projectId/tickets
export async function getProjectTickets(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId

  try {
    const tickets = await TicketService.getProjectTickets(projectId)
    res.status(200).send(tickets)
  } catch (error) {
    return next(error) 
  }
}

// POST /projects/:projectId/tickets
export async function createProjectTicket(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const userId = req.session.userId as string
  const name = req.body.name
  const description = req.body.description
  const type = req.body.type
  const priority = req.body.priority
  const status = req.body.status

  try {
    const ticket = await TicketService.createProjectTicket(projectId, userId, name, description, priority, type, status)
    res.status(201).send(ticket)
  } catch (error) {
    return next(error) 
  }
}

// PUT /projects/:projectId/tickets/:ticketId
export async function updateProjectTicket(req: Request, res: Response, next: NextFunction) {
  const ticketId = req.params.ticketId
  const userId = req.session.userId as string
  const userRole = req.session.userRole as Roles
  const name = req.body.name
  const description = req.body.description
  const type = req.body.type
  const priority = req.body.priority
  const status = req.body.status

  try {
    const ticket = TicketService.updateProjectTicket(ticketId, userId, userRole, name, description, type, priority, status)
    res.status(200).send(ticket)
  } catch (error) {
    return next(error) 
  }
}

// DELETE /projects/:projectId/tickets/:ticketId
export async function deleteProjectTicket(req: Request, res: Response, next: NextFunction) {
  const ticketId = req.params.ticketId
  const userId = req.session.userId as string
  const userRole = req.session.userRole as Roles

  try {
    await TicketService.deleteProjectTicket(ticketId, userId, userRole)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}