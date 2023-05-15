import { ProjectNotFoundError, TicketNotFoundError, UserIsNotAuthorizedError, UserNotFoundError } from '../../errors'
import UserRepository from '../../repositories/user'
import { TicketRepository } from '../../repositories/tickets'
import { ProjectRepository } from '../../repositories/projects'
import { Roles, TicketPriority, TicketStatus, TicketType } from '../../types'

async function createProjectTicket(
  projectId: string, 
  userId: string, 
  name: string, 
  description: string, 
  priority: TicketPriority,
  type: TicketType, 
  status?: TicketStatus
) {
  return await TicketRepository.createTicket(projectId, userId, name, description, priority, type, status)
}

async function getProjectTickets(projectId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  return await TicketRepository.getProjectTickets(projectId)
}

async function getUserAssignedTickets(userId: string, cursor?: string, limit?: string) {
  const user = await UserRepository.checkIfUserExistsById(userId)
  if (!user) throw new UserNotFoundError()

  const tickets = await TicketRepository.getUserAssignedTickets(userId, cursor, limit)
  const newCursor = tickets.length > 0 ? tickets[tickets.length].id : null

  return { tickets, newCursor }
}

async function getUserCreatedTickets(userId: string, cursor?: string, limit?: string) {
  const user = await UserRepository.checkIfUserExistsById(userId)
  if (!user) throw new UserNotFoundError()

  const tickets = await TicketRepository.getUserCreatedTickets(userId, cursor, limit)
  const newCursor = tickets.length > 0 ? tickets[tickets.length].id : null

  return { tickets, newCursor }
}

async function updateProjectTicket(
  ticketId: string,
  userId: string,
  userRole: Roles,
  name?: string,
  description?: string,
  priority?: TicketPriority,
  type?: TicketType,
  status?: TicketStatus
) {
  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  const isTicketOwner = ticket.owner_id.toString() === userId

  if (isTicketOwner && userRole === 'contributor') {
    return await TicketRepository.updateTicket(ticketId, name, description, priority, type, status)
  }

  if (
    userRole !== 'developer' && 
    userRole !== 'project_manager' &&
    userRole !== 'admin'
  ) {
    throw new UserIsNotAuthorizedError()
  }

  return await TicketRepository.updateTicket(ticketId, name, description, priority, type, status)
}

async function deleteProjectTicket(ticketId: string, userId: string, userRole: Roles) {
  const ticket = await TicketRepository.getTicketById(ticketId)
  if (!ticket) throw new TicketNotFoundError()

  const isTicketOwner = ticket.owner_id.toString() === userId

  if (!isTicketOwner || userRole !== 'admin' && userRole !== 'project_manager') {
    throw new UserIsNotAuthorizedError()
  }

  await TicketRepository.deleteTicket(ticketId)
}

export default {
  getProjectTickets,
  getUserAssignedTickets,
  getUserCreatedTickets,
  createProjectTicket,
  updateProjectTicket,
  deleteProjectTicket
}