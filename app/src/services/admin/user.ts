import type { AdminRole, UserAccountStatus, UserRole } from '../../models/User'
import type { IUserRepository } from '../../repositories'
import { UserNotFoundError, UserIsNotAssignedToThisProjectError } from '../../errors'

export class AdminUserService {
  #userDb: IUserRepository

  constructor(userDb: IUserRepository) {
    this.#userDb = userDb
  }

  async changeRole(
    userId: string, 
    newRole: UserRole, 
    adminRole: AdminRole
  ) {
    const user = await this.#userDb.getUserById(userId)
    if (!user) throw new UserNotFoundError()

    // the owner can not be changed, and there can't be new owners
    if (user.role === 'owner' || newRole === 'owner') throw new UserIsNotAssignedToThisProjectError()

    // an admin can't change another admin and can't create new admins
    if (adminRole === 'admin') {
      if (user.role === 'admin' || newRole === 'admin') throw new UserIsNotAssignedToThisProjectError()
    }
    
    return this.#userDb.changeRole(userId, newRole)
  }

  async changeAccountStatus(
    userId: string, 
    newAccountStatus: UserAccountStatus, 
    adminRole: AdminRole
  ) {
    const user = await this.#userDb.getUserById(userId)    
    if (!user) throw new UserNotFoundError()

    // the owner account_status can't be changed
    if (user.role === 'owner') throw new UserIsNotAssignedToThisProjectError()

    // an admin can't change the account status of another admin
    if (adminRole === 'admin' && user.role === 'admin') throw new UserIsNotAssignedToThisProjectError()

    return this.#userDb.changeAccountStatus(userId, newAccountStatus)
  }

  async deleteUserById(userId: string, adminRole: AdminRole) {
    const user = await this.#userDb.getUserById(userId)
    if (!user) throw new UserNotFoundError()

    // the owner can't be deleted
    if (user.role === 'owner') throw new UserIsNotAssignedToThisProjectError()

    // an admin can't delete another admin 
    if (adminRole === 'admin' && user.role === 'admin') {
      throw new UserIsNotAssignedToThisProjectError() 
    }

    return this.#userDb.deleteUserById(userId)
  }
}
