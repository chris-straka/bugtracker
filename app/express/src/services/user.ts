import type { UserRole } from '../models/User'
import type { IUserRepository, IEmailResetRepository, IPasswordResetRepository } from '../repositories'
import { UserNotFoundError, UserAlreadyExistsError , InvalidOrMissingTokenError } from '../errors'
import { toHashWithSalt } from '../utility'

export class UserService {
  #userDb: IUserRepository
  #emailDb: IEmailResetRepository
  #passwordDb: IPasswordResetRepository

  constructor(userDb: IUserRepository, emailDb: IEmailResetRepository, passwordDb: IPasswordResetRepository) {
    this.#userDb = userDb
    this.#emailDb = emailDb
    this.#passwordDb = passwordDb
  }

  async getUserByEmail(email: string) {
    return await this.#userDb.getUserBy('email', email)
  }

  async getUserEmail(userId: string) {
    return await this.#userDb.getUserEmail(userId)
  }

  async createUser(username: string, email: string, password: string, role: UserRole = 'contributor') {
    const userExists = await this.#userDb.userExistsByEmailOrUsername(email, username)
    if (userExists) throw new UserAlreadyExistsError()

    const hashedPassword = await toHashWithSalt(password)
    return await this.#userDb.createUser(username, email, hashedPassword, role)
  }

  async changeUsername(id: string, newUsername: string) {
    const user = await this.#userDb.getUserBy('id', id)
    if (!user) throw new UserNotFoundError()

    const usernameAlreadyExists = await this.#userDb.userExistsBy('username', newUsername)
    if (usernameAlreadyExists) throw new UserAlreadyExistsError()

    await this.#userDb.changeUsername(id, newUsername)
  }

  async changePassword(token: string, newPassword: string) {
    const userId = await this.#passwordDb.validatePasswordResetToken(token)
    if (!userId) throw new InvalidOrMissingTokenError()

    const newPasswordHash = await toHashWithSalt(newPassword)
    const result = await this.#userDb.changePassword(userId, newPasswordHash)
    if (!result) throw new Error('Password could not be saved in DB')
  }

  async deleteUserBy(field: 'id' | 'username' | 'email', value: string) {
    return await this.#userDb.deleteUserBy(field, value) 
  }
}
