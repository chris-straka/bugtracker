import { Request, Response, NextFunction } from 'express'
import { userService } from '../services'

// POST /users 
export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body

  try {
    const user = await userService.createUser(username, email, password, 'contributor')

    req.session.regenerate((err) => {
      if (err != null) return next(err)

      req.session.userId = user.id.toString()
      req.session.userRole = user.role

      req.session.save((err) => { 
        if (err != null) next(err) 
        res.status(201).json({ 
          user: { 
            id: user.id, 
            email: user.email, 
            username: user.username, 
            role: user.role 
          } 
        })
      })
    })

  } catch (error) {
    return next(error)
  }
}