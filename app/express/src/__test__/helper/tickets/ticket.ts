import { faker } from '@faker-js/faker'
import type { TicketPriority, TicketType, TicketStatus } from '../../../models/Ticket'
import { ticketRepository } from '../../../repositories'

export async function createTicket(
  projectId: string, 
  ownerId: string, 
  name = faker.lorem.sentence(),
  description = faker.lorem.paragraph(),
  priority: TicketPriority = 'low',
  type: TicketType = 'bug',
  status: TicketStatus = 'open'
) {
  const ticket = await ticketRepository.createTicket(projectId, ownerId, name, description, priority, type, status)
  return { ...ticket, id: ticket.id.toString() }
}

export async function createTickets(projectId: string, ownerId: string, numberOfTickets: number, description?: string) {
  const promises = Array.from(
    { length: numberOfTickets }, 
    () => createTicket(projectId, ownerId, faker.lorem.sentence(), description)
  )
  
  return await Promise.all(promises)
}

