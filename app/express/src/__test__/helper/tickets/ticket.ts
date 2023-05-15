import { faker } from '@faker-js/faker'
import { TicketType, TicketPriority, TicketStatus } from '../../../types'
import { TicketRepository } from '../../../repositories/tickets'

export async function createTicket(
  projectId: string, 
  ownerId: string, 
  name = faker.lorem.sentence(),
  description = faker.lorem.paragraph(),
  priority: TicketPriority = 'low',
  type: TicketType = 'bug',
  status: TicketStatus = 'open'
) {
  const ticket = await TicketRepository.createTicket(
    projectId, 
    ownerId,
    name,
    description,
    priority, 
    type, 
    status
  )

  return { ...ticket, id: ticket.id.toString() }
}

export async function createTickets(projectId: string, ownerId: string, numberOfTickets: number, description?: string) {
  const tickets = []

  for (let i = 0; i < numberOfTickets; i++) {
    const ticket = await createTicket(
      projectId, 
      ownerId, 
      faker.lorem.sentence(),
      description
    )

    tickets.push(ticket)
  }

  return tickets
}

export async function createTicketsAndAssignUser(numberOfTickets: number, projectId: string, ownerId: string) {
  const tickets = []

  for (let i = 0; i < numberOfTickets; i++) {
    const ticket = await createTicket(projectId, ownerId)
    tickets.push(ticket)
  }

  return tickets
}
