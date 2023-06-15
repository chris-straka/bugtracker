import { faker } from '@faker-js/faker'
import { projectCommentRepository } from '../../../repositories'

export async function createProjectComment(projectId: string, ownerId: string) {
  const projectComment =  await projectCommentRepository.createProjectComment(projectId, ownerId, faker.lorem.paragraph())
  return { ...projectComment, id: projectComment.id.toString() }
}

export async function createProjectComments(projectId: string, ownerId: string, numberOfComments: number) {
  const projectComments = []

  for (let i = 0; i < numberOfComments; i++) {
    const projectComment = await createProjectComment(projectId, ownerId)
    projectComments.push(projectComment)
  }

  return projectComments
}
