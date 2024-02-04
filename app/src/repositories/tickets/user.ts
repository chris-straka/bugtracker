import type { Pool } from 'pg'
import type { BaseUser } from '../../models/User'

export interface ITicketUserRepository {
  getTicketUsers(ticketId: string): Promise<BaseUser[]>
  addUserToTicket(ticketId: string, userId: string): Promise<boolean>
  removeUserFromTicket(projectId: string, userId: string): Promise<boolean>
}

export class TicketUserRepository implements ITicketUserRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool 
  }

  async getTicketUsers(ticketId: string) {
    const data = await this.#pool.query<BaseUser>({
      name: 'get_ticket_users',
      text: `
        SELECT u.id, u.username, u.email, u.role
        FROM app_user u 
        JOIN ticket_user tu ON u.id = tu.user_id
        WHERE tu.ticket_id = $1;
      `,
      values: [ticketId]
    })
    return data.rows
  }

  async addUserToTicket(ticketId: string, userId: string) {
    const res = await this.#pool.query({
      name: 'add_user_to_ticket',
      text: 'INSERT INTO ticket_user(ticket_id, user_id) VALUES ($1, $2);',
      values: [ticketId, userId]
    }) 

    return res.rowCount > 0
  }

  async removeUserFromTicket(projectId: string, userId: string) {
    const res = await this.#pool.query({
      name: 'remove_user_from_ticket',
      text: 'DELETE FROM ticket_user WHERE ticket_id = $1 AND user_id = $2;',
      values: [projectId, userId]
    }) 

    return res.rowCount > 0
  }
}
