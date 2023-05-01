import { SuperAgentTest } from 'supertest'
import { createTestUser, closeDbConnections } from '../../helper'

let admin: SuperAgentTest

describe('Admin Routes', () => {
  beforeAll(async () => {
    ({ agent: admin } = await createTestUser('admin'))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('PUT /admin/users/:userId', () => {
    it('should 200 when changing a non-admin', async () => {
      const { id } = await createTestUser()

      await admin
        .put(`/admin/users/${id}`)
        .send({ role: 'developer' })
        .expect(200)
    })

    it('should 401 when changing an admin', async () => {
      const { id } = await createTestUser('admin')

      await admin
        .put(`/admin/users/${id}`)
        .send({ role: 'developer' })
        .expect(401)
    })

    it('should 401 when upgrading to admin', async () => {
      const { id } = await createTestUser()

      await admin
        .put(`/admin/users/${id}`)
        .send({ role: 'admin' })
        .expect(401)
    })

    it('should 401 when upgrading to owner', async () => {
      const { id } = await createTestUser()

      await admin
        .put(`/admin/users/${id}`)
        .send({ role: 'owner' })
        .expect(401)
    })

    it('should 401 when changing an owner', async () => {
      const { id } = await createTestUser('owner')

      await admin
        .put(`/admin/users/${id}`)
        .send({ role: 'developer' })
        .expect(401)
    })

    it('should 400 when request is empty', async () => {
      const { id } = await createTestUser()

      await admin
        .put(`/admin/users/${id}`)
        .send({})
        .expect(400)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    it('should 204 when deleting a non-admin', async () => {
      const { id } = await createTestUser()

      await admin
        .delete(`/admin/users/${id}`)
        .expect(204)
    })
    it('should 401 when deleting an admin', async () => {
      const { id } = await createTestUser('admin')

      await admin
        .delete(`/admin/users/${id}`)
        .expect(401)
    })
    it('should 401 when deleting an owner', async () => {
      const { id } = await createTestUser('owner')

      await admin
        .delete(`/admin/users/${id}`)
        .expect(401)
    })
  })
})
