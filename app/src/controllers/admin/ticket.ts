import type { Request, Response, NextFunction } from 'express'
import { adminTicketService } from '../../services'

// GET /admin/tickets
export async function searchAllTickets(req: Request, res: Response, next: NextFunction) {
  const search = req.query.search as string | undefined
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const tickets = await adminTicketService.searchAllTickets(search, cursor, limit)
    res.status(200).send(tickets)
  } catch (error) {
    return next(error)
  }
}
