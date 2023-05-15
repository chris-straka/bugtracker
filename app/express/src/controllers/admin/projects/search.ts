import type { Request, Response, NextFunction } from 'express'
import { AdminProjectService } from '../../../services/admin'

// GET /admin/projects
export async function adminSearchProjects(req: Request, res: Response, next: NextFunction) {
  const { limit, search } = req.body

  try {
    const projects = await AdminProjectService.adminSearchProjects(limit, search)
    res.status(200).send(projects)
  } catch (error) {
    next(error) 
  }
}