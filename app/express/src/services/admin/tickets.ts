import { ITicketRepository } from '../../repositories/tickets'

export class AdminTicketService {
  #ticketDb: ITicketRepository

  constructor(ticketDb: ITicketRepository) {
    this.#ticketDb = ticketDb 
  }

  async searchAllTickets(limit: string, search: string) { 
    console.log(limit)
    console.log(search)
  }
}
