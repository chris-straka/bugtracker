import { Request, NextFunction } from 'express'
import { User } from '../models/User'

/** 
 * regenerate() creates a req.sessionID for me automatically
 */
export async function createSession(req: Request, user: User, next: NextFunction) {
  req.session.regenerate((err) => {
    if (err != null) next(err)

    req.session.user = user

    req.session.save((err) => { 
      if (err != null) {
        next(err) 
      }
    })
  })
}