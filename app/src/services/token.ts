import { randomUUID } from 'node:crypto'
import type { IUserRepository } from '../repositories'
import type { IRefreshTokenRepository } from '../repositories/token'
import {
  UserIsDisabledError,
  UserIsNotAuthenticatedError,
  UserNotFoundError,
  UserProvidedTheWrongPasswordError,
  RefreshTokenReuseError,
} from '../errors'
import { checkIfPasswordIsAMatch } from '../utility/password'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  ACCESS_TOKEN_TTL_SECONDS,
} from '../utility/jwt'

export interface TokenPair {
  accessToken: string
  refreshToken: string
  /** Lifetime of the access token, in seconds. */
  expiresIn: number
}

export interface TokenUser {
  id: number
  username: string
  email: string
  role: Parameters<typeof signAccessToken>[1]
}

/**
 * JWT issuance for API/mobile clients. Web browsers keep the Redis cookie
 * session untouched; these tokens are an additional transport carrying the
 * same `{ userId, role }` identity.
 */
export class TokenService {
  #userDb: IUserRepository
  #refreshTokens: IRefreshTokenRepository

  constructor(userDb: IUserRepository, refreshTokens: IRefreshTokenRepository) {
    this.#userDb = userDb
    this.#refreshTokens = refreshTokens
  }

  /** Password login that returns a token pair instead of a cookie session. */
  async createPair(email: string, password: string): Promise<{ user: TokenUser; tokens: TokenPair }> {
    const user = await this.#userDb.getUserForAuthentication(email)
    if (!user) throw new UserIsNotAuthenticatedError()
    if (user.account_status === 'disabled') throw new UserIsDisabledError()

    const { password: storedPasswordHash, account_status: _status, ...userWithoutPassword } = user
    const matches = await checkIfPasswordIsAMatch(password, storedPasswordHash)
    if (!matches) throw new UserProvidedTheWrongPasswordError()

    const tokens = await this.#issuePair(userWithoutPassword.id.toString(), userWithoutPassword.role)
    return { user: userWithoutPassword, tokens }
  }

  /**
   * Rotates a refresh token: the presented token is consumed (single use) and
   * a fresh pair is returned. Replaying an already-rotated token revokes every
   * live refresh token for that user and fails, bounding the damage of a leak.
   */
  async rotate(refreshToken: string): Promise<TokenPair> {
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) throw new UserIsNotAuthenticatedError()

    const live = await this.#refreshTokens.consume(payload.sub, payload.jti)
    if (!live) {
      await this.#refreshTokens.revokeAll(payload.sub)
      throw new RefreshTokenReuseError()
    }

    const { account_status } = await this.#userDb.getUserAccountStatus(payload.sub)
    if (!account_status) throw new UserNotFoundError()
    if (account_status === 'disabled') throw new UserIsDisabledError()

    // Role may have changed since the token was issued; re-read it so the new
    // access token carries the current role.
    const current = await this.#userDb.getUserById(payload.sub)
    if (!current) throw new UserNotFoundError()
    return this.#issuePair(payload.sub, current.role)
  }

  /** Logs out one refresh token (best effort: unknown tokens still succeed). */
  async revoke(refreshToken: string): Promise<void> {
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) return
    await this.#refreshTokens.consume(payload.sub, payload.jti)
  }

  /** Logs out every refresh token for a user. */
  async revokeAll(userId: string): Promise<void> {
    await this.#refreshTokens.revokeAll(userId)
  }

  async #issuePair(userId: string, role: TokenUser['role']): Promise<TokenPair> {
    const jti = randomUUID()
    await this.#refreshTokens.store(userId, jti)
    return {
      accessToken: signAccessToken(userId, role),
      refreshToken: signRefreshToken(userId, jti),
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    }
  }
}
