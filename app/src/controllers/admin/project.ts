import type { Request, Response, NextFunction } from 'express'
import { adminProjectService } from '../../services'

// GET /admin/projects
export async function searchAllProjects(req: Request, res: Response, next: NextFunction) {
  const search = req.query.search as string 
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const projects = await adminProjectService.searchAllProjects(search, cursor, limit)
    res.status(200).send(projects)
  } catch (error) {
    return next(error) 
  }
}

// PUT /admin/project/:projectId/owner
export async function changeProjectOwner(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const projectId = req.body.projectId
  const newOwnerId = req.body.userId

  try {
    const user = await adminProjectService.changeProjectOwner(adminRole, projectId, newOwnerId)
    res.status(200).send(user)
  } catch (error) {
    return next(error) 
  }
}
