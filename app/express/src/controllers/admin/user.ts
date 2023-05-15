import type { Request, Response, NextFunction } from 'express'
import AdminService from '../../services/admin/user'

// PUT /admin/users/:userId
export async function changeUser(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const userId = req.params.userId
  const { email, username, newRole } = req.body

  try {
    const user = await AdminService.changeUser(adminRole, userId, email, username, newRole)
    res.status(200).send(user)
  } catch (error) {
    return next(error) 
  }
}

// DELETE /admin/users/:userId
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const { userId } = req.params

  try {
    await AdminService.deleteUser(adminRole, userId)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}