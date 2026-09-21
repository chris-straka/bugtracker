import type { Pool } from 'pg'
import type { TicketComment } from '../../models/TicketComment'
import { execute } from '../../db/query'

export interface ITicketCommentRepository {
  createTicketComment(ticketId: string, ownerId: string, comment: string): Promise<TicketComment>

  getTicketCommentById(commentId: string): Promise<TicketComment>
  getTicketComments(ticketId: string): Promise<TicketComment[]>

  updateTicketComment(commentId: string, comment: string): Promise<TicketComment>
  deleteTicketComment(commentId: string): Promise<boolean>
}

export class TicketCommentRepository implements ITicketCommentRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool
  }

  async createTicketComment(ticketId: string, ownerId: string, comment: string) {
    const result = await this.#pool.query<TicketComment>({
      name: 'create_ticket_comment',
      text: `
        INSERT INTO ticket_comment(ticket_id, owner_id, comment) 
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      values: [ticketId, ownerId, comment],
    })
    return result.rows[0]
  }

  async getTicketCommentById(commentId: string) {
    const data = await this.#pool.query<TicketComment>({
      name: 'get_ticket_comment_by_id',
      text: 'SELECT * FROM ticket_comment WHERE id = $1;',
      values: [commentId],
    })
    return data.rows[0]
  }

  async getTicketComments(ticketId: string) {
    const data = await this.#pool.query<TicketComment>({
      name: 'get_ticket_comments',
      text: 'SELECT * FROM ticket_comment WHERE ticket_id = $1 ORDER BY id ASC;',
      values: [ticketId],
    })
    return data.rows
  }

  async updateTicketComment(commentId: string, comment: string) {
    const result = await this.#pool.query<TicketComment>({
      name: 'update_ticket_comment',
      text: 'UPDATE ticket_comment SET comment = $2 WHERE id = $1 RETURNING *;',
      values: [commentId, comment],
    })
    return result.rows[0]
  }

  async deleteTicketComment(commentId: string) {
    return execute(this.#pool, {
      name: 'delete_ticket_comment',
      text: 'DELETE FROM ticket_comment WHERE id = $1;',
      values: [commentId],
    })
  }
}
