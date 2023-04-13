import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '.'
import { createRequest, createResponse } from 'node-mocks-http'
import { SessionData } from 'express-session'

describe('isAuthenticated()', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    res = createResponse()
    next = jest.fn()
  })

  test('If the user is logged in, it should return 200', async () => {
    req = createRequest({
      session: {
        userId: '1'
      } as SessionData
    }) 

    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  test('If the user is not logged in, it should return 401', async () => {
    req = createRequest()
    isAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })
})
