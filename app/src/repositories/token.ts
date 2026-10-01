import { createHash } from 'node:crypto'
import type { AppRedisClient } from '../config/redis'
import { REFRESH_TOKEN_TTL_SECONDS } from '../utility/jwt'

/**
 * Allowlist of live refresh-token ids: one Redis key per token plus a
 * per-user index set so revocation doesn't need a keyspace scan.
 *
 * Rotation deletes the old id when a new pair is issued, so a replayed
 * (already-rotated) refresh token is simply absent and can be treated as
 * reuse. Only SHA-256 hashes of the ids are stored, not the tokens.
 */
export interface IRefreshTokenRepository {
  store(userId: string, jti: string): Promise<void>
  consume(userId: string, jti: string): Promise<boolean>
  revokeAll(userId: string): Promise<void>
}

function keyFor(userId: string, jtiHash: string): string {
  return `refresh:${userId}:${jtiHash}`
}

function indexFor(userId: string): string {
  return `refresh-idx:${userId}`
}

export function hashTokenId(jti: string): string {
  return createHash('sha256').update(jti).digest('hex')
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  #redis: AppRedisClient

  constructor(redisClient: AppRedisClient) {
    this.#redis = redisClient
  }

  async store(userId: string, jti: string): Promise<void> {
    const jtiHash = hashTokenId(jti)
    await this.#redis
      .multi()
      .set(keyFor(userId, jtiHash), '1', { EX: REFRESH_TOKEN_TTL_SECONDS })
      .sAdd(indexFor(userId), jtiHash)
      .exec()
  }

  /**
   * Atomically takes a refresh-token id out of the allowlist.
   * Returns true when the id was live, false when unknown or already rotated.
   */
  async consume(userId: string, jti: string): Promise<boolean> {
    const jtiHash = hashTokenId(jti)
    const result = await this.#redis
      .multi()
      .del(keyFor(userId, jtiHash))
      .sRem(indexFor(userId), jtiHash)
      .exec()
    return Number(result[0]) > 0
  }

  /** Revokes every live refresh token for a user (logout-all / reuse response). */
  async revokeAll(userId: string): Promise<void> {
    const indexKey = indexFor(userId)
    const hashes = await this.#redis.sMembers(indexKey)
    if (hashes.length === 0) return
    await this.#redis
      .multi()
      .del(hashes.map((h) => keyFor(userId, h)))
      .del(indexKey)
      .exec()
  }
}
