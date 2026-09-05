import type { AppRedisClient } from '../../config/redis'

const TOKEN_EXPIRATION_IN_SECONDS = 3600 // 1 hour

export interface IPasswordResetRepository {
  storePasswordResetTokenUnderUserId(token: string, userId: string): Promise<void>
  validatePasswordResetToken(token: string): Promise<number | null>
}

export class PasswordResetRepository implements IPasswordResetRepository {
  #redis: AppRedisClient

  constructor(redisClient: AppRedisClient) {
    this.#redis = redisClient
  }

  async storePasswordResetTokenUnderUserId(token: string, userId: string) {
    await this.#redis.set(`reset-password:${token}`, userId.toString(), { EX: TOKEN_EXPIRATION_IN_SECONDS })
  }

  async validatePasswordResetToken(token: string) {
    const userId = await this.#redis.get(`reset-password:${token}`)

    if (userId) {
      await this.#redis.del(`reset-password:${token}`)
      return +userId
    }

    return null
  }
}
