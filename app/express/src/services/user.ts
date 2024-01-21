import type { UserRole } from '../models/User'
import type { IUserRepository, IPasswordResetRepository } from '../repositories'
import { UserNotFoundError, UserAlreadyExistsError , InvalidOrMissingTokenError } from '../errors'
import { toHashWithSalt } from '../utility'

export class UserService {
  #userDb: IUserRepository
  #passwordDb: IPasswordResetRepository

  constructor(userDb: IUserRepository, passwordDb: IPasswordResetRepository) {
    this.#userDb = userDb
    this.#passwordDb = passwordDb
  }

  async getUserByEmail(email: string) {
    return this.#userDb.getUserByEmail(email)
  }

  async getUserEmail(userId: string) {
    return this.#userDb.getUserEmail(userId)
  }

  async createUser(username: string, email: string, password: string, role: UserRole = 'contributor') {
    const userExists = await this.#userDb.userExistsByEmailOrUsername(email, username)
    if (userExists) throw new UserAlreadyExistsError()

    const hashedPassword = await toHashWithSalt(password)
    return this.#userDb.createUser(username, email, hashedPassword, role)
  }

  async changeUsername(id: string, newUsername: string) {
    const user = await this.#userDb.getUserById(id)
    if (!user) throw new UserNotFoundError()

    const usernameAlreadyExists = await this.#userDb.userExistsByUsername(newUsername)
    if (usernameAlreadyExists) throw new UserAlreadyExistsError()

    await this.#userDb.changeUsername(id, newUsername)
  }

  async changePassword(token: string, newPassword: string) {
    const userId = await this.#passwordDb.validatePasswordResetToken(token)
    if (!userId) throw new InvalidOrMissingTokenError()

    const newPasswordHash = await toHashWithSalt(newPassword)
    const result = await this.#userDb.changePassword(userId.toString(), newPasswordHash)
    if (!result) throw new Error('Password could not be saved in DB')
  }

  async deleteCurrentUserById(userId: string) {
    await this.#userDb.deleteUserById(userId)
  }
}
