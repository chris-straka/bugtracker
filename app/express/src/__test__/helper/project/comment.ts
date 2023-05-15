import { faker } from '@faker-js/faker'
import { ProjectCommentRepository } from '../../../repositories/projects'

export async function createProjectComment(ownerId: string, projectId: string) {
  const projectComment =  await ProjectCommentRepository.createProjectComment(faker.lorem.paragraph(), ownerId, projectId)

  return { ...projectComment, id: projectComment.id.toString() }
}

export async function createProjectComments(ownerId: string, projectId: string, numberOfComments: number) {
  const projectComments = []

  for (let i = 0; i < numberOfComments; i++) {
    const projectComment = await createProjectComment(projectId, ownerId)
    projectComments.push(projectComment)
  }

  return projectComments
}
