import type { Request, Response, NextFunction } from 'express'
import { authenticateUser, createNewUser } from '../services/user'

export async function loginUser (req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  try {
    const user = await authenticateUser(email, password)

    req.session.regenerate((err) => {
      if (err) next(err)
      req.session.user = user
      req.session.save((err) => { 
        if (err) next(err) 
        res.status(200).json({ message: 'Successfully logged in' })
      })
    })

  } catch (error) {
    next(error)
  }
}

export function logoutUser (req: Request, res: Response, next: NextFunction) {
  // If someone manages to get the old sessionID
  // this will prevent them from using any of the user's session data
  req.session.user = {}

  req.session.destroy((err) => {
    if (err != null) next(err)
    res.status(200).json({message: 'Successfully logged out'})
  })
}

export async function signupUser (req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body

  try {
    const user = await createNewUser(name, email, password)

    req.session.regenerate((err) => {
      if (err != null) next(err)
      req.session.user = user
      req.session.save((err) => { 
        if (err != null) next(err) 
        res.status(201).json({ message: 'Successfully signed up' })
      })
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
