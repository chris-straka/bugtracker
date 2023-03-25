import type { Request, Response, NextFunction } from 'express'
// import sessions from '../config/session'

export function loginUser (req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body

  try {
    res.send(email)
    res.send(password)
  } catch (error) {
    next(error)
  }
}

export function logoutUser (req: Request, res: Response, next: NextFunction): void { }
export function signupUser (req: Request, res: Response, next: NextFunction): void { }
export function forgetPassword (req: Request, res: Response, next: NextFunction): void { }
export function resetPassword (req: Request, res: Response, next: NextFunction): void { }
