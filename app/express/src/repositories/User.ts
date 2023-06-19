import type { Pool } from 'pg'
import type { BaseUser, AuthUser, UserAccountStatus, UserAccountStatusObject, UserRole  } from '../models/User'
import { UserNotFoundError } from '../errors'

export interface IUserRepository {
  createUser(username: string, email: string, hashedPassword: string, role: UserRole): Promise<BaseUser>
  
  getUserEmail(userId: string): Promise<string>
  getUserBy(field: 'id' | 'email' | 'username', value: string): Promise<BaseUser>
  getUserAccountStatus(userId: string): Promise<UserAccountStatusObject>
  getUserForAuthentication(email: string): Promise<AuthUser>

  userExistsBy(field: 'id' | 'email' | 'username', value: string): Promise<boolean>
  userExistsByEmailOrUsername(email: string, username: string): Promise<boolean>

  changeUsername(id: string, newUsername: string): Promise<BaseUser>
  changeEmail(oldEmail: string, newEmail?: string): Promise<BaseUser>
  changePassword(id: string, newPasswordHash: string): Promise<boolean>
  changeRole(id: string, newRole: UserRole): Promise<BaseUser>
  changeAccountStatus(id: string, newAccountStatus: UserAccountStatus): Promise<UserAccountStatusObject>

  deleteUserBy(field: 'id' | 'email' | 'username', value: string): Promise<boolean>
}

export class UserRepository implements IUserRepository {
  #pool: Pool

  constructor(dbPool: Pool) {
    this.#pool = dbPool
  }

  async createUser(username: string, email: string, hashedPassword: string, role: UserRole) {
    const data = await this.#pool.query<BaseUser>({
      name: 'create_user',
      text: `
        INSERT INTO app_user(username, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, username, email, role;
      `,
      values: [username, email, hashedPassword, role]
    })
    return data.rows[0]
  }

  async getUserForAuthentication(email: string) {
    const data = await this.#pool.query<AuthUser>({
      name: 'get_user_for_authentication',
      text: 'SELECT id, username, email, password, role FROM app_user WHERE email = $1;',
      values: [email]
    })    

    return data.rows[0]
  }

  async getUserEmail(userId: string) {
    const data = await this.#pool.query<BaseUser>({
      name: 'get_user_email',
      text: 'SELECT email FROM app_user WHERE id = $1;',
      values: [userId]
    })

    if (data.rows[0]) return data.rows[0].email
    throw new UserNotFoundError()
  }

  async getUserBy(field: 'id' | 'email' | 'username', value: string) {
    let query: string

    switch (field) {
      case 'id':
        query = 'SELECT id, username, email, role FROM app_user WHERE id = $1;'
        break
      case 'email':
        query = 'SELECT id, username, email, role FROM app_user WHERE email = $1;'
        break
      case 'username':
        query = 'SELECT id, username, email, role FROM app_user WHERE username = $1;'
        break
      default:
        throw new Error('Invalid field')
    }

    const data = await this.#pool.query<BaseUser>({
      name: 'get_user_by',
      text: query,
      values: [value]
    })

    return data.rows[0]
  }

  async getUserAccountStatus(userId: string) {
    const data = await this.#pool.query<UserAccountStatusObject>({
      name: 'user_is_active',
      text: 'SELECT account_status FROM app_user WHERE id = $1;', 
      values: [userId]
    })

    return data.rows[0]
  }

  async userExistsBy(field: 'id' | 'email' | 'username', value: string) {
    let query: string

    switch (field) {
      case 'id':
        query = 'SELECT 1 FROM app_user WHERE id = $1;'
        break
      case 'email':
        query = 'SELECT 1 FROM app_user WHERE email = $1;'
        break
      case 'username':
        query = 'SELECT 1 FROM app_user WHERE username = $1;'
        break
      default:
        throw new Error('Invalid field')
    }

    const data = await this.#pool.query({
      name: 'user_exists_by',
      text: query,
      values: [value]
    })

    return data.rows.length > 0
  }

  async userExistsByEmailOrUsername(email: string, username: string) {
    const data = await this.#pool.query({
      name: 'check_if_user_exists_by_email_or_username',
      text: 'SELECT 1 FROM app_user WHERE email = $1 OR username = $2;',
      values: [email, username]
    })

    return data.rows.length > 0
  }

  async changeUsername(userId: string, username: string) {
    const data = await this.#pool.query<BaseUser>({
      name: 'admin_update_user',
      text: 'UPDATE app_user SET username = $2 WHERE id = $1 RETURNING id, username, email, role;',
      values: [userId, username],
    })

    return data.rows[0]
  }

  async changeEmail(oldEmail: string, newEmail: string) {
    const data = await this.#pool.query<BaseUser>({
      name: 'admin_update_user',
      text: 'UPDATE app_user SET email = $2 WHERE email = $1 RETURNING id, username, email, role;',
      values: [oldEmail, newEmail]
    })

    return data.rows[0]
  }

  async changePassword(id: string, newPasswordHash: string) {
    const data = await this.#pool.query({
      name: 'change_password',
      text: 'UPDATE app_user SET password = $2 WHERE id = $1;',
      values: [id, newPasswordHash]
    })
    return data.rowCount > 0
  }

  async changeRole(id: string, newRole: UserRole) {
    const data = await this.#pool.query<BaseUser>({
      name: 'change_email',
      text: 'UPDATE app_user SET role = $2 WHERE id = $1 RETURNING id, username, email, role;',
      values: [id, newRole]
    })
    return data.rows[0]
  }

  async changeAccountStatus(id: string, newAccountStatus: UserAccountStatus) {
    try {
      const data = await this.#pool.query<UserAccountStatusObject>({
        name: 'change_account_status',
        text: 'UPDATE app_user SET account_status = $2 WHERE id = $1 RETURNING account_status;',
        values: [id, newAccountStatus]
      })
      
      return data.rows[0]
    } catch (error) {
      console.error(error)
      throw Error('oh fuk')
    }
  }

  async deleteUserBy(field: 'id' | 'email' | 'username', value: string) {
    let query: string

    switch (field) {
      case 'id':
        query = 'DELETE FROM app_user WHERE id = $1;'
        break
      case 'email':
        query = 'DELETE FROM app_user WHERE email = $1;'
        break
      case 'username':
        query = 'DELETE FROM app_user WHERE username = $1;'
        break
      default:
        throw new Error('Invalid field')
    }

    const data = await this.#pool.query({
      name: 'delete_user_by',
      text: query,
      values: [value]
    })

    return data.rowCount > 0
  }
}
