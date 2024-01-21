import type { IProjectRepository, IProjectUserRepository } from '../../repositories'
import { ProjectNotFoundError, UserIsAlreadyAssignedToThisProjectError, UserIsNotAssignedToThisProjectError, UserIsTheProjectOwnerAndCantBeRemovedError } from '../../errors'

export class ProjectUserService {
  #projectDb: IProjectRepository
  #projectUserDb: IProjectUserRepository

  constructor(projectDb: IProjectRepository, projectUserDb: IProjectUserRepository) {
    this.#projectDb = projectDb
    this.#projectUserDb = projectUserDb
  }

  async getProjectUsers(projectId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    return this.#projectUserDb.getProjectUsers(projectId)
  }

  async addUserToProject(projectId: string, userId: string) {
    const userIsAlreadyAssigned = await this.#projectUserDb.checkIfUserIsAssignedToProject(projectId, userId)
    if (userIsAlreadyAssigned) throw new UserIsAlreadyAssignedToThisProjectError()

    await this.#projectUserDb.addUserToProject(projectId, userId)
  }

  async removeUserFromProject(
    projectId: string, 
    userId: string) 
  {
    const userIsAssigned = await this.#projectUserDb.checkIfUserIsAssignedToProject(projectId, userId)
    if (!userIsAssigned) throw new UserIsNotAssignedToThisProjectError()

    const projectOwnerId = await this.#projectDb.getProjectOwnerId(projectId)
    if (userId === projectOwnerId.toString()) throw new UserIsTheProjectOwnerAndCantBeRemovedError()

    return this.#projectUserDb.removeUserFromProject(projectId, userId)
  }
}
