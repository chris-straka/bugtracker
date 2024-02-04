import type { UserAccountStatus, UserRole } from '../../../models/User'
import type { TestUser } from '../../helper'
import { createTestUser, closeDbConnections } from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Admin User Management Routes', () => {
  let admin: TestUser

  beforeAll(async () => {
    admin = await createTestUser('admin')
  })

  describe('PUT /admin/users/:userId/role', () => {
    let user: TestUser
    let url: string

    beforeAll(async () => {
      user = await createTestUser('contributor')
      url = `/admin/users/${user.id}/role`
    })

    it('should 200 when an admin changes a contributor to a developer', async () => {
      const newRole: UserRole = 'developer' 

      await admin.agent
        .put(url)
        .send({ newRole })
        .expect(200)
    })

    it('should 400 when request is empty', async () => {
      await admin.agent
        .put(url)
        .send({})
        .expect(400)
    })

    it('should 403 when upgrading someone to an admin', async () => {
      const newRole: UserRole = 'admin' 

      await admin.agent
        .put(url)
        .send({ newRole })
        .expect(403)
    })

    it('should 403 when upgrading someone to an owner', async () => {
      const newRole: UserRole = 'owner' 

      await admin.agent
        .put(url)
        .send({ newRole })
        .expect(403)
    })

    it('should 403 when an admin tries to change the role of another admin', async () => {
      const otherAdmin = await createTestUser('admin')
      const url = `/admin/users/${otherAdmin.id}/role`
      const newRole: UserRole = 'developer' 

      await admin.agent
        .put(url)
        .send({ newRole })
        .expect(403)
    })

    it('should 403 when an admin tries to change the role of an owner', async () => {
      const owner = await createTestUser('owner')
      const url = `/admin/users/${owner.id}/role`
      const newRole: UserRole = 'developer' 

      await admin.agent
        .put(url)
        .send({ newRole })
        .expect(403)
    })
  })

  describe('PUT /admin/users/:userId/account-status', () => {
    let user: TestUser
    let url: string

    beforeAll(async () => {
      user = await createTestUser('contributor')
      url = `/admin/users/${user.id}/account-status`
    })

    it('should 200 when an admin tries to change a user\'s account status', async () => {
      const newAccountStatus: UserAccountStatus = 'disabled' 

      await admin.agent
        .put(url)
        .send({ newAccountStatus })
        .expect(200)
    })

    it('should 204 when a disabled user tries to sign out', async () => {
      const newAccountStatus: UserAccountStatus = 'disabled' 

      await admin.agent
        .put(url)
        .send({ newAccountStatus })

      await user.agent
        .delete('/sessions')
        .expect(204)
    })

    it('should 400 when the request is empty', async () => {
      await admin.agent
        .put(url)
        .send({})
        .expect(400)
    })

    it('should 403 when a disabled user tries to sign in', async () => {
      const newAccountStatus: UserAccountStatus = 'disabled' 

      await admin.agent
        .put(url)
        .send({ newAccountStatus })

      await user.agent
        .delete('/sessions')
      
      await user.agent
        .post('/sessions')
        .send({ email: user.email, password: user.password })
        .expect(403)
    })

    it('should 403 when changing the account status of another admin', async () => {
      const otherAdmin = await createTestUser('admin')
      const url = `/admin/users/${otherAdmin.id}/account-status`
      const newAccountStatus: UserAccountStatus = 'disabled'

      await admin.agent
        .put(url)
        .send({ newAccountStatus })
        .expect(403)
    })

    it('should 403 when changing the account status of an owner', async () => {
      const owner = await createTestUser('owner')
      const url = `/admin/users/${owner.id}/account-status`
      const newAccountStatus: UserAccountStatus = 'disabled'

      await admin.agent
        .put(url)
        .send({ newAccountStatus })
        .expect(403)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    it('should 204 when deleting a non-admin', async () => {
      const dev = await createTestUser('developer')

      await admin.agent
        .delete(`/admin/users/${dev.id}`)
        .expect(204)
    })

    it('should 403 when deleting an admin', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(`/admin/users/${admin.id}`)
        .expect(403)
    })

    it('should 403 when deleting an owner', async () => {
      const owner = await createTestUser('owner')

      await admin.agent
        .delete(`/admin/users/${owner.id}`)
        .expect(403)
    })
  })
})