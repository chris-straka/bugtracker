import { db } from '../../config/postgres'
import { TicketComment } from '../../models/Ticket'

async function createTicketComment(ticketId: string, ownerId: string, comment: string): Promise<TicketComment> {
  const result = await db.query({
    name: 'create_ticket_comment',
    text: 'INSERT INTO ticket_comment(ticket_id, owner_id, comment) VALUES ($1, $2, $3);',
    values: [ticketId, ownerId, comment]
  })
  return result.rows[0]
}

async function getTicketCommentById(commentId: string): Promise<TicketComment> {
  const data = await db.query({
    name: 'get_ticket_comment_by_id',
    text: 'SELECT 1 FROM ticket_comment WHERE id = $1;',
    values: [commentId]
  })
  return data.rows[0]
}

// ticket_comment, user, ticket
async function getTicketComments(ticketId: string): Promise<TicketComment[]> {
  const data = await db.query({
    name: 'get_ticket_comments',
    text: `
      SELECT user.name, tc.comment
      FROM ticket_comment tc
      JOIN user ON user.id = tc.owner_id
      WHERE ticket_comment.id = $1;
    `,
    values: [ticketId]
  })
  return data.rows
}

async function updateTicketComment(commentId: string, comment: string): Promise<TicketComment> {
  const result = await db.query({
    name: 'update_ticket_comment',
    text: 'UPDATE ticket_comment SET comment = $2 WHERE id = $1 RETURNING *;',
    values: [commentId, comment]
  })
  return result.rows[0]
}

async function deleteTicketComment(commentId: string): Promise<TicketComment> {
  const result = await db.query({
    name: 'delete_ticket_comment',
    text: 'DELETE FROM ticket_comment WHERE id = $1;',
    values: [commentId]
  })
  return result.rows[0]
}

export default {
  createTicketComment,
  getTicketCommentById,
  getTicketComments,
  updateTicketComment,
  deleteTicketComment
}