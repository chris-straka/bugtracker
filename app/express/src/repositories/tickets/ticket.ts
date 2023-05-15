import { db } from '../../config/postgres'
import { Ticket } from '../../models/Ticket'
import { TicketPriority, TicketStatus, TicketType } from '../../types'

async function createTicket(
  projectId: string,
  ownerId: string,
  name: string, 
  description: string, 
  priority: TicketPriority,
  type: TicketType,
  status: TicketStatus = 'open'
): Promise<Ticket> {
  const result = await db.query({
    name: 'create_ticket',
    text: `
      INSERT INTO ticket(project_id, owner_id, name, description, priority, type, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `,
    values: [projectId, ownerId, name, description, priority, type, status],
  })
  return result.rows[0]
}

async function getProjectTickets(projectId: string) {
  const result = await db.query({
    name: 'create_ticket',
    text: 'SELECT * FROM ticket WHERE project_id = $1;',
    values: [projectId],
  })
  return result.rows
}

async function getTicketById(ticketId: string): Promise<Ticket> {
  const result = await db.query({
    name: 'create_ticket',
    text: 'SELECT 1 FROM ticket WHERE id = $1;',
    values: [ticketId],
  })
  return result.rows[0]
}

async function getTicketByName(name: string): Promise<Ticket> {
  const result = await db.query({
    name: 'create_ticket',
    text: 'SELECT 1 FROM ticket WHERE name = $1;',
    values: [name],
  })
  return result.rows[0]
}

async function getUserAssignedTickets(userId: string, cursor = '0', limit = '10') {
  const result = await db.query({
    name: 'get_user_assigned_tickets',
    text: `
      SELECT t.*
      FROM ticket_user tu
      JOIN ticket t ON t.id = tu.ticket_id
      WHERE tu.user_id = $1 AND t.id > $2
      ORDER BY t.id ASC
      LIMIT $3;
    `,
    values: [userId, cursor, limit]
  })

  return result.rows
}

async function getUserCreatedTickets(userId: string, cursor = '0', limit = '10') {
  const result = await db.query({
    name: 'get_user_created_tickets',
    text: `
      SELECT t.id, t.name, t.description, t.project_id, t.type, t.status, t.priority
      FROM ticket t
      WHERE t.owner_id = $1 AND t.id > $2
      LIMIT $3;
    `,
    values: [userId, cursor, limit]
  })
  return result.rows
}

type TicketStatistics = { 
  priority: TicketPriority, 
  type: TicketType, 
  status: TicketStatus,
  projectName: string
}

async function getUserAssignedTicketStatistics(userId: string): Promise<TicketStatistics[]> {
  const result = await db.query({
    name: 'get_user_assigned_ticket_statistics',
    text: `
      SELECT t.priority, t.type, t.status, p.name
      FROM ticket t
      JOIN ticket_user tu ON tu.ticket_id = t.id
      JOIN project p ON t.project_id = p.id
      WHERE tu.user_id = $1;
    `,
    values: [userId]
  })

  return result.rows
}

async function updateTicket(
  ticketId: string,
  name?: string,
  description?: string,
  priority?: TicketPriority,
  type?: TicketType,
  status?: TicketStatus
) {
  const fields = []
  const values = []
  
  let counter = 2

  if (name !== undefined) {
    fields.push(`name = $${counter}`)
    values.push(name)
    counter++
  }

  if (description !== undefined) {
    fields.push(`description = $${counter}`)
    values.push(description)
    counter++
  }

  if (status !== undefined) {
    fields.push(`status = $${counter}`)
    values.push(status)
    counter++
  }

  if (priority !== undefined) {
    fields.push(`priority = $${counter}`)
    values.push(priority)
    counter++
  }

  if (type !== undefined) {
    fields.push(`type = $${counter}`)
    values.push(type)
    counter++
  }

  if (status !== undefined) {
    fields.push(`status = $${counter}`)
    values.push(type)
    counter++
  }

  if (fields.length === 0) throw new Error('Nothing was specified')

  const result = await db.query({
    name: 'update_ticket',
    text: `
      UPDATE ticket
      SET ${fields.join(', ')} 
      WHERE project_id = $1 AND user_id = $2
      RETURNING *;
    `,
    values: [ticketId, ...values],
  })

  return result.rows[0]
}

async function deleteTicket(ticketId: string) {
  const result = await db.query({
    name: 'delete_ticket',
    text: 'DELETE FROM ticket WHERE id = $1;',
    values: [ticketId],
  })
  return result.rows[0]
}

export default {
  createTicket,
  getProjectTickets,
  getTicketById,
  getTicketByName,
  getUserAssignedTickets,
  getUserCreatedTickets,
  getUserAssignedTicketStatistics,
  updateTicket,
  deleteTicket
}