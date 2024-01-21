import type { ITicketRepository, ITicketCommentRepository, IProjectRepository } from '../../repositories'
import { ProjectNotFoundError, TicketNotFoundError, TicketCommentNotFoundError } from '../../errors'

export class TicketCommentService {
  #projectDb: IProjectRepository
  #ticketDb: ITicketRepository
  #ticketCommentDb: ITicketCommentRepository

  constructor(projectDb: IProjectRepository, ticketDb: ITicketRepository, ticketCommentDb: ITicketCommentRepository) {
    this.#projectDb = projectDb
    this.#ticketDb = ticketDb
    this.#ticketCommentDb = ticketCommentDb
  }

  async createTicketComment(projectId: string, ticketId: string, userId: string, comment: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    return this.#ticketCommentDb.createTicketComment(projectId, userId, comment)
  }

  async getTicketComments(projectId: string, ticketId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()
  }

  async updateTicketComment(projectId: string, ticketId: string, commentId: string, comment: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const ticketComment = await this.#ticketCommentDb.getTicketCommentById(commentId)
    if (!ticketComment) throw new TicketCommentNotFoundError()

    await this.#ticketCommentDb.updateTicketComment(commentId, comment)
  }

  async deleteTicketComment(projectId: string, ticketId: string, commentId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const ticket = await this.#ticketDb.getTicketById(ticketId)
    if (!ticket) throw new TicketNotFoundError()

    const ticketComment = await this.#ticketCommentDb.getTicketCommentById(commentId)
    if (!ticketComment) throw new TicketCommentNotFoundError()

    await this.#ticketCommentDb.deleteTicketComment(ticketId)
  }
}