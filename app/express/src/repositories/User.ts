import type { User } from '../models/User'
import { db } from '../config/postgres'

export async function getUser (email: string): Promise<User> {
  const data = await db.query({
    name: 'get_user',
    text: 'SELECT * FROM users WHERE email = $1;',
    values: [email]
  })
  return data.rows[0]
}

export async function createUser (email: string, hashedPassword: string): Promise<User> {
  const data = await db.query({
    name: 'create_user',
    text: 'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *;',
    values: [email, hashedPassword]
  })
  return data.rows[0]
}

export async function deleteUser (email: string): Promise<boolean> {
  const result = await db.query({
    name: 'delete_user',
    text: 'DELETE FROM users WHERE email = $1;',
    values: [email]
  })
  return result.rowCount > 0
}
