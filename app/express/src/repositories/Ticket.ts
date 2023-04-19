import { db } from '../config/postgres'
import { TicketPriority, TicketType } from '../types'

async function createTicket(
  name: string, 
  description: string, 
  priority: TicketPriority,
  type: TicketType,
  project_id: string,
  owner_id: string
) {
  const result = await db.query({
    name: 'create_ticket',
    text: 'INSERT INTO tickets(name, description, priority, type) VALUES ($1, $2, $3, $4) RETURNING *;',
    values: [name, description, priority, type, project_id, owner_id],
  })
  return result.rows[0]
}

async function editTicket(
  id: string, 
  // name: string, 
  // description: string,
) {
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
    text: 'DELETE FROM tickets WHERE id = $1;',
    values: [id],
  })
  return result.rows[0]
}

async function createTicketComment(ticket_id: string, owner_id: string, description: string) {
  const result = await db.query({
    name: 'create_ticket_comment',
    text: 'INSERT INTO ticker_comments(ticket_id, owner_id, description) VALUES ($1, $2, $3) RETURNING *;',
    values: [ticket_id, owner_id, description]
  })
  return result.rows[0]
}

export default {
  createTicket,
  editTicket,
  deleteTicketById,
  createTicketComment
}