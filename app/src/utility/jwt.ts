import jwt from 'jsonwebtoken'
import type { UserRole } from '../models/User'

export interface AccessTokenPayload {
  /** The authenticated user's id. */
  sub: string
  role: UserRole
}

export interface RefreshTokenPayload {
  /** The authenticated user's id. */
  sub: string
  /** Unique token id used for rotation / reuse detection. */
  jti: string
}

/** Short-lived access tokens (minutes). API/mobile clients send these as `Bearer` tokens. */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60
/** Long-lived refresh tokens (seconds). Rotated on every use. */
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60

function accessSecret(): string {
  // Dedicated secret when configured; otherwise the existing session secret so a
  // stock `.env` (SESSIONS_SECRET only) keeps working in dev/test.
  return process.env.JWT_ACCESS_SECRET ?? requiredSessionSecret()
}

function refreshSecret(): string {
  return process.env.JWT_REFRESH_SECRET ?? requiredSessionSecret()
}

function requiredSessionSecret(): string {
  const secret = process.env.SESSIONS_SECRET
  if (!secret) throw new Error('Neither JWT_ACCESS_SECRET/JWT_REFRESH_SECRET nor SESSIONS_SECRET is set')
  return secret
}

export function signAccessToken(userId: string, role: UserRole): string {
  const payload: AccessTokenPayload = { sub: userId, role }
  return jwt.sign(payload, accessSecret(), { expiresIn: ACCESS_TOKEN_TTL_SECONDS })
}

export function signRefreshToken(userId: string, jti: string): string {
  const payload: RefreshTokenPayload = { sub: userId, jti }
  return jwt.sign(payload, refreshSecret(), { expiresIn: REFRESH_TOKEN_TTL_SECONDS })
}

/** Returns the payload, or null when the token is missing, malformed, or expired. */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, accessSecret())
    if (typeof decoded === 'string' || !decoded.sub || !decoded.role) return null
    return { sub: String(decoded.sub), role: decoded.role as UserRole }
  } catch {
    return null
  }
}

/** Returns the payload, or null when the token is missing, malformed, or expired. */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, refreshSecret())
    if (typeof decoded === 'string' || !decoded.sub || !decoded.jti) return null
    return { sub: String(decoded.sub), jti: String(decoded.jti) }
  } catch {
    return null
  }
}

/** Extracts a `Bearer <token>` value from an Authorization header. */
export function bearerTokenFromHeader(header: string | undefined): string | null {
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) return null
  return token
}
