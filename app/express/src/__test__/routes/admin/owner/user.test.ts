import { UserAccountStatus, UserRole } from '../../../../models/User'
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

  describe('PUT /admin/users/:userId/role', () => {
    it('should 200 when downgrading an admin to a developer', async () => {
      const user = await createTestUser('admin')
      const url = `/admin/users/${user.id}/role`
      const newRole: UserRole = 'developer'

      await owner.agent
        .put(url)
        .send({ newRole })
        .expect(200)
    })

    it('should 200 when upgrading a developer to an admin', async () => {
      const user = await createTestUser('developer')
      const url = `/admin/users/${user.id}/role`
      const newRole: UserRole = 'admin'

      await owner.agent
        .put(url)
        .send({ newRole })
        .expect(200)
    })

    it('should 400 when request is empty', async () => {
      const user = await createTestUser('developer')
      const url = `/admin/users/${user.id}/role`

      await owner.agent
        .put(url)
        .send({})
        .expect(400)
    })

    it('should 403 when upgrading someone to an owner', async () => {
      const user = await createTestUser('owner')
      const url = `/admin/users/${user.id}/role`
      const newRole: UserRole = 'owner'

      await owner.agent
        .put(url)
        .send({ newRole })
        .expect(403)
    })
  })

  describe('PUT /admin/users/:userId/account-status', () => {
    it('should 200 when disabling an admin', async () => {
      const user = await createTestUser('admin')
      const url = `/admin/users/${user.id}/account-status`
      const newAccountStatus: UserAccountStatus = 'disabled'

      await owner.agent
        .put(url)
        .send({ newAccountStatus })
        .expect(200)
    })

    it('should 200 when disabling a non-admin', async () => {
      const user = await createTestUser('developer')
      const url = `/admin/users/${user.id}/account-status`
      const newAccountStatus: UserAccountStatus = 'disabled'

      await owner.agent
        .put(url)
        .send({ newAccountStatus })
        .expect(200)
    })

    it('should 400 when request is empty', async () => {
      const user = await createTestUser('developer')
      const url = `/admin/users/${user.id}/account-status`

      await owner.agent
        .put(url)
        .send({})
        .expect(400)
    })

    it('should 403 when a disabled admin tries to access an admin route', async () => {
      const admin = await createTestUser('admin')
      const url = `/admin/users/${admin.id}/account-status`
      const newAccountStatus: UserAccountStatus = 'disabled'

      await owner.agent
        .put(url)
        .send({ newAccountStatus })
      
      await admin.agent
        .put(`/admin/users/${admin.id}/account-status`)
        .send({ newAccountStatus: 'active' })
        .expect(403)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    it('should 204 when deleting an admin', async () => {
      const admin = await createTestUser('admin')
      const url = `/admin/users/${admin.id}`

      await owner.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when deleting a non-admin', async () => {
      const user = await createTestUser('developer')
      const url = `/admin/users/${user.id}`

      await owner.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when deleting an owner', async () => {
      const otherOwner = await createTestUser('owner')
      const url = `/admin/users/${otherOwner.id}`

      await owner.agent
        .delete(url)
        .expect(403)
    })
  })
})