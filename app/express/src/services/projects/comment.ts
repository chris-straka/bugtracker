import { ProjectCommentNotFoundError, UserIsNotAuthorizedError } from '../../errors'
import { ProjectCommentRepository, ProjectRepository } from '../../repositories/projects'
import { Roles } from '../../types'

async function createProjectComment(projectId: string, userId: string, comment: string) {
  return await ProjectCommentRepository.createProjectComment(projectId, userId, comment)
}

async function getProjectComments(projectId: string) {
  return await ProjectRepository.getProjectById(projectId)
}

async function updateProjectComment(commentId: string, userId: string, userRole: Roles, newComment: string) {
  const projectComment = await ProjectCommentRepository.getProjectCommentById(commentId)
  if (!projectComment) throw new ProjectCommentNotFoundError()

  if (userRole === 'admin') return await ProjectCommentRepository.updateProjectComment(commentId, newComment)
  if (userRole === 'project_manager') return await ProjectCommentRepository.updateProjectComment(commentId, newComment)

  const isCommentOwner = userId === projectComment.owner_id.toString()
  if (!isCommentOwner) throw new UserIsNotAuthorizedError()

  return await ProjectCommentRepository.updateProjectComment(commentId, newComment)
}

async function deleteProjectComment(commentId: string, userId: string, userRole: Roles) {
  if (userRole === 'admin') await ProjectCommentRepository.deleteProjectComment(commentId)
  if (userRole === 'project_manager') await ProjectCommentRepository.deleteProjectComment(commentId)

  const projectComment = await ProjectCommentRepository.getProjectCommentById(commentId)
  const isProjectCommentOwner = userId === projectComment.owner_id.toString()
  if (!isProjectCommentOwner) throw new UserIsNotAuthorizedError()

  await ProjectCommentRepository.deleteProjectComment(commentId)
}

export default {
  createProjectComment,
  getProjectComments,
  updateProjectComment,
  deleteProjectComment
}