import type { UserAccountStatus, UserRole } from '../../models/User'
import type { IUserRepository } from '../../repositories'
import { UserNotFoundError, UserIsNotAuthorizedError } from '../../errors'

export class AdminUserService {
  #userDb: IUserRepository

  constructor(userDb: IUserRepository) {
    this.#userDb = userDb
  }

  async changeRole(
    userId: string, 
    adminRole: UserRole,
    newRole: UserRole, 
  ) {
    const user = await this.#userDb.getUserBy('id', userId)
    if (!user) throw new UserNotFoundError()

    if (adminRole === 'admin') {
      // an admin can't change the role of another admin
      if (user.role === 'admin') throw new UserIsNotAuthorizedError()

      // an admin can't change the role of an owner
      if (user.role === 'owner') throw new UserIsNotAuthorizedError()

      // an admin can't create new admins or owners
      if (newRole === 'admin' || newRole === 'owner') throw new UserIsNotAuthorizedError()
    }
    
    return await this.#userDb.changeRole(userId, newRole)
  }

  async changeAccountStatus(
    userId: string, 
    adminRole: UserRole,
    newRole: UserAccountStatus, 
  ) {
    const user = await this.#userDb.getUserBy('id', userId)    
    if (!user) throw new UserNotFoundError()

    if (adminRole === 'admin') {
      // an admin can't change the status of another admin
      if (user.role === 'admin') throw new UserIsNotAuthorizedError()

      // an admin can't change the status of an owner
      if (user.role === 'owner') throw new UserIsNotAuthorizedError()
    }

    return await this.#userDb.changeAccountStatus(userId, newRole)
  }

  async deleteUserBy(field: 'id' | 'email' | 'username', adminRole: 'admin' | 'owner', userId: string) {
    const user = await this.#userDb.getUserBy(field, userId)
    if (!user) throw new UserNotFoundError()

    if (adminRole === 'admin') {
      // an admin can't delete an admin
      if (user.role === 'admin') {
        throw new UserIsNotAuthorizedError()
      }

      // an admin can't delete an owner
      if (user.role === 'owner') { 
        throw new UserIsNotAuthorizedError()
      }
    }

    return await this.#userDb.deleteUserBy('id', userId)
  }
}
