import type { IProjectRepository, ITicketRepository, IUserRepository } from '../../repositories'
import type { TicketPriority, TicketStatus, TicketType } from '../../models/Ticket'
import type { UserRole } from '../../models/User'
import { ProjectNotFoundError, TicketNotFoundError, UserIsNotAuthorizedError, UserNotFoundError } from '../../errors'

export class TicketService {
  #projectDb: IProjectRepository
  #ticketDb: ITicketRepository
  #userDb: IUserRepository

  constructor(projectDb: IProjectRepository, ticketDb: ITicketRepository, userDb: IUserRepository) {
    this.#projectDb = projectDb
    this.#ticketDb = ticketDb
    this.#userDb = userDb
  }

  async createProjectTicket(
    projectId: string, 
    ownerId: string, 
    name: string, 
    description: string, 
    priority: TicketPriority,
    type: TicketType, 
    status?: TicketStatus
  ) {
    return await this.#ticketDb.createTicket(projectId, ownerId, name, description, priority, type, status)
  }

  async getProjectTickets(projectId: string) {
    const project = await this.#projectDb.getProjectBy('id', projectId)
    if (!project) throw new ProjectNotFoundError()
    return await this.#ticketDb.getProjectTickets(projectId)
  }

  async getUserAssignedTickets(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsBy('id', userId)
    if (!user) throw new UserNotFoundError()

    const tickets = await this.#ticketDb.getUserAssignedTickets(userId, cursor, limit)
    const newCursor = tickets.length > 0 ? tickets[tickets.length].id : null

    return { tickets, newCursor }
  }

  async getUserCreatedTickets(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsBy('id', userId)
    if (!user) throw new UserNotFoundError()

    const tickets = await this.#ticketDb.getUserCreatedTickets(userId, cursor, limit)
    const newCursor = tickets.length > 0 ? tickets[tickets.length].id : null

    return { tickets, newCursor }
  }

  async updateProjectTicket(
    ticketId: string,
    userId: string,
    userRole: UserRole,
    name?: string,
    description?: string,
    priority?: TicketPriority,
    type?: TicketType,
    status?: TicketStatus
  ) {
    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const isTicketOwner = ticket.owner_id.toString() === userId

    if (isTicketOwner && userRole === 'contributor') {
      return await this.#ticketDb.updateTicket(ticketId, name, description, priority, type, status)
    }

    // if you're not the owner, only the dev/pm/admin can update
    if (
      userRole !== 'developer' && 
    userRole !== 'project_manager' &&
    userRole !== 'admin'
    ) {
      throw new UserIsNotAuthorizedError()
    }

    return await this.#ticketDb.updateTicket(ticketId, name, description, priority, type, status)
  }

  async deleteProjectTicket(ticketId: string, userId: string, userRole: UserRole) {
    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const isTicketOwner = ticket.owner_id.toString() === userId

    if (!isTicketOwner || userRole !== 'admin' && userRole !== 'project_manager') {
      throw new UserIsNotAuthorizedError()
    }

    await this.#ticketDb.deleteTicket(ticketId)
  }
}
