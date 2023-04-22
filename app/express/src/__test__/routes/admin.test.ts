import { SuperAgentTest } from 'supertest'
import { createTestUser, closeDbConnections } from '../helper'

describe('Admin Routes', () => {

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('When a regular admin calls an admin route', () => {
    let admin: SuperAgentTest

    beforeAll(async () => {
      ({ agent: admin } = await createTestUser('admin'))
    })

    describe('PUT /admin/users/:userId', () => {
      it('should 200 when changing the role of a non-admin', async () => {
        const { id: guestId } = await createTestUser('guest')

        const res = await admin
          .put(`/admin/users/${guestId}`)
          .send({ role: 'developer' })

        expect(res.statusCode).toBe(200)
        expect(res.body.role).toBe('developer')
      })

      it('should 401 when trying to changes another admin\'s role', async () => {
        const { id: otherAdminId } = await createTestUser('admin')

        await admin
          .put(`/admin/users/${otherAdminId}`)
          .send({})
          .expect(401)
      })

      it('should 401 when trying to change an owner\'s role', async () => {
        const { id: ownerId } = await createTestUser('owner')

        await admin
          .put(`/admin/users/${ownerId}`)
          .send({})
          .expect(401)
      })

      it('should 400 when the request is invalid', async () => {
        const { id: guestId } = await createTestUser('guest')

        const res = await admin
          .put(`/admin/users/${guestId}`)
          .send({})
      
        expect(res.statusCode).toBe(400)
      })
    })

    describe('DELETE /admin/users/:userId', () => {
      it('should 204 when an admin deletes a non-admin', async () => {
        const { id: pmUserId } = await createTestUser('project_manager')

        await admin
          .delete(`/admin/users/${pmUserId}`)
          .expect(204)
      })
      it('should 401 when an admin tries to delete another admin', async () => {
        const { id: adminId } = await createTestUser('admin')

        await admin
          .delete(`/admin/users/${adminId}`)
          .expect(401)
      })
      it('should 401 when an admin tries to delete an owner', async () => {
        const { id: ownerId } = await createTestUser('owner')

        await admin
          .delete(`/admin/users/${ownerId}`)
          .expect(401)
      })
    })
  })

  describe('When a super admin (an owner) calls an admin route', () => {
    let owner: SuperAgentTest

    beforeAll(async () => {
      ({ agent: owner } = await createTestUser('owner'))
    })

    describe('PUT /admin/users/:userId', () => {
      it('should 200 when an owner changes the role of an admin', async () => {
        const { id: adminId } = await createTestUser('admin')

        const res = await owner
          .put(`/admin/users/${adminId}`)
          .send({ role: 'developer' })

        expect(res.statusCode).toBe(200)
        expect(res.body.role).toBe('developer')
      })
    })

    describe('DELETE /admin/users/:userId', () => {
      it('should 204 when an owner deletes an admin', async () => {
        const { id: adminId } = await createTestUser('admin')

        await owner
          .delete(`/admin/users/${adminId}`)
          .expect(204)
      })
    })
  })
})