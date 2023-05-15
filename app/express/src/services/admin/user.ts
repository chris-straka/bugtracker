import { Roles } from '../../types'
import { UserIsNotAuthorizedError, UserNotFoundError } from '../../errors'
import UserRepository from '../../repositories/user'
import AdminRepository from '../../repositories/admin/user'

async function changeUser(
  adminRole: 'admin' | 'owner', 
  userId: string, 
  username?: string, 
  role?: Roles, 
  email?: string
) {
  const user = await UserRepository.getUserById(userId)
  if (!user) throw new UserNotFoundError()

  // an admin can't change an admin
  if (adminRole === 'admin' && user.role === 'admin') {
    throw new UserIsNotAuthorizedError()
  }

  // an admin can't change an owner
  if (adminRole === 'admin' && user.role === 'owner') {
    throw new UserIsNotAuthorizedError()
  }
  
  return await AdminRepository.changeUser(userId, username, email, role)
}

async function deleteUser(adminRole: 'admin' | 'owner', userId: string) {
  const user = await UserRepository.getUserById(userId)
  if (!user) throw new UserNotFoundError()

  // an admin can't delete an admin
  if (adminRole === 'admin' && user.role === 'admin') {
    throw new UserIsNotAuthorizedError()
  }

  // an admin can't delete an owner
  if (adminRole === 'admin' && user.role === 'owner') {
    throw new UserIsNotAuthorizedError()
  }

  return await AdminRepository.deleteUser(userId)
}

export default {
  changeUser,
  deleteUser
}