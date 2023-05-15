import type { Request, Response, NextFunction } from 'express'
import { AdminProjectService } from '../../../services/admin'

// PUT /admin/project/:projectId/owner
export async function changeProjectOwner(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const projectId = req.body.projectId
  const newOwnerId = req.body.userId

  try {
    const user = await AdminProjectService.changeProjectOwner(adminRole, projectId, newOwnerId)
    res.status(200).send(user)
  } catch (error) {
    return next(error) 
  }
}