import type { Request, Response, NextFunction } from 'express'
import { adminTicketService } from '../../services'

// GET /admin/tickets
export async function searchAllTickets(req: Request, res: Response, next: NextFunction) {
  const { limit, search } = req.body

  try {
    const projects = await adminTicketService.searchAllTickets(limit, search)
    res.status(200).send(projects)
  } catch (error) {
    next(error) 
  }
}