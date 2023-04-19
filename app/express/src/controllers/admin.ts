import { Request, Response, NextFunction } from 'express'
import AdminService from '../services/admin'
import UserService from '../services/user'

// PUT /admin/users/:userId
export async function changeUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params
  const { email, username, role } = req.body

  try {
    await AdminService.changeUser({ id: userId, email, username, role })

    const updatedUser = await UserService.getUserById(userId)
    res.status(200).send({ user: updatedUser })
  } catch (error) {
    return next(error) 
  }
}
