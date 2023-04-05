import { Request, Response, NextFunction } from 'express'

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