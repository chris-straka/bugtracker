import { IEmailResetRepository, IUserRepository } from '../../repositories'

export class EmailResetService {
  #emailResetDb: IEmailResetRepository
  #userDb: IUserRepository

  constructor(emailResetDb: IEmailResetRepository, userDb: IUserRepository) {
    this.#emailResetDb = emailResetDb
    this.#userDb = userDb
  }

  async storeResetTokenWithEmails(token: string, currentEmail: string, newEmail: string) {
    await this.#emailResetDb.storeTokenWithEmails(token, currentEmail, newEmail)
  }

  async grabEmailsFromToken(token: string) {
    return await this.#emailResetDb.grabEmailsWithToken(token)
  }

  async changeEmail(oldEmail: string, newEmail: string) {
    await this.#userDb.changeEmail(oldEmail, newEmail)
  }
}
