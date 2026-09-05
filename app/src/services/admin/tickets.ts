import { ITicketRepository } from '../../repositories/tickets'

export class AdminTicketService {
  // TODO: searchAllTickets is still a stub; this is the repo it will use.
  // eslint-disable-next-line no-unused-private-class-members
  #ticketDb: ITicketRepository

  constructor(ticketDb: ITicketRepository) {
    this.#ticketDb = ticketDb
  }

  async searchAllTickets(limit: string, search: string) {
    console.log(limit)
    console.log(search)
  }
}
