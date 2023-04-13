import { Request, Response, NextFunction } from 'express'

export async function changeUserRole(req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}
