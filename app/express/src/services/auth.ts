import type { IUserRepository } from '../repositories'
import { UserIsNotAuthenticatedError, UserProvidedTheWrongPasswordError } from '../errors'
import { checkIfPasswordIsAMatch } from '../utility/password'

export class AuthService {
  #userDb: IUserRepository

  constructor(userDb: IUserRepository) {
    this.#userDb = userDb
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.#userDb.getUserForAuthentication(email)
    if (!user) throw new UserIsNotAuthenticatedError()
  
    const { password: storedPasswordHash, ...userWithoutPassword } = user
    const matches = await checkIfPasswordIsAMatch(password, storedPasswordHash)
    if (!matches) throw new UserProvidedTheWrongPasswordError()

    return userWithoutPassword
  }
}
