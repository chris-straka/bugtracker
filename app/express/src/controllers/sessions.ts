import type { Request, Response, NextFunction } from 'express'
import UserService from '../services/user'

// POST /sessions
export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  try {
    const user = await UserService.authenticateUser(email, password)

    req.session.regenerate((err) => {
      if (err) return next(err)

      req.session.userId = user.id.toString()
      req.session.userRole = user.role

      req.session.save((err) => { 
        if (err) return next(err) 

        res.status(200).json({ 
          user: { 
            id: user.id, 
            email: user.email, 
            role: user.role, 
            username: user.username
          }
        })

      })
    })
  } catch (error) {
    return next(error)
  }
}

// DELETE /sessions
export function logout(req: Request, res: Response, next: NextFunction) {
  // If someone manages to get the old sessionID
  // this will prevent them from using any of the user's session data
  req.session.userId = null
  req.session.userRole = null

  req.session.destroy((err) => {
    if (err != null) return next(err)
    res.status(204).json({ message: 'Successfully logged out' })
  })
}
