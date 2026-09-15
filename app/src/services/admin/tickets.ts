import { ITicketRepository } from '../../repositories/tickets'

export class AdminTicketService {
  #ticketDb: ITicketRepository

  constructor(ticketDb: ITicketRepository) {
    this.#ticketDb = ticketDb
  }

  async searchAllTickets(search?: string, cursor?: string, limit?: string) {
    const tickets = await this.#ticketDb.searchAllTickets(search, cursor, limit)
    const nextCursor = tickets.length > 0 ? tickets[tickets.length - 1].id : null

    return { tickets, nextCursor }
  }
}
