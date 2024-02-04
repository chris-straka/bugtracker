import type { UserRole } from '../../../models/User'
import type { Project } from '../../../models/Project'
import { createTestUser } from '../user'
import { projectUserRepository } from '../../../repositories'

export async function addUserToProject(projectId: string, userId: string) {
  return projectUserRepository.addUserToProject(projectId, userId)
}

export async function addUserToProjects(userId: string, projects: Project[]) {
  for(const project of projects) {
    await projectUserRepository.addUserToProject(project.id.toString(), userId)
  }
}

export async function createNewUserAndAddThemToProject(projectId: string, userRole: UserRole = 'developer') {
  const user = await createTestUser(userRole)
  await projectUserRepository.addUserToProject(projectId, user.id.toString())
  return user 
}

export async function createNewUsersAndAddThemToProject(projectId: string, numberOfNewUsers: number) {
  const users = [] 

  for (let i = 0; i < numberOfNewUsers; i++) {
    const user = await createNewUserAndAddThemToProject(projectId)
    users.push(user)
  }

  return users
}