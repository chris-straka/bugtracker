import type { IProjectCommentRepository } from '../../repositories'
import { UserIsNotAssignedToThisProjectError, UserIsNotTheOwnerOfThisCommentError } from '../../errors'
import { UserRole } from '../../models/User'

export class ProjectCommentService {
  #projectCommentDb: IProjectCommentRepository

  constructor(projectCommentDb: IProjectCommentRepository) {
    this.#projectCommentDb = projectCommentDb
  }
  
  async createProjectComment(projectId: string, userId: string, comment: string) {
    return this.#projectCommentDb.createProjectComment(projectId, userId, comment)
  }

  async getProjectComments(projectId: string) {
    return this.#projectCommentDb.getProjectComments(projectId)
  }

  async updateProjectComment(commentId: string, userId: string, userRole: UserRole, newComment: string) {
    // admins should be able to update all comments
    if (userRole === 'admin' || userRole === 'owner') {
      return this.#projectCommentDb.updateProjectComment(commentId, newComment)
    }

    // project_managers should be able to update all comments too
    if (userRole === 'project_manager') {
      return this.#projectCommentDb.updateProjectComment(commentId, newComment)
    }

    const projectCommentOwnerId = await this.#projectCommentDb.getProjectCommentOwnerId(commentId)
    const isCommentOwner = userId === projectCommentOwnerId.toString()
    if (!isCommentOwner) throw new UserIsNotTheOwnerOfThisCommentError()

    return this.#projectCommentDb.updateProjectComment(commentId, newComment)
  }

  async deleteProjectComment(commentId: string, userId: string, userRole: UserRole) {
    // admins should be able to delete comments
    if (userRole === 'admin' || userRole === 'owner') {
      return this.#projectCommentDb.deleteProjectComment(commentId)
    }

    // project managers should be able to delete comments
    if (userRole === 'project_manager') {
      return this.#projectCommentDb.deleteProjectComment(commentId)
    }

    const projectCommentOwnerId = await this.#projectCommentDb.getProjectCommentOwnerId(commentId)
    console.log('projectCommentOwnerId', projectCommentOwnerId)

    const isProjectCommentOwner = userId === projectCommentOwnerId.toString()
    if (!isProjectCommentOwner) throw new UserIsNotAssignedToThisProjectError()

    await this.#projectCommentDb.deleteProjectComment(commentId)
  }
}
