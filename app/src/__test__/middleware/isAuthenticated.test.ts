import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse } from 'node-mocks-http'
import { SessionData } from 'express-session'
import { UserIsNotAuthenticatedError } from '../../errors'
import { isAuthenticated } from '../../middleware'
import { signAccessToken } from '../../utility/jwt'
import { closeDbConnections } from '../helper/db'

afterAll(async () => {
  await closeDbConnections()
})

describe('isAuthenticated()', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    res = createResponse()
    next = jest.fn()
  })

  it('should 200 if the user is logged in', () => {
    req = createRequest({
      session: {
        userId: '1',
      } as SessionData,
    })

    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  test('If the user is not logged in, it should return 401', () => {
    req = createRequest()

    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(expect.any(UserIsNotAuthenticatedError))
  })

  test('A valid Bearer access token authenticates without a session', () => {
    const token = signAccessToken('7', 'project_manager')
    req = createRequest({ headers: { authorization: `Bearer ${token}` } })

    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
    expect(req.auth).toEqual({ userId: '7', userRole: 'project_manager' })
  })

  test('An invalid Bearer token still returns 401', () => {
    req = createRequest({ headers: { authorization: 'Bearer bogus' } })

    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(expect.any(UserIsNotAuthenticatedError))
  })

  test('The cookie session still wins when both are present', () => {
    const token = signAccessToken('7', 'project_manager')
    req = createRequest({
      headers: { authorization: `Bearer ${token}` },
      session: { userId: '3', userRole: 'admin' } as SessionData,
    })

    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
    expect(req.auth).toBeUndefined()
  })
})
