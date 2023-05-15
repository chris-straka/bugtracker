import { faker } from '@faker-js/faker'
import { TicketCommentRepository } from '../../../repositories/tickets'

export async function createTicketComment(
  ticketId: string, 
  ownerId: string,
  message: string = faker.random.words(30)
) {
  const ticketComment = await TicketCommentRepository.createTicketComment(ticketId, ownerId, message)
  return { ...ticketComment, id: ticketComment.id.toString() }
}

export async function createTicketComments(numberOfTicketComments: number, ticketId: string, ownerId: string) {
  const ticketComments = []

  for (let i = 0; i < numberOfTicketComments; i++) {
    const ticketComment = await createTicketComment(ticketId, ownerId)
    ticketComments.push(ticketComment)
  }

  return ticketComments
}