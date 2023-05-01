import { faker } from '@faker-js/faker'
import { createPmAndProject } from '.'
import ProjectCommentRepository from '../../../repositories/project/comment'

export async function createProjectComment(projectId: string, ownerId: string) {
  return await ProjectCommentRepository.createProjectComment(faker.lorem.paragraph(), ownerId, projectId)
}

export async function createProjectComments(numberOfComments: number, projectId: string, ownerId: string) {
  for (let i = 0; i < numberOfComments; i++) {
    await createProjectComment(projectId, ownerId)
  }
}

export async function createPmProjectAndComment() {
  const { pm, project } = await createPmAndProject()
  const comment = await createProjectComment(project.id, pm.id)
  return { pm, project, comment }
}