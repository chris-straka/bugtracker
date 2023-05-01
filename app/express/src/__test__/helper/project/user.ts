import { createTestUser } from '../user'
import { Roles } from '../../../types'
import ProjectUserRepository from '../../../repositories/project/user'

export async function addUserToProject(projectId: string, role: Roles = 'developer') {
  const user = await createTestUser(role)
  await ProjectUserRepository.addUserToProject(user.id, projectId)
  return { ...user }
}

export async function addUsersToProject(numberOfUsers: number, projectId: string) {
  for (let i = 0; i < numberOfUsers; i++) {
    await addUserToProject(projectId)
  }
}