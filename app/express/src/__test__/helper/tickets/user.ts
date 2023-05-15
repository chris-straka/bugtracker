import { createNewUserAndAddThemToProject } from '../project'
import { TicketUserRepository } from '../../../repositories/tickets'
import { TestTicket } from '../types'
import { Roles } from '../../../types'

export async function addUserToTicket(userId: string, ticketId: string) {
  return await TicketUserRepository.addUserToTicket(ticketId, userId)
}

export async function addUserToTickets(userId: string, tickets: TestTicket[]) {
  for(const ticket of tickets) {
    await TicketUserRepository.addUserToTicket(ticket.id, userId)
  }
}

export async function createNewUserAndAddThemToTicket(projectId: string, ticketId: string, role?: Roles) {
  const user = await createNewUserAndAddThemToProject(projectId, role)
  await TicketUserRepository.addUserToTicket(ticketId, user.id)
  return user
}

export async function createNewUserAndAddThemToTickets(projectId: string, tickets: TestTicket[], role?: Roles) {
  const user = await createNewUserAndAddThemToProject(projectId, role)
  await addUserToTickets(user.id, tickets)
  return user
}

export async function createNewUsersAndAddThemToTicket(numberOfUsers: number, projectId: string, ticketId: string) {
  const ticketUsers = []

  for (let i = 0; i < numberOfUsers; i++) {
    const ticketUser = await createNewUserAndAddThemToTicket(projectId, ticketId)
    ticketUsers.push(ticketUser)
  }

  return ticketUsers
}

