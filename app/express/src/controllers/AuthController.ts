import type { Request, Response, NextFunction } from 'express'
import sessions from '../config/session'

export function loginUser (req: Request, res: Response, next: NextFunction): void {
  console.log(sessions)
  res.sendStatus(200)
}

export function logoutUser (req: Request, res: Response, next: NextFunction): void { }
export function signupUser (req: Request, res: Response, next: NextFunction): void { }
export function forgetPassword (req: Request, res: Response, next: NextFunction): void { }
export function resetPassword (req: Request, res: Response, next: NextFunction): void { }
