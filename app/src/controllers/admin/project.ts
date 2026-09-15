import type { Request, Response, NextFunction } from 'express'
import { adminProjectService } from '../../services'
import { getRequestAuth, routeParam } from '../../utility'

// GET /admin/projects
export async function searchAllProjects(req: Request, res: Response, next: NextFunction) {
  const search = req.query.search as string | undefined
  const cursor = req.query.cursor as string | undefined
  const limit = req.query.limit as string | undefined

  try {
    const projects = await adminProjectService.searchAllProjects(search, cursor, limit)
    res.status(200).send(projects)
  } catch (error) {
    return next(error)
  }
}

// PUT /admin/projects/:projectId/owner
export async function changeProjectOwner(req: Request, res: Response, next: NextFunction) {
  const adminRole = getRequestAuth(req)?.userRole as 'admin' | 'owner'
  const projectId = routeParam(req.params.projectId)
  const newOwnerId = req.body.id

  try {
    await adminProjectService.changeProjectOwner(projectId, newOwnerId, adminRole)
    res.status(200).send({ message: 'Project ownership transferred' })
  } catch (error) {
    return next(error)
  }
}
