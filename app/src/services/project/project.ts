import type { ProjectStatus } from '../../models/Project'
import type { UserRole } from '../../models/User'
import type { IProjectRepository, IUserRepository } from '../../repositories'
import { ProjectAlreadyExistsError,  ProjectNotFoundError, UserIsNotAssignedToThisProjectError, UserNotFoundError } from '../../errors'

export class ProjectService {
  #projectDb: IProjectRepository
  #userDb: IUserRepository

  constructor(projectDb: IProjectRepository, userDb: IUserRepository) {
    this.#projectDb = projectDb
    this.#userDb = userDb
  }

  async createProject(ownerId: string, name: string, description: string) {
    const project = await this.#projectDb.getProjectByName(name)
    if (project) throw new ProjectAlreadyExistsError()

    return this.#projectDb.createProject(ownerId, name, description)
  }

  async getProjectById(projectId: string) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    return project
  }

  async getUserAssignedProjects(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsById(userId)
    if (!user) throw new UserNotFoundError()

    const projects = await this.#projectDb.getUserAssignedProjects(userId, cursor, limit)
    const newCursor = projects.length > 0 ? projects[projects.length].id : null

    return { projects, newCursor }
  }

  async getUserCreatedProjects(userId: string, cursor?: string, limit?: string) {
    const user = await this.#userDb.userExistsById(userId)
    if (!user) throw new UserNotFoundError()

    const projects = await this.#projectDb.getUserAssignedProjects(userId, cursor, limit)
    const newCursor = projects.length > 0 ? projects[projects.length].id : null

    return { projects, newCursor }
  }

  async updateProject(projectId: string, name: string, description: string, status: ProjectStatus) {
    return this.#projectDb.updateProject(projectId, name, description, status)
  }

  async deleteProject(projectId: string, userId: string, userRole: UserRole) {
    const project = await this.#projectDb.getProjectById(projectId)
    if (!project) throw new ProjectNotFoundError()

    if (userRole === 'admin') return this.#projectDb.deleteProject(projectId)

    const isTheProjectOwner = userId === project.owner_id.toString()
    if (!isTheProjectOwner) new UserIsNotAssignedToThisProjectError()

    return this.#projectDb.deleteProject(projectId)
  }
}
