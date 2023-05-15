import type { Request, Response, NextFunction } from 'express'
import { AdminTicketService } from '../../../services/admin'

// GET /admin/tickets
export async function adminSearchTickets(req: Request, res: Response, next: NextFunction) {
  const { limit, search } = req.body

  try {
    const projects = await AdminTicketService.adminSearchTickets(limit, search)
    res.status(200).send(projects)
  } catch (error) {
    next(error) 
  }
}