import type { UserRole } from '../../../models/User'
import type { TestProject } from '..'
import { createTestUser } from '../user'
import { projectUserRepository } from '../../../repositories'

export async function addUserToProject(projectId: string, userId: string) {
  return await projectUserRepository.addUserToProject(projectId, userId)
}

export async function addUserToProjects(userId: string, projects: TestProject[]) {
  for(const project of projects) {
    await projectUserRepository.addUserToProject(project.id, userId)
  }
}

export async function createNewUserAndAddThemToProject(projectId: string, userRole: UserRole = 'developer') {
  const user = await createTestUser(userRole)
  await projectUserRepository.addUserToProject(projectId, user.id)
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