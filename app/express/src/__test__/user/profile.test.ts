import { faker } from '@faker-js/faker'
import { createTestUser } from '../helper'

describe('PUT /users/me/email', () => {
  it('should 204 when a user changes their email', async () => {
    const { agent } = await createTestUser()

    await agent
      .put('/users/me/email')
      .send({ email: faker.internet.email() })
      .expect(204)
  })

  it('should 400 when the email is invalid', async () => {
    const { agent } = await createTestUser()

    await agent
      .put('/users/me/email')
      .send({ email: 'jeff' })
      .expect(400)
  })

  it('should 400 when the email is missing', async () => {
    const { agent } = await createTestUser()

    await agent
      .put('/users/me/email')
      .send({})
      .expect(400)
  })

  it('should 409 when the new email already exists', async () => {
    const { agent } = await createTestUser()
    const { email: alreadyTakenEmail } = await createTestUser()

    await agent
      .put('/users/me/email') 
      .send({ alreadyTakenEmail })
      .expect(409)
  })
})

describe('PUT /users/me/username', () => {
  it('should 204 when a user changes their username', async () => {
    const { agent } = await createTestUser()

    await agent
      .put('/users/me/username')
      .send({ username: faker.internet.userName() })
      .expect(204)
  })

  it('should 400 when username is invalid', async () => {
    const { agent } = await createTestUser()

    await agent
      .put('/users/me/username')
      .send({ username: '' })
      .expect(400)
  })

  it('should 400 when the username is missing', async () => {
    const { agent } = await createTestUser()

    await agent
      .put('/users/me/username')
      .send({})
      .expect(400)
  })

  it('should 409 when the new username already exists', async () => {
    const { agent } = await createTestUser()
    const { username: alreadyTakenUsername } = await createTestUser()

    await agent
      .put('/users/me/username') 
      .send({ alreadyTakenUsername })
      .expect(409)
  })
})

describe('DELETE /users/me', () => {
  it('should 204 when a user deletes themselves', async () => {
    const { agent } = await createTestUser()

    await agent.delete('/users/me').expect(204)
  })

  it('should 401 when the user tries to login after deletion', async () => {
    const { agent, email, password } = await createTestUser()

    await agent.delete('/users/me')
    await agent.post('/sessions').send({ email, password }).expect(401)
  })
})