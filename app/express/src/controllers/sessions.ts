import type { Request, Response, NextFunction } from 'express'
import UserService from '../services/user'

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  try {
    const user = await UserService.authenticateUser(email, password)

    req.session.regenerate((err) => {
      if (err) next(err)

      req.session.id = user.id

      req.session.save((err) => { 
        if (err) next(err) 
        res.status(200).json({ userId: user.id, userEmail: user.email })
      })
    })

  } catch (error) {
    next(error)
  }
}

export function logout(req: Request, res: Response, next: NextFunction) {
  // If someone manages to get the old sessionID
  // this will prevent them from using any of the user's session data
  req.session.userId = null
  req.session.role = null

  req.session.destroy((err) => {
    if (err != null) next(err)
    res.status(204).json({ message: 'Successfully logged out' })
  })
}

export function userIsLoggedIn(req: Request, res: Response) {
  res.status(204).json({ message: 'User is logged in' })
}