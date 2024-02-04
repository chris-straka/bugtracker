import type { NextFunction, Request, Response } from 'express'
import { projectUserService } from '../../services'

// GET /projects/:projectId/users
export async function getProjectUsers(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId

  try {
    const users = await projectUserService.getProjectUsers(projectId)
    res.status(200).send(users)
  } catch (error) {
    return next(error) 
  }
}

// POST /projects/:projectId/users
export async function addProjectUser(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId  
  const userId = req.body.userId

  try {
    await projectUserService.addUserToProject(projectId, userId)
    res.status(201).send()
  } catch (error) {
    return next(error)
  }
}

// DELETE /projects/:projectId/users/:userId
export async function removeProjectUser(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId 
  const userToRemoveId = req.params.userId

  try {
    await projectUserService.removeUserFromProject(projectId, userToRemoveId)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}
