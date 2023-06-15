import { createClient } from 'redis'
import { InvalidOrMissingTokenError } from '../../errors'

const TOKEN_EXPIRATION_IN_SECONDS = 3600 // 1 hour

type RedisClientType = ReturnType<typeof createClient>
type Emails = { oldEmail: string, newEmail: string }

export interface IEmailResetRepository {
  storeTokenWithEmails(token: string, currentEmail: string, newEmail: string): Promise<void>,
  grabEmailsWithToken(token: string): Promise<Emails> 
}

export class EmailResetRepository implements IEmailResetRepository {
  #redis: RedisClientType

  constructor(redisClient: RedisClientType) {
    this.#redis = redisClient
  }

  async storeTokenWithEmails(token: string, currentEmail: string, newEmail: string) {
    await this.#redis
      .multi()
      .hSet(`reset-email:${token}`, { oldEmail: currentEmail, newEmail })
      .expire(`reset-email:${token}`, TOKEN_EXPIRATION_IN_SECONDS)
      .exec()
  }

  async grabEmailsWithToken(token: string) {
    const key = `reset-email:${token}`

    const result = await this.#redis
      .multi()
      .hGetAll(key)
      .del(key) 
      .exec()

    // if you didn't delete anything, the key never existed to begin with
    if (result[1] === 0) throw new InvalidOrMissingTokenError()

    return result[0] as unknown as Emails
  }
}
