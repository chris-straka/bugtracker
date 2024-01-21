import { faker } from '@faker-js/faker'
import { projectRepository } from '../../../repositories'

export async function createProject(ownerId: string, name?: string, description?: string) {
  return projectRepository.createProject(
    ownerId,
    name || faker.company.name(), 
    description || faker.company.bs(), 
  )
}

export async function createProjects(pmId: string, numberOfProjects: number, description?: string ) {
  const promises = Array.from(
    { length: numberOfProjects }, 
    () => createProject(pmId, faker.company.name(), description)
  )
  
  return Promise.all(promises)
}
