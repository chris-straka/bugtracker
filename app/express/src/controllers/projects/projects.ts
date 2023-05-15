import { NextFunction, Request, Response } from 'express'
import { ProjectService } from '../../services/projects'
import { Roles } from '../../types'

// GET /projects/:projectId
export async function getProject(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId

  try {
    const project = await ProjectService.getProjectById(projectId) 
    res.status(200).send(project)
  } catch (error) {
    return next(error) 
  }
}

// POST /projects
export async function createProject(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId as string
  const { name, description } = req.body

  try {
    const project = await ProjectService.createProject(userId, name, description)
    res.status(201).send(project)
  } catch (error) {
    return next(error) 
  }
}

// PUT /projects/:projectId
export async function updateProject(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const { name, description, status } = req.body

  try {
    const project = await ProjectService.updateProject(projectId, name, description, status) 
    res.status(200).send(project)
  } catch (error) {
    return next(error) 
  }
}

// DELETE /projects/:projectId
export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const userId = req.session.userId as string
  const userRole = req.session.userRole as Roles

  try {
    await ProjectService.deleteProject(projectId, userId, userRole)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}
