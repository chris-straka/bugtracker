import type { Request, Response, NextFunction } from 'express'
import { authenticateUser, createUser } from '../services/user'

export async function loginUser (req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  try {
    const user = await authenticateUser(email, password)

    // regenerate() creates a req.sessionID for me automatically
    req.session.regenerate((err) => {
      if (err != null) next(err)

      req.session.user = user
      req.session.save((err) => { if (err != null) next(err) })
    })

  } catch (error) {
    // if (!isAuthenticated) res.status(401).json({ message: 'User could not be authenticated or does not exist' })
    next(error)
  }
}

export function logoutUser (req: Request, res: Response, next: NextFunction) {
  // If someone manages to get the old sessionID
  // this will prevent them from using any of the user's session data
  req.session.user = {}

  req.session.destroy((err) => {
    if (err != null) next(err)
  })
}

export async function signupUser (req: Request, _: Response, next: NextFunction) {
  const { name, email, password } = req.body

  try {
    await createUser(name, email, password)

    req.session.regenerate((err) => {
      if (err != null) next(err)
      req.session.user = {}
      req.session.save((err) => { if (err != null) next(err) })
    })
  } catch (error) {
    next(error)
  }
}

export function forgetPassword (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function resetPassword (req: Request, res: Response, next: NextFunction) { 
  console.log(req)
  console.log(res)
  console.log(next)
}
