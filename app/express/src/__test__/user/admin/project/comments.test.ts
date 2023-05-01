import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { createPmProjectAndComment, createTestUser } from '../../../helper'

let admin: SuperAgentTest

beforeAll(async () => {
  ({ agent: admin } = await createTestUser('admin'))
})

describe('Project Comments', () => {
  describe('PUT admin/projects/:projectId/comments/:commentId', () => {
    it('should 201 when changing a comment', async () => {
      const { projectId, comment } = await createPmProjectAndComment()

      await admin
        .put(`admin/projects/${projectId}/comments/${comment.id}`)
        .send({ message: faker.commerce.productDescription() })
        .expect(201)
    })
  })

  describe('DELETE admin/projects/:projectId/comments/:commentId', () => {
    it('should 204 when an admin tries to delete a comment', async () => {
      const { projectId, comment } = await createPmProjectAndComment()

      await admin
        .delete(`admin/projects/${projectId}/comments/${comment.id}`)
        .expect(204)
    })
  })
})