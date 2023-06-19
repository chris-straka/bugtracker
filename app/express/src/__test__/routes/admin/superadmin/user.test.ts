import type { TestUser } from '../../../helper'
import { createTestUser, closeDbConnections } from '../../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Super Admin User Management Routes', () => {
  let owner: TestUser

  beforeAll(async () => {
    owner = await createTestUser('owner')
  })

  describe('PUT /admin/users/:userId', () => {
    it('should 200 when changing an admin', async () => {
      const admin = await createTestUser('admin')

      await owner.agent
        .put(`/admin/users/${admin.id}`)
        .send({ role: 'developer' })
        .expect(200)
    })

    it('should 200 when upgrading to admin', async () => {
      const dev = await createTestUser('developer')

      await owner.agent
        .put(`/admin/users/${dev.id}`)
        .send({ role: 'admin' })
        .expect(200)
    })

    it('should 400 when request is empty', async () => {
      const dev = await createTestUser('developer')

      await owner.agent
        .put(`/admin/users/${dev.id}`)
        .send({})
        .expect(400)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    it('should 204 when deleting an admin', async () => {
      const admin = await createTestUser('admin')

      await owner.agent
        .delete(`/admin/users/${admin.id}`)
        .expect(204)
    })
  })
})