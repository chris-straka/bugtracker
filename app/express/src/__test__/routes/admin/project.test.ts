import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { createTestUser, createPmAndProject, createPmProjectAndComment } from '../../helper'

let admin: SuperAgentTest

beforeAll(async () => {
  ({ agent: admin } = await createTestUser('admin'))
})

describe('Projects', () => {
  describe('PUT admin/projects/:projectId', () => {
    it('should 200 when changing the name or description of a project', async () => {
      const { projectId } = await createPmAndProject()
      const newName = faker.company.name()
      const newDescription = faker.company.bs()

      const res = await admin
        .put(`admin/projects/${projectId}`)
        .send({ name: newName, description: newDescription })

      expect(res).toMatchObject({
        status: 200,
        body: {
          project: {
            name: newName,
            description: newDescription
          }
        }
      })
    })
  })

  describe('DELETE admin/projects/:projectId', () => {
    it('should 200 when deleting a project', async () => {
      const { projectId } = await createPmAndProject()
      await admin.delete(`/admin/projects/${projectId}`)
    })
  })
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

describe('Project User Assignments', () => {
  describe('POST admin/projects/:projectId/users', () => {
    it('should 201 when an admin adds a user to a project', async () => {
      const { projectId } = await createPmAndProject()
      const { id } = await createTestUser('developer')

      await admin
        .post(`admin/projects/${projectId}/users`)
        .send({ id })
        .expect(200)
    })
  })

  describe('DELETE /projects/:projectId/users', () => {
    it('should 204 when an admin removes a user from a project', async () => {
      const { projectId } = await createPmAndProject()
      const { id } = await createTestUser('developer')

      await admin
        .post(`admin/projects/${projectId}/users`)
        .send({ id })
        .expect(204)
    })
  })
})
