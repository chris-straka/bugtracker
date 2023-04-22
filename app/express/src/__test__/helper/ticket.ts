import { faker } from '@faker-js/faker'
import { TicketPriority, TicketType } from '../../types'
import TicketRepository from '../../repositories/ticket'

export async function createTicket(
  projectId: string, 
  ownerId: string, 
  priority: TicketPriority = 'low',
  type: TicketType = 'bug',
) {
  const name = faker.lorem.sentence()
  const description = faker.lorem.paragraph()
  return await TicketRepository.createTicket(name, description, priority, type, projectId, ownerId)
}

export async function createTickets(
  numberOfTickets: number, 
  projectId: string,
  ownerId: string
) {
  for (let i = 0; i < numberOfTickets; i++) {
    await createTicket(projectId, ownerId)
  }
}

export async function createTicketComment(
  ticket_id: string, 
  owner_id: string,
  description: string
) {
  return await TicketRepository.createTicketComment(ticket_id, owner_id, description)
}
