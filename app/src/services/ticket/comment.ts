import type { ITicketRepository, ITicketCommentRepository, IProjectRepository } from '../../repositories'
import type { UserRole } from '../../models/User'
import {
  ProjectNotFoundError,
  TicketNotFoundError,
  TicketCommentNotFoundError,
  UserIsNotTheOwnerOfThisCommentError,
} from '../../errors'

export class TicketCommentService {
  #projectDb: IProjectRepository
  #ticketDb: ITicketRepository
  #ticketCommentDb: ITicketCommentRepository

  constructor(
    projectDb: IProjectRepository,
    ticketDb: ITicketRepository,
    ticketCommentDb: ITicketCommentRepository,
  ) {
    this.#projectDb = projectDb
    this.#ticketDb = ticketDb
    this.#ticketCommentDb = ticketCommentDb
  }

  async createTicketComment(projectId: string, ticketId: string, userId: string, comment: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    return this.#ticketCommentDb.createTicketComment(ticketId, userId, comment)
  }

  async getTicketComments(projectId: string, ticketId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    return this.#ticketCommentDb.getTicketComments(ticketId)
  }

  async updateTicketComment(
    projectId: string,
    ticketId: string,
    commentId: string,
    userId: string,
    userRole: UserRole,
    comment: string,
  ) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const ticketComment = await this.#ticketCommentDb.getTicketCommentById(commentId)
    if (!ticketComment) throw new TicketCommentNotFoundError()

    // admins, owners and project managers can edit anyone's comment
    const canEditAnyComment = userRole === 'admin' || userRole === 'owner' || userRole === 'project_manager'

    if (!canEditAnyComment && userId !== ticketComment.owner_id.toString()) {
      throw new UserIsNotTheOwnerOfThisCommentError()
    }

    await this.#ticketCommentDb.updateTicketComment(commentId, comment)
  }

  async deleteTicketComment(projectId: string, ticketId: string, commentId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const ticketComment = await this.#ticketCommentDb.getTicketCommentById(commentId)
    if (!ticketComment) throw new TicketCommentNotFoundError()

    await this.#ticketCommentDb.deleteTicketComment(commentId)
  }
}
