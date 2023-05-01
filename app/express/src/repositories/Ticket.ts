import { db } from '../config/postgres'
import { Ticket } from '../models/Ticket'
import { TicketPriority, TicketType } from '../types'

async function createTicket(
  name: string, 
  description: string, 
  priority: TicketPriority,
  type: TicketType,
  project_id: string,
  owner_id: string
): Promise<Ticket> {
  const result = await db.query({
    name: 'create_ticket',
    text: 'INSERT INTO ticket(name, description, priority, type) VALUES ($1, $2, $3, $4) RETURNING *;',
    values: [name, description, priority, type, project_id, owner_id],
  })
  return result.rows[0]
}

async function editTicket(id: string) {
  const result = await db.query({
    name: 'edit_ticket',
    text: '',
    values: [id],
  })
  return result.rows[0]
}

async function deleteTicketById(id: string) {
  const result = await db.query({
    name: 'delete_ticket_by_id',
    text: 'DELETE FROM ticket WHERE id = $1;',
    values: [id],
  })
  return result.rows[0]
}

async function createTicketComment(ticketId: string, ownerId: string, description: string) {
  const result = await db.query({
    name: 'create_ticket_comment',
    text: 'INSERT INTO ticker_comment(ticket_id, owner_id, description) VALUES ($1, $2, $3) RETURNING *;',
    values: [ticketId, ownerId, description]
  })
  return result.rows[0]
}

// double check the SQL here my guy
async function createTicketAssignment(ticketId: string, userId: string) {
  const result = await db.query({
    name: 'create_ticket_assignment',
    text: 'INSERT INTO ticket_assignment VALUES ($1, $2) RETURNING *;',
    values: [ticketId, userId]
  })
  return result.rows[0]
}

export default {
  createTicket,
  editTicket,
  deleteTicketById,
  createTicketComment,
  createTicketAssignment
}