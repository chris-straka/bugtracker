import type { Request, Response, NextFunction } from 'express'
import { adminUserService } from '../../services'

// PUT /admin/users/:userId
export async function changeUser(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const userId = req.params.userId
  const { email, username } = req.body

  try {
    const user = await adminUserService.changeUser(adminRole, userId, username, email)
    res.status(200).send(user)
  } catch (error) {
    return next(error) 
  }
}

// PUT /admin/users/:userId/role
export async function changeUserRole(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const userId = req.params.userId
  const { newRole } = req.body

  try {
    const user = await adminUserService.changeRole(userId, adminRole, newRole)
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
    await adminUserService.deleteUserBy('id', adminRole, userId)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}