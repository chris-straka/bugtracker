import { ProjectNotFoundError, TicketNotFoundError } from '../../errors'
import { ProjectRepository } from '../../repositories/projects'
import { TicketRepository, TicketUserRepository } from '../../repositories/tickets'

async function getTicketUsers(projectId: string, ticketId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  return await TicketUserRepository.getTicketUsers(ticketId)
}

async function addUserToTicket(projectId: string, ticketId: string, userId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  return await TicketUserRepository.addUserToTicket(ticketId, userId)
}

async function removeUserFromTicket(projectId: string, ticketId: string, userId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  return await TicketUserRepository.removeUserFromTicket(ticketId, userId)
}

export default {
  getTicketUsers,
  addUserToTicket,
  removeUserFromTicket
}
