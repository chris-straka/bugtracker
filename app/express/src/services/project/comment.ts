import type { IProjectCommentRepository } from '../../repositories'
import { ProjectCommentNotFoundError, UserIsNotAuthorizedError } from '../../errors'
import { UserRole } from '../../models/User'

export class ProjectCommentService {
  #projectCommentDb: IProjectCommentRepository

  constructor(projectCommentDb: IProjectCommentRepository) {
    this.#projectCommentDb = projectCommentDb
  }
  
  async createProjectComment(projectId: string, userId: string, comment: string) {
    return await this.#projectCommentDb.createProjectComment(projectId, userId, comment)
  }

  async getProjectComments(projectId: string) {
    return await this.#projectCommentDb.getProjectComments(projectId)
  }

  async updateProjectComment(commentId: string, userId: string, userRole: UserRole, newComment: string) {
    const projectComment = await this.#projectCommentDb.getProjectCommentById(commentId)
    if (!projectComment) throw new ProjectCommentNotFoundError()

    if (userRole === 'admin') return await this.#projectCommentDb.updateProjectComment(commentId, newComment)
    if (userRole === 'project_manager') return await this.#projectCommentDb.updateProjectComment(commentId, newComment)

    const isCommentOwner = userId === projectComment.owner_id.toString()
    if (!isCommentOwner) throw new UserIsNotAuthorizedError()

    return await this.#projectCommentDb.updateProjectComment(commentId, newComment)
  }

  async deleteProjectComment(commentId: string, userId: string, userRole: UserRole) {
    if (userRole === 'admin') await this.#projectCommentDb.deleteProjectComment(commentId)
    if (userRole === 'project_manager') await this.#projectCommentDb.deleteProjectComment(commentId)

    const projectComment = await this.#projectCommentDb.getProjectCommentById(commentId)
    const isProjectCommentOwner = userId === projectComment.owner_id.toString()
    if (!isProjectCommentOwner) throw new UserIsNotAuthorizedError()

    await this.#projectCommentDb.deleteProjectComment(commentId)
  }
}
