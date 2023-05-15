import { 
  ProjectAlreadyExistsError,  ProjectNotFoundError, 
  UserIsNotAuthorizedError, UserNotFoundError 
} from '../../errors'
import { ProjectStatus, Roles } from '../../types'
import { ProjectRepository } from '../../repositories/projects'
import UserRepository from '../../repositories/user'

async function createProject(ownerId: string, name: string, description: string) {
  const project = await ProjectRepository.getProjectByName(name)
  if (project) throw new ProjectAlreadyExistsError()

  return await ProjectRepository.createProject(ownerId, name, description)
}

async function getProjectById(projectId: string) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  return project
}

async function getUserAssignedProjects(userId: string, cursor?: string, limit?: string) {
  const user = await UserRepository.checkIfUserExistsById(userId)
  if (!user) throw new UserNotFoundError()

  const projects = await ProjectRepository.getUserAssignedProjects(userId, cursor, limit)
  const newCursor = projects.length > 0 ? projects[projects.length].id : null

  return { projects, newCursor }
}

async function getUserCreatedProjects(userId: string, cursor?: string, limit?: string) {
  const user = await UserRepository.checkIfUserExistsById(userId)
  if (!user) throw new UserNotFoundError()

  const projects = await ProjectRepository.getUserAssignedProjects(userId, cursor, limit)
  const newCursor = projects.length > 0 ? projects[projects.length].id : null

  return { projects, newCursor }
}

async function updateProject(projectId: string, name: string, description: string, status: ProjectStatus) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  return await ProjectRepository.updateProject(projectId, name, description, status)
}

async function deleteProject(projectId: string, userId: string, userRole: Roles) {
  const project = await ProjectRepository.getProjectById(projectId)
  if (!project) throw new ProjectNotFoundError()

  if (userRole === 'admin') return ProjectRepository.deleteProject(projectId)

  const isTheProjectOwner = project.owner_id.toString() === userId
  if (!isTheProjectOwner) new UserIsNotAuthorizedError()

  return ProjectRepository.deleteProject(projectId)
}

export default {
  createProject,
  getProjectById,
  getUserAssignedProjects,
  getUserCreatedProjects,
  updateProject,
  deleteProject
}