import { faker } from '@faker-js/faker'
import TicketRepository from '../../../repositories/ticket'

export async function createTicketComment(
  ticketId: string, 
  ownerId: string,
  message: string = faker.random.words(30)
) {
  return await TicketRepository.createTicketComment(ticketId, ownerId, message)
}

export async function createTicketComments(numberOfTicketComments: number, ticketId: string, ownerId: string) {
  for (let i = 0; i < numberOfTicketComments; i++) {
    await createTicketComment(ticketId, ownerId)
  }
}