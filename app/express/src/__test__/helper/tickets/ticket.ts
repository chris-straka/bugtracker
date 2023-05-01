import { faker } from '@faker-js/faker'
import { TicketType, TicketPriority } from '../../../types'
import TicketRepository from '../../../repositories/ticket'

export async function createTicket(
  projectId: string, 
  ownerId: string, 
  priority: TicketPriority = 'low',
  type: TicketType = 'bug',
) {
  const ticket = await TicketRepository.createTicket(
    faker.lorem.sentence(), 
    faker.lorem.paragraph(), 
    priority, 
    type, 
    projectId, 
    ownerId
  )

  return { ...ticket, id: ticket.id.toString() }
}

export async function createTickets(numberOfTickets: number, projectId: string, ownerId: string) {
  const tickets = []

  for (let i = 0; i < numberOfTickets; i++) {
    const ticket = await createTicket(projectId, ownerId)
    tickets.push(ticket)
  }

  return tickets
}
