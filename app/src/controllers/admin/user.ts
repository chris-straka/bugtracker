import type { Request, Response, NextFunction } from 'express'
import { adminUserService } from '../../services'

// PUT /admin/users/:userId/role
export async function changeUserRole(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const userId = req.params.userId
  const { newRole } = req.body

  try {
    const user = await adminUserService.changeRole(userId, newRole, adminRole)
    res.status(200).send(user)
  } catch (error) {
    return next(error) 
  }
}

// PUT /admin/users/:userId/account-status
export async function changeAccountStatus(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const userId = req.params.userId
  const { newAccountStatus } = req.body

  try {
    const userAccountStatus = await adminUserService.changeAccountStatus(userId, newAccountStatus, adminRole)
    res.status(200).send(userAccountStatus)
  } catch (error) {
    return next(error)
  }
}

// DELETE /admin/users/:userId
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.session.userRole as 'admin' | 'owner'
  const { userId } = req.params

  try {
    await adminUserService.deleteUserById(userId, adminRole)
    res.status(204).send()
  } catch (error) {
    return next(error) 
  }
}