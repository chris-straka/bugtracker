import { Request, Response, NextFunction } from 'express'

export function getProjectComments (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function createProjectComment (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function editProjectComment (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function deleteProjectComment (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}