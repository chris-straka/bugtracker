import { createClient } from 'redis'

const TOKEN_EXPIRATION_IN_SECONDS = 3600 // 1 hour

export interface IPasswordResetRepository {
  storePasswordResetTokenUnderUserId(token: string, userId: string): Promise<void>,
  validatePasswordResetToken(token: string): Promise<string | null>
}

type RedisClientType = ReturnType<typeof createClient>

export class PasswordResetRepository implements IPasswordResetRepository {
  #redis: RedisClientType

  constructor(redisClient: RedisClientType) {
    this.#redis = redisClient
  }

  async storePasswordResetTokenUnderUserId(token: string, userId: string) {
    await this.#redis.set(`reset-password:${token}`, userId.toString(), { EX: TOKEN_EXPIRATION_IN_SECONDS })
  }

  async validatePasswordResetToken(token: string) {
    const userId = await this.#redis.get(`reset-password:${token}`)

    if (userId) {
      await this.#redis.del(`reset-password:${token}`) 
      return userId
    } 

    return null
  }
}
