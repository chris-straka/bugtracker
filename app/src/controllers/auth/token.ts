import type { Request, Response, NextFunction } from 'express'
import { tokenService } from '../../services'
import { bearerTokenFromHeader, verifyRefreshToken } from '../../utility/jwt'

// POST /tokens — password login for API/mobile clients. Returns a JWT pair;
// the Redis cookie session is left alone (web browsers keep using /sessions).
export async function createTokens(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  try {
    const { user, tokens } = await tokenService.createPair(email, password)
    res.status(200).json({ user, ...tokens })
  } catch (error) {
    return next(error)
  }
}

// POST /tokens/refresh — single-use refresh token rotation.
export async function refreshTokens(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body

  try {
    const tokens = await tokenService.rotate(refreshToken)
    res.status(200).json(tokens)
  } catch (error) {
    return next(error)
  }
}

// DELETE /tokens — revoke one refresh token (body or Bearer header), or every
// live refresh token for the caller when `all: true` is sent with a Bearer token.
export async function deleteTokens(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body?.all === true) {
      const token = bearerTokenFromHeader(req.headers.authorization)
      const payload = token ? verifyRefreshToken(token) : null
      if (payload) await tokenService.revokeAll(payload.sub)
      res.status(204).send()
      return
    }

    const refreshToken: string | undefined = req.body?.refreshToken
    if (refreshToken) await tokenService.revoke(refreshToken)
    res.status(204).send()
  } catch (error) {
    return next(error)
  }
}
