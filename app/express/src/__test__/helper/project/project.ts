import { faker } from '@faker-js/faker'
import { ProjectRepository } from '../../../repositories/projects'

export async function createProject(ownerId: string, name?: string, description?: string) {
  const project = await ProjectRepository.createProject(
    name || faker.company.name(), 
    description || faker.company.bs(), 
    ownerId
  )

  return { ...project, id: project.id.toString() }
}

export async function createProjects(pmId: string, numberOfProjects: number, description?: string ) {
  const promises = Array.from(
    { length: numberOfProjects }, 
    () => createProject(pmId, faker.internet.userName(), description)
  )
  
  return await Promise.all(promises)
}
