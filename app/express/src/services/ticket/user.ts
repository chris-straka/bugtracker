import type { IProjectRepository, ITicketRepository, ITicketUserRepository } from '../../repositories'
import { ProjectNotFoundError, TicketNotFoundError } from '../../errors'

export class TicketUserService {
  #projectDb: IProjectRepository
  #ticketDb: ITicketRepository
  #tickerUserDb: ITicketUserRepository

  constructor(projectDb: IProjectRepository, ticketDb: ITicketRepository, ticketUserDb: ITicketUserRepository) {
    this.#projectDb = projectDb
    this.#ticketDb = ticketDb
    this.#tickerUserDb = ticketUserDb
  }

  async getTicketUsers(projectId: string, ticketId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    return this.#tickerUserDb.getTicketUsers(ticketId)
  }

  async addUserToTicket(projectId: string, ticketId: string, userId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    return this.#tickerUserDb.addUserToTicket(ticketId, userId)
  }

  async removeUserFromTicket(projectId: string, ticketId: string, userId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    return this.#tickerUserDb.removeUserFromTicket(ticketId, userId)
  }
}
