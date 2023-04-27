import { SuperAgentTest } from 'supertest'
import { createTestUser, closeDbConnections } from '../../helper'

// owner is a "super admin"
let owner: SuperAgentTest

describe('Super Admin', () => {
  beforeAll(async () => {
    ({ agent: owner } = await createTestUser('owner'))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('PUT /admin/users/:userId', () => {
    it('should 200 when changing an admin', async () => {
      const { id } = await createTestUser('admin')

      await owner
        .put(`/admin/users/${id}`)
        .send({ role: 'developer' })
        .expect(200)
    })

    it('should 200 when upgrading to admin', async () => {
      const { id } = await createTestUser()

      await owner
        .put(`/admin/users/${id}`)
        .send({ role: 'admin' })
        .expect(200)
    })

    it('should 400 when request is empty', async () => {
      const { id } = await createTestUser()

      await owner
        .put(`/admin/users/${id}`)
        .send({})
        .expect(400)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    it('should 204 when deleting an admin', async () => {
      const { id } = await createTestUser('admin')

      await owner
        .delete(`/admin/users/${id}`)
        .expect(204)
    })
  })
})