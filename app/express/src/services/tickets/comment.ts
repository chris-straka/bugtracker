import { ProjectNotFoundError, TicketNotFoundError, TicketCommentNotFoundError } from '../../errors'
import { TicketCommentRepository , TicketRepository } from '../../repositories/tickets'
import { ProjectRepository } from '../../repositories/projects'

async function createTicketComment(projectId: string, ticketId: string, userId: string, comment: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  return await TicketCommentRepository.createTicketComment(projectId, userId, comment)
}

async function getTicketComments(projectId: string, ticketId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()
}

async function updateTicketComment(projectId: string, ticketId: string, commentId: string, comment: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  const ticketComment = await TicketCommentRepository.getTicketCommentById(commentId)
  if (!ticketComment) throw new TicketCommentNotFoundError()

  await TicketCommentRepository.updateTicketComment(commentId, comment)
}

async function deleteTicketComment(projectId: string, ticketId: string, commentId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  const ticketComment = await TicketCommentRepository.getTicketCommentById(commentId)
  if (!ticketComment) throw new TicketCommentNotFoundError()

  await TicketCommentRepository.deleteTicketComment(ticketId)
}

export default {
  createTicketComment,
  getTicketComments,
  updateTicketComment,
  deleteTicketComment
}