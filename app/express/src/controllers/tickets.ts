import type { Request, Response, NextFunction } from 'express'

export function createTicket (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function getTicket (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function editTicket (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function deleteTicket (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function getTickets (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function assignDevToTicket (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}

export function removeDevFromTicket (req: Request, res: Response, next: NextFunction) {
  console.log(req)
  console.log(res)
  console.log(next)
}
