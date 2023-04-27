import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse } from 'node-mocks-http'
import { SessionData } from 'express-session'
import { UserIsNotAuthenticatedError } from '../../errors'
import { isAuthenticated } from '../../middleware'

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
        userId: '1'
      } as SessionData
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
})
