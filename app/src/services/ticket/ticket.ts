import type { IProjectRepository, ITicketRepository, IUserRepository } from '../../repositories'
import type { TicketPriority, TicketStatus, TicketType } from '../../models/Ticket'
import type { UserRole } from '../../models/User'
import {
  ProjectNotFoundError,
  TicketAlreadyExistsError,
  UserIsNotAuthorizedError,
  UserNotFoundError,
} from '../../errors'

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
    priority: TicketPriority = 'none',
    type: TicketType = 'bug',
    status: TicketStatus = 'open',
    assigneeIds: string[] = [],
  ) {
    const ticketAlreadyExists = await this.#ticketDb.ticketExistsByName(name)
    if (ticketAlreadyExists) throw new TicketAlreadyExistsError()

    if (assigneeIds.length > 0) {
      return this.#ticketDb.createTicketWithAssignees(
        projectId,
        ownerId,
        name,
        description,
        priority,
        type,
        status,
        assigneeIds,
      )
    }

    return this.#ticketDb.createTicket(projectId, ownerId, name, description, priority, type, status)
  }

  async getProjectTickets(projectId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()
    return this.#ticketDb.getProjectTickets(projectId)
  }

  async getUserAssignedTickets(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsById(userId)
    if (!user) throw new UserNotFoundError()

    const tickets = await this.#ticketDb.getUserAssignedTickets(userId, cursor, limit)
    const nextCursor = tickets.length > 0 ? tickets[tickets.length - 1].id : null

    return { tickets, nextCursor }
  }

  async getUserCreatedTickets(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsById(userId)
    if (!user) throw new UserNotFoundError()

    const tickets = await this.#ticketDb.getUserCreatedTickets(userId, cursor, limit)
    const nextCursor = tickets.length > 0 ? tickets[tickets.length - 1].id : null

    return { tickets, nextCursor }
  }

  async updateTicket(
    ticketId: string,
    userId: string,
    userRole: UserRole,
    name?: string,
    description?: string,
    priority?: TicketPriority,
    type?: TicketType,
    status?: TicketStatus,
  ) {
    // These users can edit any ticket they want
    const rolesWithFullAccess: UserRole[] = ['developer', 'project_manager', 'admin', 'owner']
    const hasFullAccess = rolesWithFullAccess.includes(userRole)

    const ticketOwnerId = await this.#ticketDb.getTicketOwnerId(ticketId)
    const isTicketOwner = userId === ticketOwnerId

    const isContributorAndTicketOwner = userRole === 'contributor' && isTicketOwner

    if (hasFullAccess || isContributorAndTicketOwner)
      return this.#ticketDb.updateTicket(ticketId, name, description, priority, type, status)

    throw new UserIsNotAuthorizedError()
  }

  async deleteTicket(ticketId: string, userId: string, userRole: UserRole) {
    const ticketOwnerId = await this.#ticketDb.getTicketOwnerId(ticketId)
    const isTicketOwner = userId === ticketOwnerId

    const rolesWithFullAccess: UserRole[] = ['project_manager', 'admin', 'owner']
    const hasFullAccess = rolesWithFullAccess.includes(userRole)

    if (isTicketOwner || hasFullAccess) return this.#ticketDb.deleteTicket(ticketId)

    throw new UserIsNotAuthorizedError()
  }
}
