import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse } from 'node-mocks-http'
import type { UserRole } from '../../models/User'
import { UserIsNotAuthorizedError } from '../../errors'
import { isAuthorized } from '../../middleware'

describe('isAuthorized()', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    res = createResponse()
    next = jest.fn()
  })

  test('When the user has the correct role, they should get passed onto the next middleware', async () => {
    req = createRequest({ 
      session: { 
        userRole: 'admin' 
      }
    })

    const authorizedRoles = ['admin'] as UserRole[]
    isAuthorized(authorizedRoles)(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  test('When the user has the wrong role, they should get a 403', async () => {
    req = createRequest({ 
      session: { 
        userRole: 'developer' 
      }
    })

    const authorizedRoles = ['admin'] as UserRole[]
    isAuthorized(authorizedRoles)(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(expect.any(UserIsNotAuthorizedError))
  })
})
