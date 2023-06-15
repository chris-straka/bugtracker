import type { TestTicket } from '../types'
import type { UserRole } from '../../../models/User'
import { createNewUserAndAddThemToProject } from '../project'
import { ticketUserRepository } from '../../../repositories'

export async function addUserToTicket(userId: string, ticketId: string) {
  return await ticketUserRepository.addUserToTicket(ticketId, userId)
}

export async function addUserToTickets(userId: string, tickets: TestTicket[]) {
  for(const ticket of tickets) {
    await ticketUserRepository.addUserToTicket(ticket.id, userId)
  }
}

export async function createNewUserAndAddThemToTicket(projectId: string, ticketId: string, role?: UserRole) {
  const user = await createNewUserAndAddThemToProject(projectId, role)
  await ticketUserRepository.addUserToTicket(ticketId, user.id)
  return user
}

export async function createNewUserAndAddThemToTickets(projectId: string, tickets: TestTicket[], role?: UserRole) {
  const user = await createNewUserAndAddThemToProject(projectId, role)
  await addUserToTickets(user.id, tickets)
  return user
}

export async function createNewUsersAndAddThemToTicket(projectId: string, ticketId: string, numberOfUsers: number) {
  const ticketUsers = []

  for (let i = 0; i < numberOfUsers; i++) {
    const ticketUser = await createNewUserAndAddThemToTicket(projectId, ticketId)
    ticketUsers.push(ticketUser)
  }

  return ticketUsers
}
