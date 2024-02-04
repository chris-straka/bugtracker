import type { IUserRepository, IProjectRepository } from '../../repositories'
import { UserNotFoundError, UserIsNotAssignedToThisProjectError } from '../../errors'

export class AdminProjectService {
  #userDb: IUserRepository
  #projectDb: IProjectRepository

  constructor(userDb: IUserRepository, projectDb: IProjectRepository) {
    this.#userDb = userDb
    this.#projectDb = projectDb 
  }

  async changeProjectOwner(projectId: string, newOwnerId: string, adminRole: 'admin' | 'owner') {
    const user = await this.#userDb.getUserById(newOwnerId)
    if (!user) throw new UserNotFoundError()

    // an admin can't remove an admin or an owner from their own project
    if (adminRole === 'admin') {
      if (user.role === 'admin' || user.role === 'owner') {
        throw new UserIsNotAssignedToThisProjectError()
      }
    }

    await this.#projectDb.changeProjectOwner(projectId, newOwnerId)
  }

  async searchAllProjects(search: string, cursor?: string, limit?: string) {
    return this.#projectDb.searchAllProjects(search, cursor, limit)
  }
}
