import type { User, UserWithPassword } from '../models/User'
import type { Roles } from '../types'
import { db } from '../config/postgres'

// create the user
async function createUser(username: string, email: string, hashedPassword: string, role: Roles): Promise<User> {
  const data = await db.query({
    name: 'create_user',
    text: 'INSERT INTO user(username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role;',
    values: [username, email, hashedPassword, role]
  })
  return data.rows[0]
}

// grab the user
async function getUserByEmail(email: string): Promise<User> {
  const data = await db.query({
    name: 'get_user_by_email',
    text: 'SELECT id, email, role, username FROM user WHERE email = $1;',
    values: [email]
  })
  return data.rows[0]
}

async function getUserWithPasswordByEmail(email: string): Promise<UserWithPassword> {
  const data = await db.query({
    name: 'get_user_by_email_with_password',
    text: 'SELECT * FROM user WHERE email = $1;',
    values: [email]
  })
  return data.rows[0]
}

async function getUserById(id: string): Promise<User> {
  const data = await db.query({
    name: 'get_user_by_id',
    text: 'SELECT id, username, email, role FROM user WHERE id = $1;',
    values: [id]
  })
  return data.rows[0]
}

// check if user exists
async function checkIfUserExistsByEmail(email: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_user_exists_by_email',
    text: 'SELECT 1 FROM user WHERE email = $1;',
    values: [email]
  })
  return data.rows.length > 0
}

async function checkIfUserExistsByUsername(username: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_user_exists_by_username',
    text: 'SELECT 1 FROM user WHERE username = $1;',
    values: [username]
  })
  return data.rows.length > 0
}

async function checkIfUserExistsByEmailOrUsername(email: string, username: string): Promise<boolean> {
  const data = await db.query({
    name: 'check_if_user_exists_by_email_or_username',
    text: 'SELECT 1 FROM user WHERE email = $1 OR username = $2;',
    values: [email, username]
  })
  return data.rows.length > 0
}

// update the user
async function changeEmail(id: string, email: string): Promise<boolean> {
  const data = await db.query({
    name: 'change_email',
    text: 'UPDATE user SET email = $2 WHERE id = $1;',
    values: [id, email]
  })
  return data.rowCount > 0
}

async function changeUsername(id: string, username: string): Promise<boolean> {
  const data = await db.query({
    name: 'change_username',
    text: 'UPDATE user SET username = $2 WHERE id = $1;',
    values: [id, username]
  })
  return data.rowCount > 0
}

// delete the user
async function deleteUserById(id: string): Promise<boolean> {
  const result = await db.query({
    name: 'delete_user_by_id',
    text: 'DELETE FROM user WHERE id = $1;',
    values: [id]
  })
  return result.rowCount > 0
}

async function deleteUserByEmail(email: string): Promise<boolean> {
  const result = await db.query({
    name: 'delete_user_by_email',
    text: 'DELETE FROM user WHERE email = $1;',
    values: [email]
  })
  return result.rowCount > 0
}

export default {
  checkIfUserExistsByEmail,
  checkIfUserExistsByEmailOrUsername,
  checkIfUserExistsByUsername,
  getUserWithPasswordByEmail,
  getUserByEmail,
  getUserById,
  changeEmail,
  changeUsername,
  createUser,
  deleteUserById,
  deleteUserByEmail
}