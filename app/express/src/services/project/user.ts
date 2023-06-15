import type { UserRole } from '../../models/User'
import type { IProjectRepository, IProjectUserRepository } from '../../repositories'
import { 
  ProjectNotFoundError, UserIsNotAuthorizedError, 
  UserIsAlreadyAssignedToThisProjectError, UserIsNotAssignedToThisProjectError 
} from '../../errors'

export class ProjectUserService {
  #projectDb: IProjectRepository
  #projectUserDb: IProjectUserRepository

  constructor(projectDb: IProjectRepository, projectUserDb: IProjectUserRepository) {
    this.#projectDb = projectDb
    this.#projectUserDb = projectUserDb
  }

  async getProjectUsers(projectId: string) {
    const project = await this.#projectDb.getProjectBy('id', projectId)
    if (!project) throw new ProjectNotFoundError()

    return await this.#projectUserDb.getProjectUsers(projectId)
  }

  async addUserToProject(projectId: string, userId: string) {
    const userIsAlreadyAssigned = await this.#projectUserDb.checkIfUserIsAssignedToProject(projectId, userId)
    if (userIsAlreadyAssigned) throw new UserIsAlreadyAssignedToThisProjectError()

    await this.#projectUserDb.addUserToProject(projectId, userId)
  }

  async removeUserFromProject(
    projectId: string, 
    userId: string, 
    userRole: UserRole, 
    userToRemoveId: string) 
  {
    const userAssignment = await this.#projectUserDb.checkIfUserIsAssignedToProject(projectId, userToRemoveId)
    if (!userAssignment) throw new UserIsNotAssignedToThisProjectError()

    if (userRole === 'admin' || userRole === 'owner') {
      return await this.#projectUserDb.removeUserFromProject(projectId, userToRemoveId)
    }

    const project = await this.#projectDb.getProjectBy('id', projectId)

    const isProjectOwner = userId === project.owner_id.toString() 
    const isRemovingTheProjectOwner = userToRemoveId === project.owner_id.toString() 

    if (!isProjectOwner && isRemovingTheProjectOwner) throw new UserIsNotAuthorizedError()

    return await this.#projectUserDb.removeUserFromProject(projectId, userToRemoveId)
  }
}
