import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { createTestUser, closeDbConnections } from '../helper'

describe('Admin Routes', () => {
  let guestId: number
  let admin: SuperAgentTest

  beforeAll(async () => {
    ({ id: guestId } = await createTestUser('guest'));
    ({ agent: admin } = await createTestUser('admin'))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('PUT /admin/users/:userId', () => {
    it('should 200 when the admin changes user details', async () => {
      const username = faker.internet.userName()
      const email = faker.internet.email()
      const role = 'developer'

      const res = await admin
        .put(`/admin/users/${guestId}`)
        .send({ email, username, role })
        .expect(200)
      
      expect(res.body).toMatchObject({ username, email, role })
    })

    it('should 400 when nothing is specified', async () => {
      await admin.put(`/admin/users/${guestId}`).send({}).expect(400)
    })
  })
})