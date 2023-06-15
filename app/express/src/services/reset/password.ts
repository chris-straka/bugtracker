import { IPasswordResetRepository } from '../../repositories'

export class PasswordResetService {
  #passwordResetDb: IPasswordResetRepository

  constructor(passwordResetDb: IPasswordResetRepository) {
    this.#passwordResetDb = passwordResetDb
  }

  async storePasswordResetTokenUnderUserId(token: string, userId: string) {
    return await this.#passwordResetDb.storePasswordResetTokenUnderUserId(token, userId)
  } 
}