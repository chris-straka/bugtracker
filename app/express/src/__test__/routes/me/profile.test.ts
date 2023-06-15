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

  describe('PUT /me/email', () => {
    it('should 200 when a user changes their email', async () => {
      await user.agent
        .put('/me/email')
        .send({ email: faker.internet.email() })
        .expect(200)
    })

    it('should 400 when the email is invalid', async () => {
      await user.agent
        .put('/me/email')
        .send({ email: 'jeff' })
        .expect(400)
    })

    it('should 400 when the email is missing', async () => {
      await user.agent
        .put('/me/email')
        .send({})
        .expect(400)
    })

    it('should 409 when the new email already exists', async () => {
      const { email: alreadyTakenEmail } = await createTestUser()

      await user.agent
        .put('/me/email') 
        .send({ alreadyTakenEmail })
        .expect(409)
    })
  })

  describe('PUT /me/username', () => {
    it('should 204 when a user changes their username', async () => {
      await user.agent
        .put('/me/username')
        .send({ username: faker.internet.userName() })
        .expect(204)
    })

    it('should 400 when username is invalid', async () => {
      await user.agent
        .put('/me/username')
        .send({ username: '' })
        .expect(400)
    })

    it('should 400 when the username is missing', async () => {
      await user.agent
        .put('/me/username')
        .send({})
        .expect(400)
    })

    it('should 409 when the new username already exists', async () => {
      const { username: alreadyTakenUsername } = await createTestUser()

      await user.agent
        .put('/me/username') 
        .send({ alreadyTakenUsername })
        .expect(409)
    })
  })

  describe('DELETE /me', () => {
    it('should 204 when a user deletes themselves', async () => {
      await user.agent
        .delete('/me')
        .expect(204)
    })

    it('should 401 when the user tries to login after deletion', async () => {
      const { agent, email, password } = await createTestUser()
      await agent.delete('/me')

      await agent.post('/sessions')
        .send({ email, password })
        .expect(401)
    })
  })
})