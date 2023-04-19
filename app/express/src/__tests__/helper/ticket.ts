import { faker } from '@faker-js/faker'
import { TicketPriority, TicketType } from '../../types'
import TicketRepository from '../../repositories/ticket'

export async function createRandomTicket(
  project_id: string, 
  owner_id: string, 
  priority: TicketPriority = 'low',
  type: TicketType = 'bug',
) {
  const name = faker.lorem.sentence()
  const description = faker.lorem.paragraph()
  return await TicketRepository.createTicket(name, description, priority, type, project_id, owner_id)
}

export async function createTicketComment(
  ticket_id: string, 
  owner_id: string,
  description: string
) {
  await TicketRepository.createTicketComment(ticket_id, owner_id, description)
}
