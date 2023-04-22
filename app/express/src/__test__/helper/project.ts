import { faker } from '@faker-js/faker'
import ProjectRepository from '../../repositories/project'

export async function createProject(ownerId: string) {
  return await ProjectRepository.createProject(
    faker.company.name(),
    faker.company.bs(),
    ownerId
  )
}

export async function createProjects(numberOfProjects: number, ownerId: string) {
  for (let i = 0; i < numberOfProjects; i++) {
    await createProject(ownerId)
  }
}

export async function addUserToProject(projectId: string) {

}

export async function createProjectComment(projectId: string, ownerId: string) {
  return await ProjectRepository.createProjectComment(faker.lorem.paragraph(), ownerId, projectId)
}

export async function createProjectComments(numberOfComments: number, projectId: string, ownerId: string) {
  for (let i = 0; i < numberOfComments; i++) {
    await createProjectComment(projectId, ownerId)
  }
}
