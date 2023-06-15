import type { UserRole } from '../../models/User'
import type { IUserRepository } from '../../repositories'
import { UserNotFoundError, UserIsNotAuthorizedError } from '../../errors'

export class AdminUserService {
  #userDb: IUserRepository

  constructor(userDb: IUserRepository) {
    this.#userDb = userDb
  }

  async changeUser(
    adminRole: 'admin' | 'owner', 
    userId: string, 
    username?: string, 
    email?: string
  ) {
    const user = await this.#userDb.getUserBy('id', userId)
    if (!user) throw new UserNotFoundError()

    // an admin can't change an admin
    if (adminRole === 'admin' && user.role === 'admin') {
      throw new UserIsNotAuthorizedError()
    }

    // an admin can't change an owner
    if (adminRole === 'admin' && user.role === 'owner') {
      throw new UserIsNotAuthorizedError()
    }

    if (username) await this.#userDb.changeUsername(userId, username)
    if (email) await this.#userDb.changeUsername(userId, email)
  }

  async changeRole(
    userId: string, 
    adminRole: 'admin' | 'owner', 
    role: UserRole, 
  ) {
    const user = await this.#userDb.getUserBy('id', userId)
    if (!user) throw new UserNotFoundError()

    // an admin can't change an admin
    if (adminRole === 'admin' && user.role === 'admin') {
      throw new UserIsNotAuthorizedError()
    }

    // an admin can't change an owner
    if (adminRole === 'admin' && user.role === 'owner') {
      throw new UserIsNotAuthorizedError()
    }
    
    return await this.#userDb.changeRole(userId, role)
  }

  async deleteUserBy(field: 'id' | 'email' | 'username', adminRole: 'admin' | 'owner', userId: string) {
    const user = await this.#userDb.getUserBy(field, userId)
    if (!user) throw new UserNotFoundError()

    // an admin can't delete an admin
    if (adminRole === 'admin' && user.role === 'admin') {
      throw new UserIsNotAuthorizedError()
    }

    // an admin can't delete an owner
    if (adminRole === 'admin' && user.role === 'owner') { 
      throw new UserIsNotAuthorizedError()
    }

    return await this.#userDb.deleteUserBy('id', userId)
  }
}
