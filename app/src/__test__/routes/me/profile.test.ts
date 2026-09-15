import { faker } from '@faker-js/faker'
import type { TestUser } from '../../helper'
import { createTestUser, closeDbConnections } from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User routes for managing your own account', () => {
  let user: TestUser

  beforeAll(async () => {
    user = await createTestUser()
  })

  // Email changes go through the reset-request flow, not a direct update.
  describe('POST /me/email-reset-requests', () => {
    it('should 200 when a user requests an email change', async () => {
      await user.agent.post('/me/email-reset-requests').send({ newEmail: faker.internet.email() }).expect(200)
    })

    it('should 400 when the email is invalid', async () => {
      await user.agent.post('/me/email-reset-requests').send({ newEmail: 'jeff' }).expect(400)
    })

    it('should 400 when the email is missing', async () => {
      await user.agent.post('/me/email-reset-requests').send({}).expect(400)
    })
  })

  describe('PUT /me/username', () => {
    it('should 200 when a user changes their username', async () => {
      const newUsername = faker.internet.username()

      const res = await user.agent.put('/me/username').send({ newUsername }).expect(200)

      expect(res.body).toMatchObject({ username: newUsername })
    })

    it('should 400 when username is invalid', async () => {
      await user.agent.put('/me/username').send({ newUsername: '' }).expect(400)
    })

    it('should 400 when the username is missing', async () => {
      await user.agent.put('/me/username').send({}).expect(400)
    })

    it('should 409 when the new username already exists', async () => {
      const { username: alreadyTakenUsername } = await createTestUser()

      await user.agent.put('/me/username').send({ newUsername: alreadyTakenUsername }).expect(409)
    })
  })

  describe('DELETE /me', () => {
    it('should 204 when a user deletes themselves', async () => {
      await user.agent.delete('/me').expect(204)
    })

    it('should 401 when the user tries to login after deletion', async () => {
      const { agent, email, password } = await createTestUser()
      await agent.delete('/me')

      await agent.post('/sessions').send({ email, password }).expect(401)
    })
  })
})
