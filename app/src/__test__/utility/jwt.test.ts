import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  bearerTokenFromHeader,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from '../../utility/jwt'

describe('JWT utility', () => {
  describe('access tokens', () => {
    it('round-trips the user id and role', () => {
      const token = signAccessToken('42', 'developer')
      expect(verifyAccessToken(token)).toEqual({ sub: '42', role: 'developer' })
    })

    it('rejects tampered tokens', () => {
      const token = signAccessToken('42', 'developer')
      const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')
      expect(verifyAccessToken(tampered)).toBeNull()
    })

    it('rejects an empty token and a refresh token in its place', () => {
      expect(verifyAccessToken('')).toBeNull()
      expect(verifyAccessToken('not-a-jwt')).toBeNull()
      expect(verifyAccessToken(signRefreshToken('42', 'some-jti'))).toBeNull()
    })

    it('uses a short (minutes-scale) lifetime', () => {
      expect(ACCESS_TOKEN_TTL_SECONDS).toBe(15 * 60)
    })
  })

  describe('refresh tokens', () => {
    it('round-trips the user id and token id', () => {
      const token = signRefreshToken('42', 'jti-123')
      expect(verifyRefreshToken(token)).toEqual({ sub: '42', jti: 'jti-123' })
    })

    it('rejects tampered tokens and access tokens in its place', () => {
      const token = signRefreshToken('42', 'jti-123')
      expect(verifyRefreshToken(token + 'x')).toBeNull()
      expect(verifyRefreshToken(signAccessToken('42', 'developer'))).toBeNull()
    })

    it('lives much longer than an access token', () => {
      expect(REFRESH_TOKEN_TTL_SECONDS).toBeGreaterThan(ACCESS_TOKEN_TTL_SECONDS)
    })
  })

  describe('bearerTokenFromHeader()', () => {
    it('extracts the token from a Bearer header', () => {
      expect(bearerTokenFromHeader('Bearer abc.def.ghi')).toBe('abc.def.ghi')
    })

    it('accepts any casing of the scheme', () => {
      expect(bearerTokenFromHeader('bearer abc')).toBe('abc')
    })

    it.each([undefined, '', 'Token abc', 'Bearer', 'Basic abc'])(
      'returns null for %p',
      (header) => {
        expect(bearerTokenFromHeader(header)).toBeNull()
      },
    )
  })
})
