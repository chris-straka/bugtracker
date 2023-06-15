import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../../models/User'
import { projectService } from '../../services'

// GET /projects/:projectId
export async function getProject(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId

  try {
    const project = await projectService.getProjectById(projectId) 
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
    const project = await projectService.createProject(userId, name, description)
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
    const project = await projectService.updateProject(projectId, name, description, status) 
    res.status(200).send(project)
  } catch (error) {
    return next(error) 
  }
}

// DELETE /projects/:projectId
export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.projectId
  const userId = req.session.userId as string
  const userRole = req.session.userRole as UserRole

  try {
    await projectService.deleteProject(projectId, userId, userRole)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}
