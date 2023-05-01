import { SuperAgentTest } from 'supertest'
import { createTestUser, createPmAndProject } from '../../../helper'

let admin: SuperAgentTest

beforeAll(async () => {
  ({ agent: admin } = await createTestUser('admin'))
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
