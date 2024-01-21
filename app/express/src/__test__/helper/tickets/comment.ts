import { faker } from '@faker-js/faker'
import { ticketCommentRepository } from '../../../repositories'

export async function createTicketComment(
  ticketId: string, 
  ownerId: string,
  message: string = faker.random.words(30)
) {
  return ticketCommentRepository.createTicketComment(ticketId, ownerId, message)
}

export async function createTicketComments(ticketId: string, ownerId: string, numberOfTicketComments: number) {
  const ticketComments = []

  for (let i = 0; i < numberOfTicketComments; i++) {
    const ticketComment = await createTicketComment(ticketId, ownerId)
    ticketComments.push(ticketComment)
  }

  return ticketComments
}