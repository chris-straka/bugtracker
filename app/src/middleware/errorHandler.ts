import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors'

export function errorHandler(error: Error, req: Request, res: Response, _: NextFunction) {
  if (error instanceof AppError) {
    res.status(error.statusCode).send(error.message)
  } else {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
}
