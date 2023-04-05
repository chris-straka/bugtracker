import type { UserDB } from '../models/User'
import type { Roles } from '../types'
import { db } from '../config/postgres'

async function checkIfUserExistsByEmail(email: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_user_exists_via_email',
    text: 'SELECT 1 FROM users WHERE email = $1;',
    values: [email]
  })
  return data.rows.length > 0
}

async function getUserByEmail(email: string): Promise<UserDB> {
  const data = await db.query({
    name: 'get_user_by_email',
    text: 'SELECT * FROM users WHERE email = $1;',
    values: [email]
  })
  return data.rows[0]
}

async function getUserById(id: string): Promise<UserDB> {
  const data = await db.query({
    name: 'get_user_by_id',
    text: 'SELECT username, email, role FROM users WHERE id = $1;',
    values: [id]
  })
  return data.rows[0]
}

async function createUser(name: string, email: string, hashedPassword: string, role: Roles): Promise<UserDB> {
  const data = await db.query({
    name: 'create_user',
    text: 'INSERT INTO users(username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role;',
    values: [name, email, hashedPassword, role]
  })
  return data.rows[0]
}

async function changeEmail(id: string, email: string): Promise<boolean> {
  const data = await db.query({
    name: 'change_user_email',
    text: 'UPDATE users SET email = $2 WHERE id = $1;',
    values: [id, email]
  })
  return data.rows.length > 0
}

async function changeUsername(id: string, username: string) {
  const data = await db.query({
    name: 'change_username',
    text: 'UPDATE users SET username = $2 WHERE id = $1;',
    values: [id, username]
  })
  return data.rows.length > 0
}

async function deleteUserById(id: string): Promise<boolean> {
  const result = await db.query({
    name: 'delete_user',
    text: 'DELETE FROM users WHERE id = $1;',
    values: [id]
  })
  return result.rowCount > 0
}

export default {
  checkIfUserExistsByEmail,
  getUserByEmail,
  getUserById,
  changeEmail,
  changeUsername,
  createUser,
  deleteUserById
}