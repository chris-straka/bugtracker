import type { Request, Response, NextFunction } from 'express'
import { activityService, userService, projectService, ticketService, emailService, emailResetService } from '../services'
import { createResetToken } from '../utility'

// GET /me/activity
export async function getUserActivity(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string

  try {
    const activity = await activityService.getUserActivity(userId)
    res.status(200).send(activity)
  } catch (error) {
    return next(error) 
  }
}

// GET /me/my-tickets ?cursor=&limit=
export async function getUserCreatedTickets(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const userCreatedTickets = await ticketService.getUserCreatedTickets(userId, cursor, limit)
    res.status(200).send(userCreatedTickets)
  } catch (error) {
    return next(error)
  }
}

// GET /me/assigned-tickets ?cursor=&limit=
export async function getUserAssignedTickets(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string 
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const { tickets, newCursor } = await ticketService.getUserAssignedTickets(userId, cursor, limit)
    res.status(200).send({ tickets, newCursor })
    res.status(200).send({ tickets, newCursor })
  } catch (error) {
    return next(error) 
  }
}

// GET /me/my-projects ?cursor=&limit=
export async function getUserCreatedProjects(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const results = await projectService.getUserCreatedProjects(userId, cursor, limit)
    res.status(200).send(results)
  } catch (error) {
    return next(error)
  }
}

// GET /me/assigned-projects ?cursor=&limit=
export async function getUserAssignedProjects(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const { projects, newCursor } = await projectService.getUserAssignedProjects(userId, cursor, limit)
    res.status(200).send({ projects, newCursor })
  } catch (error) {
    return next(error) 
  }
}

// PUT /me/users/username
export async function changeUserUsername(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId
  const { newUsername } = req.body 

  try {
    await userService.changeUsername(userId, newUsername)
    res.status(200).send({ username: newUsername })
  } catch (error) {
    return next(error) 
  }
}

// POST /me/email-reset-requests
export async function requestEmailReset(req: Request, res: Response, next: NextFunction) {
  const { newEmail } = req.body
  const userId = req.session.userId as string

  try {
    const currentEmail = await userService.getUserEmail(userId)

    const emailResetToken = createResetToken()
    await emailResetService.storeResetTokenWithEmails(emailResetToken, currentEmail, newEmail)

    const template = await emailService.getEmailResetTemplate()
    const emailTemplateWithToken = await emailService.embedTokenInEmailTemplate(emailResetToken, template)

    await emailService.sendEmail(newEmail, 'Bugtracker: Email Reset', emailTemplateWithToken)

    return res.status(200).send({ message: 'Reset email sent to the new address' })
  } catch (error) {
    return next(error)
  }
}

// DELETE /me
export async function deleteCurrentUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string

  try {
    await userService.deleteCurrentUserById(userId)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}
