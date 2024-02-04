import type { Request, Response, NextFunction } from 'express'
import { ticketRepository } from '../repositories'
import { TicketNotFoundError } from '../errors'

export async function ticketExists(req: Request, _: Response, next: NextFunction) {
  const ticketId = req.params.ticketId

  const ticketExists = await ticketRepository.ticketExistsById(ticketId)
  if (!ticketExists) return next(new TicketNotFoundError())

  return next()
}