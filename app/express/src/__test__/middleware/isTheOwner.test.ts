import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse } from 'node-mocks-http'
import { UserIsNotAllowedToChangeThisResourceError } from '../../errors'
import { isTheOwner } from '../../middleware'

describe('isTheOwner()', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    res = createResponse()
    next = jest.fn()
  })

  test('If they are the owner they should move onto the next middleware', () => {
    req = createRequest({
      session: {
        userId: 12903
      },
      params: {
        userId: 12903
      }
    })

    isTheOwner(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  test('If they are not the owner, it should error out', () => {
    req = createRequest({
      session: {
        userId: 12903
      },
      params: {
        userId: 12902
      }
    })

    isTheOwner(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(expect.any(UserIsNotAllowedToChangeThisResourceError))
  })
})