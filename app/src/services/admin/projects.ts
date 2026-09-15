import type { IUserRepository, IProjectRepository, IProjectUserRepository } from '../../repositories'
import { ProjectNotFoundError, UserIsNotAssignedToThisProjectError, UserNotFoundError } from '../../errors'

export class AdminProjectService {
  #userDb: IUserRepository
  #projectDb: IProjectRepository
  #projectUserDb: IProjectUserRepository

  constructor(userDb: IUserRepository, projectDb: IProjectRepository, projectUserDb: IProjectUserRepository) {
    this.#userDb = userDb
    this.#projectDb = projectDb
    this.#projectUserDb = projectUserDb
  }

  async changeProjectOwner(projectId: string, newOwnerId: string, adminRole: 'admin' | 'owner') {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    const user = await this.#userDb.getUserById(newOwnerId)
    if (!user) throw new UserNotFoundError()

    // An admin can't hand a project to an admin or an owner, and only a
    // project manager can own a project at all.
    if (adminRole === 'admin' && (user.role === 'admin' || user.role === 'owner')) {
      throw new UserIsNotAssignedToThisProjectError()
    }
    if (user.role !== 'project_manager') throw new UserIsNotAssignedToThisProjectError()

    const isAssigned = await this.#projectUserDb.checkIfUserIsAssignedToProject(projectId, newOwnerId)
    if (!isAssigned) throw new UserIsNotAssignedToThisProjectError()

    const updated = await this.#projectDb.changeProjectOwner(projectId, newOwnerId)
    if (!updated) throw new ProjectNotFoundError()
  }

  async searchAllProjects(search?: string, cursor?: string, limit?: string) {
    const projects = await this.#projectDb.searchAllProjects(search, cursor, limit)
    const nextCursor = projects.length > 0 ? projects[projects.length - 1].id : null

    return { projects, nextCursor }
  }
}
