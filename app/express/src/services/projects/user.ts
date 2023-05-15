import { 
  ProjectNotFoundError, UserIsNotAuthorizedError, 
  UserIsAlreadyAssignedToThisProjectError, UserIsNotAssignedToThisProjectError
} from '../../errors'
import { Roles } from '../../types'
import { ProjectRepository, ProjectUserRepository } from '../../repositories/projects'

async function getProjectUsers(projectId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  return await ProjectUserRepository.getProjectUsers(projectId)
}

async function addUserToProject(projectId: string, userId: string) {
  const userIsAlreadyAssigned = await ProjectUserRepository.checkIfUserIsAssignedToProject(projectId, userId)
  if (userIsAlreadyAssigned) throw new UserIsAlreadyAssignedToThisProjectError()

  await ProjectUserRepository.addUserToProject(projectId, userId)
}

async function removeUserFromProject(projectId: string, userId: string, userRole: Roles, userToRemoveId: string) {
  const userAssignment = await ProjectUserRepository.checkIfUserIsAssignedToProject(projectId, userToRemoveId)
  if (!userAssignment) throw new UserIsNotAssignedToThisProjectError()

  if (userRole === 'admin') return await ProjectUserRepository.removeUserFromProject(projectId, userToRemoveId)

  const project = await ProjectRepository.getProjectById(projectId)

  const isProjectOwner = userId === project.owner_id.toString() 
  const isRemovingTheProjectOwner = userToRemoveId === project.owner_id.toString() 

  if (!isProjectOwner && isRemovingTheProjectOwner) throw new UserIsNotAuthorizedError()

  if (isProjectOwner && isRemovingTheProjectOwner) {
    return await ProjectUserRepository.removeUserFromProject(projectId, userToRemoveId)
  }

  return await ProjectUserRepository.removeUserFromProject(projectId, userToRemoveId)
}

export default {
  getProjectUsers,
  addUserToProject,
  removeUserFromProject
}