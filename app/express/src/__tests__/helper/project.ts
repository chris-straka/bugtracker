import { faker } from '@faker-js/faker'
import ProjectRepository from '../../repositories/project'

export async function createProjects(numberOfProjects: number, owner_id: string) {
  const projectIds = []

  for (let i = 0; i < numberOfProjects; i++) {

    const project = await ProjectRepository.createProject(
      faker.company.name(), 
      faker.company.bs(), 
      owner_id
    )

    projectIds.push(project.id)
  }

  return projectIds
}

export async function createProject(owner_id: string) {
  const projectName = faker.company.name()
  const projectDescription = faker.company.bs()
  const projectOwner = owner_id

  return await ProjectRepository.createProject(
    projectName,
    projectDescription,
    projectOwner    
  )
}

export async function createRandomProjectComment(
  project_id: string, 
  owner_id: string
) {
  const commentText = faker.lorem.paragraph()
  return await ProjectRepository.createProjectComment(commentText, owner_id, project_id)
}

export async function deleteProjects(projectIds: number[]) {
  for (const id in projectIds) {
    await ProjectRepository.deleteProject(id)
  }
}