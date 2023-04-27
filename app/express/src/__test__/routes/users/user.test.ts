import { faker } from '@faker-js/faker'
import request from 'supertest'
import { closeDbConnections, createTestUser } from '../../helper'
import app from '../../../config/server'

describe('User Routes', () => {
  // new user
  const email = faker.internet.email()
  const username = faker.internet.userName()
  const password = faker.internet.password()
  const role = 'guest'

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('GET /users/:userId', () => {
    it('should 200 and return the user', async () => {
      const { id, email, username, role } = await createTestUser()

      const res = await request(app).get(`/users/${id}`)

      expect(res).toMatchObject({ 
        status: 200, 
        body: {
          user: { 
            id,
            email, 
            username, 
            role 
          } 
        }
      })

    })

    it('should 401 when user is missing', async () => {
      await request(app)
        .get('/users/0')
        .expect(401)
    })
  })

  describe('POST /users', () => {
    it('should 201 with data on signup', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email, username, password })

      expect(response).toMatchObject({ 
        status: 201, 
        body: {
          user: { 
            id: expect.any(Number), 
            email,
            username,
            role,
          } 
        } 
      })
    })

    it('should 400 when something is missing', async () => {
      await request(app)
        .post('/users')
        .send({ email, username })
        .expect(400)
    })

    it('should 400 when email is invalid', async () => {
      await request(app)
        .post('/users')
        .send({ email: 'jeff', username, password, })
        .expect(400)
    })

    it('should 409 when account already exists', async () => {
      const { email } = await createTestUser('guest')

      await request(app)
        .post('/users')
        .send({ email, username, password })
        .expect(409)
    })
  })

  describe('PUT /users/:userId/email', () => {
    it('should 204 when changing the email', async () => {
      const { agent, id } = await createTestUser()

      await agent
        .put(`/users/${id}/email`)
        .send({ email: faker.internet.email() })
        .expect(204)
    })

    it('should 401 when changing the wrong email', async () => {
      const { agent } = await createTestUser()
      const { id } = await createTestUser()

      await agent
        .put(`/users/${id}/email`)
        .send({ email: faker.internet.email() })
        .expect(401)
    })

    it('should 404 when user is not found', async () => {
      const { agent } = await createTestUser()

      await agent
        .put('/users/0000000/email') 
        .send({ email })
        .expect(409)
    })

    it('should 409 when email already exists', async () => {
      const { agent, id } = await createTestUser()
      const { email } = await createTestUser()

      await agent
        .put(`/users/${id}/email`) 
        .send({ email })
        .expect(409)
    })
  })

  describe('PUT /users/:userId/username', () => {
    it('should 204 when changing the username', async () => {
      const { agent, id } = await createTestUser()

      await agent
        .put(`/users/${id}/username`)
        .send({ username: faker.internet.userName() })
        .expect(204)
    })

    it('should 401 when changing the wrong user', async () => {
      const { agent } = await createTestUser()
      const { id } = await createTestUser()

      await agent
        .put(`/users/${id}/username`)
        .send({ username: faker.internet.userName() })
        .expect(401)
    })

    it('should 409 when username already exists', async () => {
      const { agent, id } = await createTestUser()
      const { username } = await createTestUser()

      await agent
        .put(`/users/${id}/username`) 
        .send({ username })
        .expect(409)
    })
  })

  describe('DELETE /users/:userId', () => {
    it('should 204 when user deletes themselves', async () => {
      const { agent, id } = await createTestUser()
      await agent.delete(`/users/${id}`).expect(204)
    })

    it('should 401 when deleting someone else', async () => {
      const { agent } = await createTestUser()
      const { id } = await createTestUser()
      await agent.delete(`/users/${id}`).expect(401)
    })
  })
})
