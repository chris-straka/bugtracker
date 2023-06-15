import type { IUserRepository, IProjectRepository } from '../../repositories'
import { UserNotFoundError, UserIsNotAuthorizedError } from '../../errors'

export class AdminProjectService {
  #userDb: IUserRepository
  #projectDb: IProjectRepository

  constructor(userDb: IUserRepository, projectDb: IProjectRepository) {
    this.#userDb = userDb
    this.#projectDb = projectDb 
  }

  async changeProjectOwner(adminRole: 'admin' | 'owner', projectId: string, newOwnerId: string) {
    const user = await this.#userDb.getUserBy('id', newOwnerId)
    if (!user) throw new UserNotFoundError()

    // an admin can't remove another admin from their project
    if (adminRole === 'admin' && user.role === 'admin') {
      throw new UserIsNotAuthorizedError()
    }

    // an admin can't remove an owner from their project
    if (adminRole === 'admin' && user.role === 'owner') {
      throw new UserIsNotAuthorizedError()
    }

    await this.#projectDb.changeProjectOwner(projectId, newOwnerId)
  }

  async searchAllProjects(search: string, cursor?: string, limit?: string) {
    return await this.#projectDb.searchAllProjects(search, cursor, limit)
  }
}
