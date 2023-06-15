import type { Pool } from 'pg'
import type { Ticket, TicketPriority, TicketStatus, TicketType } from '../../models/Ticket'
import type { TicketStatistic } from '../../models/TicketStatistics'

export interface ITicketRepository {
  createTicket(
    projectId: string, 
    ownerId: string, 
    name: string, 
    description: string, 
    priority: TicketPriority, 
    type: TicketType, 
    status?: TicketStatus
  ): Promise<Ticket>

  getTicketById(id: string): Promise<Ticket>

  getProjectTickets(projectId: string): Promise<Ticket[]>

  getUserAssignedTickets(
    userId: string, 
    cursor?: string, 
    limit?: string
  ): Promise<Ticket[]>

  getUserCreatedTickets(
    userId: string, 
    cursor?: string, 
    limit?: string
  ): Promise<Ticket[]>

  getUserAssignedTicketStatistics(userId: string): Promise<TicketStatistic[]>

  updateTicket(
    ticketId: string, 
    name?: string, 
    description?: string, 
    priority?: TicketPriority, 
    type?: TicketType, 
    status?: TicketStatus
  ): Promise<Ticket>

  deleteTicket(ticketId: string): Promise<boolean>
}

export class TicketRepository implements ITicketRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool 
  }

  async createTicket(
    projectId: string,
    ownerId: string,
    name: string, 
    description: string, 
    priority: TicketPriority,
    type: TicketType,
    status: TicketStatus = 'open'
  ) {
    const result = await this.#pool.query<Ticket>({
      name: 'create_ticket',
      text: `
        INSERT INTO ticket(project_id, owner_id, name, description, priority, type, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `,
      values: [projectId, ownerId, name, description, priority, type, status],
    })
    return result.rows[0]
  }

  async getTicketById(id: string) {
    const result = await this.#pool.query<Ticket>({
      name: 'get_ticket_by',
      text: 'SELECT * FROM ticket WHERE id = $1;',
      values: [id],
    })

    return result.rows[0]
  }

  async getProjectTickets(projectId: string) {
    const result = await this.#pool.query<Ticket>({
      name: 'get_project_tickets',
      text: 'SELECT * FROM ticket WHERE project_id = $1;',
      values: [projectId],
    })
    return result.rows
  }

  async getUserAssignedTickets(userId: string, cursor = '0', limit = '10') {
    const result = await this.#pool.query<Ticket>({
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

  async getUserCreatedTickets(userId: string, cursor = '0', limit = '10') {
    const result = await this.#pool.query<Ticket>({
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

  async getUserAssignedTicketStatistics(userId: string) {
    const result = await this.#pool.query<TicketStatistic>({
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

  async updateTicket(
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

    const result = await this.#pool.query<Ticket>({
      name: 'update_ticket',
      text: `
        UPDATE ticket
        SET ${fields.join(', ')} 
        WHERE ticket_id = $1;
        RETURNING *;
      `,
      values: [ticketId, ...values],
    })

    return result.rows[0]
  }

  async deleteTicket(ticketId: string) {
    const result = await this.#pool.query({
      name: 'delete_ticket',
      text: 'DELETE FROM ticket WHERE id = $1;',
      values: [ticketId],
    })

    return result.rowCount > 0
  }
}
