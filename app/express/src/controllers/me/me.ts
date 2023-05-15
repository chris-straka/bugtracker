import { NextFunction, Request, Response } from 'express'
import { UserIsNotAuthenticatedError } from '../../errors'
import UserService from '../../services/user'
import ActivityService from '../../services/me/activity'
import { ProjectService } from '../../services/projects'
import TicketService from '../../services/tickets/ticket'

// GET /me/activity
export async function getUserActivity(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    const results = ActivityService.getUserActivity(userId)
    res.status(200).send(results)
  } catch (error) {
    return next(error) 
  }
}

// GET /me/my-tickets ?cursor=&limit=
export async function getUserCreatedTickets(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId 
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    const results = TicketService.getUserAssignedTickets(userId, cursor, limit)
    res.status(200).send(results)
  } catch (error) {
    return next(error)
  }
}

// GET /me/my-projects ?cursor=&limit=
export async function getUserCreatedProjects(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId 
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    const results = TicketService.getUserAssignedTickets(userId, cursor, limit)
    res.status(200).send(results)
  } catch (error) {
    return next(error)
  }
}

// GET /me/assigned-projects ?cursor=&limit=
export async function getUserAssignedProjects(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId 
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    const { projects, newCursor } = await ProjectService.getUserAssignedProjects(userId, cursor, limit)
    res.status(200).send({ projects, newCursor })
  } catch (error) {
    return next(error) 
  }
}

// GET /me/assigned-tickets ?cursor=&limit=
export async function getUserAssignedTickets(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId 
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    const { tickets, newCursor } = await TicketService.getUserAssignedTickets(userId, cursor, limit)
    res.status(200).send({ tickets, newCursor })
    res.status(200).send({ tickets, newCursor })
  } catch (error) {
    return next(error) 
  }
}

// PUT /me/users/email
export async function changeUserEmail(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId
  const { email } = req.body

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    await UserService.changeEmail(userId, email)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}

// PUT /me/users/username
export async function changeUserUsername(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params
  const { username } = req.body

  try {
    await UserService.changeUsername(userId, username)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}

// DELETE /me
export async function deleteCurrentUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    await UserService.deleteUserById(userId)
    res.status(204).send
  } catch (error) {
    return next(error) 
  }
}
