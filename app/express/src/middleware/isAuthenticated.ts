import { type Request, type Response, type NextFunction } from 'express'

export const isAuthenticated = (req: Request, _: Response, next: NextFunction): void => {
  console.log('isAuthenticated')
}
