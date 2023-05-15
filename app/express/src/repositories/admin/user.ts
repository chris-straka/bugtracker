import { Roles } from '../../types'
import { User } from '../../models/User'
import { db } from '../../config/postgres'

async function changeUser(userId: string, username?: string, email?: string, role?: Roles): Promise<User> {
  const fields = []
  const values = []

  let counter = 2

  if (username !== undefined) {
    fields.push(`username = $${counter}`)
    values.push(username)
    counter++
  }

  if (email !== undefined) {
    fields.push(`email = $${counter}`)
    values.push(email)
    counter++
  }

  if (role !== undefined) {
    fields.push(`role = $${counter}`)
    values.push(role)
    counter++
  }

  if (fields.length === 0) throw new Error('There\'s nothing here that I have to change')

  const result = await db.query({
    name: 'admin_update_user',
    text: `UPDATE user SET ${fields.join(', ')} WHERE id = $1 RETURNING username, role, id, email;`,
    values: [userId, ...values],
  })

  return result.rows[0]
}

async function deleteUser(userId: string): Promise<boolean> {
  const result = await db.query({
    name: 'admin_update_user',
    text: 'DELETE FROM user WHERE id = $1',
    values: [userId],
  })

  return result.rowCount > 0
}

export default {
  changeUser,
  deleteUser
}