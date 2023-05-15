import { db } from '../../config/postgres'
import { User } from '../../models/User'

async function getTicketUsers(ticketId: string): Promise<User[]> {
  const data = await db.query({
    name: 'get_ticket_users',
    text: `
      SELECT u.name, u.email, u.role
      FROM user u 
      JOIN ticket_user tu ON u.id = tu.user_id
      WHERE tu.ticket_id = $1;
    `,
    values: [ticketId]
  })
  return data.rows
}

async function addUserToTicket(ticketId: string, userId: string): Promise<boolean> {
  const res = await db.query({
    name: 'add_user_to_ticket',
    text: `
      INSERT INTO ticket_user(ticket_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `,
    values: [ticketId, userId]
  }) 

  return res.rowCount > 0
}

async function removeUserFromTicket(projectId: string, userId: string): Promise<boolean> {
  const res = await db.query({
    name: 'remove_user_from_ticket',
    text: 'DELETE FROM ticket_user WHERE ticket_id = $1 AND user_id = $2;',
    values: [projectId, userId]
  }) 

  return res.rowCount > 0
}

export default {
  getTicketUsers,
  addUserToTicket,
  removeUserFromTicket,
}