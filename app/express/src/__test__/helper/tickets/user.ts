import { addUserToProject } from '../project'
import TicketRepository from '../../../repositories/ticket'

export async function assignUserToTicket(projectId: string, ticketId: string) {
  const { agent, id: userId } = await addUserToProject(projectId)
  const ticketAssignment = await TicketRepository.createTicketAssignment(ticketId, userId)

  return { agent, userId, ...ticketAssignment }
}