import { UserNotFoundError, UserIsNotAuthorizedError } from '../../../errors'
import UserRepository from '../../../repositories/user'
import { AdminProjectRepository } from '../../../repositories/admin'

export async function changeProjectOwner(adminRole: 'admin' | 'owner', projectId: string, newOwnerId: string) {
  const user = await UserRepository.getUserById(newOwnerId)
  if (!user) throw new UserNotFoundError()

  // an admin can't remove another admin from their project
  if (adminRole === 'admin' && user.role === 'admin') {
    throw new UserIsNotAuthorizedError()
  }

  // an admin can't remove an owner from their project
  if (adminRole === 'admin' && user.role === 'owner') {
    throw new UserIsNotAuthorizedError()
  }

  await AdminProjectRepository.adminChangeProjectOwner(projectId, newOwnerId)
}