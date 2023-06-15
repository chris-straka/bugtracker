import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services'

// POST /sessions
export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body
  // const { email, password, rememberMe } = req.body;

  try {
    const user = await authService.authenticateUser(email, password)

    req.session.regenerate((err) => {
      if (err) return next(err)

      req.session.userId = user.id.toString()
      req.session.userRole = user.role

      // If the user checked "Remember Me", set the session cookie to expire in 30 days
      // Otherwise, set it to expire when the browser is closed
      // if (rememberMe) {
      //   req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
      // } else {
      //   req.session.cookie.expires = false
      // }

      req.session.save((err) => { 
        if (err) return next(err) 

        res.status(200).json({ 
          user: { 
            id: user.id, 
            username: user.username,
            email: user.email, 
            role: user.role, 
          }
        })

      })
    })
  } catch (error) {
    return next(error)
  }
}

// DELETE /sessions
export async function logout(req: Request, res: Response, next: NextFunction) {
  // If someone manages to get the old sessionID
  // this will prevent them from using any of the user's session data
  req.session.userId = null
  req.session.userRole = null

  req.session.destroy((err) => {
    if (err != null) return next(err)
    res.status(204).json({ message: 'Successfully logged out' })
  })
}