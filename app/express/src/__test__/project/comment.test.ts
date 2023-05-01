import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { 
  createTestUser, createProjectComment, createPmAndProjectWithUsersAndComments,
  addUserToProject, testPaginationRoutes 
} from '../helper'

describe('Project Comments', () => {
  let projectId: string
  let pm: SuperAgentTest
  let pmId: string

  beforeAll(async () => {
    ({ pm, pmId, projectId } = await createPmAndProjectWithUsersAndComments(10, 10))
  })

  describe('GET /projects/:projectId/comments', () => {
    beforeAll(async () => {
      const { id: endCursor } = await createProjectComment(projectId, pmId)
      testPaginationRoutes(pm, `/projects/${projectId}/comments`, 'projectComments', endCursor)
    })
  })

  describe('POST /projects/:projectId/comments', () => {
    it('should 201 when a project member creates a comment', async () => {
      await pm
        .post(`/projects/${projectId}/comments`)
        .send({ message: faker.random.words(50) })
        .expect(201)
    })

    it('should 401 when a non project member tries to create a comment', async () => {
      const { agent: dev } = await createTestUser('developer')

      await dev
        .post(`/projects/${projectId}/comments`)
        .send({ message: faker.random.words(50) })
        .expect(401)
    })

    it('should 404 if project is not found', async () => {
      await pm
        .post('/projects/00000/comments')
        .send({ message: faker.random.words(50) })
        .expect(404)
    })
  })

  describe('PUT /projects/:projectId/comments/:commentId', () => {
    let commentId: string

    beforeAll(async () => {
      ({ id: commentId }  = await createProjectComment(projectId, pmId))
    })

    it('should 201 after the owner changes their own comment', async () => {
      await pm
        .put(`/projects/${projectId}/comments/${commentId}`)
        .send({ description: faker.commerce.productDescription() })
        .expect(201)
    })

    it('should 401 when another project member tries to change the comment', async () => {
      const { agent } = await addUserToProject(projectId)

      await agent
        .put(`/projects/${projectId}/comments/${commentId}`)
        .send({ description: faker.commerce.productDescription() })
        .expect(401)
    })

    it('should 404 when the comment is missing', async () => {
      await pm
        .put(`/projects/${projectId}/comments/${commentId}`)
        .send({ description: faker.commerce.productDescription() })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/comments/:commentId', () => {
    let commentId: string

    beforeEach(async () => {
      ({ id: commentId }  = await createProjectComment(projectId, pmId))
    })

    it('should 204 when a project member deletes their own comment', async () => {
      await pm
        .delete(`/projects/${projectId}/comments/${commentId}`)
        .expect(204)
    })

    it('should 401 when a project member attempts to delete someone else\'s comment', async () => {
      const { agent: dev } = await createTestUser('developer')

      await dev
        .delete(`/projects/${projectId}/comments/${commentId}`)
        .expect(401)
    })

    it('should 404 when someone deletes their own comment', async () => {
      await pm
        .delete(`/projects/${projectId}/comments/${commentId}`)
        .expect(404)
    })
  })
})