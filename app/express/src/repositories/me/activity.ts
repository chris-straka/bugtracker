import { db } from '../../config/postgres'

async function getUserAssignedTickets(userId: string, cursor = '0', limit = '10') {
  const result = await db.query({
    name: 'get_user_assigned_tickets',
    text: `
      SELECT t.*
      FROM ticket_user tu
      JOIN ticket t ON t.id = tu.ticket_id
      WHERE tu.user_id = $1
      AND t.id > $2
      ORDER BY t.id ASC
      LIMIT $3;
    `,
    values: [userId, cursor, limit]
  })

  return result.rows
}

export default {
  getUserAssignedTickets
}