import type { User, UserWithPassword } from '../models/User'
import type { Roles } from '../types'
import { db } from '../config/postgres'

async function checkIfUserExistsByEmail(email: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_user_exists_by_email',
    text: 'SELECT 1 FROM users WHERE email = $1;',
    values: [email]
  })
  return data.rows.length > 0
}

async function checkIfUserExistsByUsername(username: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_user_exists_by_username',
    text: 'SELECT 1 FROM users WHERE username = $1;',
    values: [username]
  })
  return data.rows.length > 0
}

async function checkIfUserExistsByEmailOrUsername(email: string, username: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_user_exists_by_email_or_username',
    text: 'SELECT 1 FROM users WHERE email = $1 OR username = $2;',
    values: [email, username]
  })
  return data.rows.length > 0
}

async function getUserByEmailWithPassword(email: string): Promise<UserWithPassword> {
  const data = await db.query({
    name: 'get_user_by_email',
    text: 'SELECT * FROM users WHERE email = $1;',
    values: [email]
  })
  return data.rows[0]
}

async function getUserByEmail(email: string): Promise<User> {
  const data = await db.query({
    name: 'get_user_by_email',
    text: 'SELECT id, email, role, username FROM users WHERE email = $1;',
    values: [email]
  })
  return data.rows[0]
}

async function getUserById(id: string): Promise<User> {
  const data = await db.query({
    name: 'get_user_by_id',
    text: 'SELECT id, username, email, role FROM users WHERE id = $1;',
    values: [id]
  })
  return data.rows[0]
}

async function createUser(username: string, email: string, hashedPassword: string, role: Roles): Promise<User> {
  const data = await db.query({
    name: 'create_user',
    text: 'INSERT INTO users(username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role;',
    values: [username, email, hashedPassword, role]
  })
  return data.rows[0]
}

async function changeEmail(id: string, email: string): Promise<boolean> {
  const data = await db.query({
    name: 'change_email',
    text: 'UPDATE users SET email = $2 WHERE id = $1;',
    values: [id, email]
  })
  // return data.rows.length > 0
  return data.rowCount > 0
}

async function changeUsername(id: string, username: string): Promise<boolean> {
  const data = await db.query({
    name: 'change_username',
    text: 'UPDATE users SET username = $2 WHERE id = $1;',
    values: [id, username]
  })
  return data.rowCount> 0
}

async function deleteUserById(id: string): Promise<boolean> {
  const result = await db.query({
    name: 'delete_user_by_id',
    text: 'DELETE FROM users WHERE id = $1;',
    values: [id]
  })
  return result.rowCount > 0
}

async function deleteUserByEmail(email: string): Promise<boolean> {
  const result = await db.query({
    name: 'delete_user_by_email',
    text: 'DELETE FROM users WHERE email = $1;',
    values: [email]
  })
  return result.rowCount > 0
}

export default {
  checkIfUserExistsByEmail,
  checkIfUserExistsByEmailOrUsername,
  checkIfUserExistsByUsername,
  getUserByEmailWithPassword,
  getUserByEmail,
  getUserById,
  changeEmail,
  changeUsername,
  createUser,
  deleteUserById,
  deleteUserByEmail
}