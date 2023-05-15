import { 
  createTestUser, closeDbConnections, TestUser 
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Admin User Management Routes', () => {
  let admin: TestUser

  beforeAll(async () => {
    (admin = await createTestUser('admin'))
  })

  describe('PUT /admin/users/:userId', () => {
    it('should 200 when upgrading the privileges of a user', async () => {
      const contributor = await createTestUser('contributor')

      await admin.agent
        .put(`/admin/users/${contributor.id}`)
        .send({ role: 'developer' })
        .expect(200)
    })

    it('should 401 when changing another admin', async () => {
      const otherAdmin = await createTestUser('admin')

      await admin.agent
        .put(`/admin/users/${otherAdmin.id}`)
        .send({ role: 'developer' })
        .expect(401)
    })

    it('should 401 when upgrading to admin', async () => {
      const dev = await createTestUser('developer')

      await admin.agent
        .put(`/admin/users/${dev.id}`)
        .send({ role: 'admin' })
        .expect(401)
    })

    it('should 401 when upgrading to owner', async () => {
      const dev = await createTestUser('developer')

      await admin.agent
        .put(`/admin/users/${dev.id}`)
        .send({ role: 'owner' })
        .expect(401)
    })

    it('should 401 when downgrading an owner', async () => {
      const owner = await createTestUser('owner')

      await admin.agent
        .put(`/admin/users/${owner.id}`)
        .send({ role: 'developer' })
        .expect(401)
    })

    it('should 400 when request is empty', async () => {
      const dev = await createTestUser('developer')

      await admin.agent
        .put(`/admin/users/${dev.id}`)
        .send({})
        .expect(400)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    it('should 204 when deleting a non-admin', async () => {
      const dev = await createTestUser('developer')

      await admin.agent
        .delete(`/admin/users/${dev.id}`)
        .expect(204)
    })

    it('should 401 when deleting an admin', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(`/admin/users/${admin.id}`)
        .expect(401)
    })

    it('should 401 when deleting an owner', async () => {
      const owner = await createTestUser('owner')

      await admin.agent
        .delete(`/admin/users/${owner.id}`)
        .expect(401)
    })
  })
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