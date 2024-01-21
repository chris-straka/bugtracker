import { Request, Response, NextFunction, Handler} from 'express'

export const tryCatch = (controller: Handler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res, next) 
  } catch (error) {
    next(error) 
  }
}