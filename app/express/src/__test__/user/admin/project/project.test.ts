import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { createTestUser, createPmAndProject } from '../../../helper'

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

