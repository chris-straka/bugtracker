import type { ProjectStatus } from '../../models/Project'
import type { UserRole } from '../../models/User'
import type { IProjectRepository, IUserRepository } from '../../repositories'
import { ProjectAlreadyExistsError,  ProjectNotFoundError, UserIsNotAuthorizedError, UserNotFoundError } from '../../errors'

export class ProjectService {
  #projectDb: IProjectRepository
  #userDb: IUserRepository

  constructor(projectDb: IProjectRepository, userDb: IUserRepository) {
    this.#projectDb = projectDb
    this.#userDb = userDb
  }

  async createProject(ownerId: string, name: string, description: string) {
    const project = await this.#projectDb.getProjectBy('name', name)
    if (project) throw new ProjectAlreadyExistsError()

    return await this.#projectDb.createProject(ownerId, name, description)
  }

  async getProjectById(projectId: string) {
    const project = await this.#projectDb.getProjectBy('id', projectId)
    if (!project) throw new ProjectNotFoundError()

    return project
  }

  async getUserAssignedProjects(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsBy('id', userId)
    if (!user) throw new UserNotFoundError()

    const projects = await this.#projectDb.getUserAssignedProjects(userId, cursor, limit)
    const newCursor = projects.length > 0 ? projects[projects.length].id : null

    return { projects, newCursor }
  }

  async getUserCreatedProjects(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsBy('id', userId)
    if (!user) throw new UserNotFoundError()

    const projects = await this.#projectDb.getUserAssignedProjects(userId, cursor, limit)
    const newCursor = projects.length > 0 ? projects[projects.length].id : null

    return { projects, newCursor }
  }

  async updateProject(projectId: string, name: string, description: string, status: ProjectStatus) {
    const project = await this.#projectDb.getProjectBy('id', projectId)
    if (!project) throw new ProjectNotFoundError()

    return await this.#projectDb.updateProject(projectId, name, description, status)
  }

  async deleteProject(projectId: string, userId: string, userRole: UserRole) {
    const project = await this.#projectDb.getProjectBy('id', projectId)
    if (!project) throw new ProjectNotFoundError()

    if (userRole === 'admin') return this.#projectDb.deleteProject(projectId)

    const isTheProjectOwner = project.owner_id.toString() === userId
    if (!isTheProjectOwner) new UserIsNotAuthorizedError()

    return this.#projectDb.deleteProject(projectId)
  }
}
