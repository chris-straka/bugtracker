import type {
  IProjectRepository,
  IProjectUserRepository,
  ITicketRepository,
  ITicketUserRepository,
} from '../../repositories'
import {
  ProjectNotFoundError,
  TicketNotFoundError,
  UserNotFoundError,
  UserIsAlreadyAssignedToThisProjectError,
  UserIsNotAssignedToThisProjectError,
} from '../../errors'

export class TicketUserService {
  #projectDb: IProjectRepository
  #projectUserDb: IProjectUserRepository
  #ticketDb: ITicketRepository
  #tickerUserDb: ITicketUserRepository

  constructor(
    projectDb: IProjectRepository,
    projectUserDb: IProjectUserRepository,
    ticketDb: ITicketRepository,
    ticketUserDb: ITicketUserRepository,
  ) {
    this.#projectDb = projectDb
    this.#projectUserDb = projectUserDb
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

    // you can only work a ticket on a project you belong to
    const isProjectMember = await this.#projectUserDb.checkIfUserIsAssignedToProject(projectId, userId)
    if (!isProjectMember) throw new UserIsNotAssignedToThisProjectError()

    const isAlreadyOnTicket = await this.#tickerUserDb.checkIfUserIsAssignedToTicket(ticketId, userId)
    if (isAlreadyOnTicket) throw new UserIsAlreadyAssignedToThisProjectError()

    return this.#tickerUserDb.addUserToTicket(ticketId, userId)
  }

  async removeUserFromTicket(projectId: string, ticketId: string, userId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const removed = await this.#tickerUserDb.removeUserFromTicket(ticketId, userId)
    if (!removed) throw new UserNotFoundError()

    return removed
  }
}
