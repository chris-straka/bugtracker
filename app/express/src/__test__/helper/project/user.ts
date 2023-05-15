import { createTestUser } from '../user'
import { Roles } from '../../../types'
import { TestProject } from '..'
import { ProjectUserRepository } from '../../../repositories/projects'

export async function addUserToProject(userId: string, projectId: string ) {
  return await ProjectUserRepository.addUserToProject(userId, projectId)
}

export async function addUserToProjects(userId: string, projects: TestProject[]) {
  for(const ticket of projects) {
    await ProjectUserRepository.addUserToProject(ticket.id, userId)
  }
}

export async function createNewUserAndAddThemToProject(projectId: string, userRole: Roles = 'developer') {
  const user = await createTestUser(userRole)
  await ProjectUserRepository.addUserToProject(user.id, projectId)
  return user 
}

export async function createNewUsersAndAddThemToProject(numberOfNewUsers: number, projectId: string) {
  const users = [] 

  for (let i = 0; i < numberOfNewUsers; i++) {
    const user = await createNewUserAndAddThemToProject(projectId)
    users.push(user)
  }

  return users
}