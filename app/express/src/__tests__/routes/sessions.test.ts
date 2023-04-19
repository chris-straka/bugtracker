import request from 'supertest'
import { faker } from '@faker-js/faker'
import { closeDbConnections } from '../helper'
import UserService from '../../services/user'
import app from '../../config/server'

describe('Auth Routes', () => {
  // Fake user
  let id: number
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const role = 'developer'

  beforeAll(async () => {
    ({ id } = await UserService.createUser(username, email, password, role))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('POST /sessions', () => {
    it('should 200 with user info when login is successful', async () => {
      const response = await request(app)
        .post('/sessions')
        .send({ email, password })
        .expect(200)
      
      expect(response.body).toMatchObject({ user: { id, email, username, role } })
    })

    it('should 400 when email or password is missing', async () => {
      await request(app)
        .post('/sessions')
        .send({ email: faker.internet.email() })
        .expect(400)

      await request(app)
        .post('/sessions')
        .send({ password: faker.internet.password() })
        .expect(400)
    })

    it('should 401 when email and password do not match any user', async () => {
      await request(app)
        .post('/sessions')
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401)
    })

    it('should 401 when the correct email but wrong password is provided', async () => {
      await request(app)
        .post('/sessions')
        .send({ email, password: faker.internet.password() })
        .expect(401)
    })
  })

  describe('DELETE /sessions', () => {
    it('should 204 when the user logs out successfully', async () => {
      // arrange 
      const agent = request.agent(app)
      await agent.post('/sessions').send({ email, password })

      // act and assert
      await agent.delete('/sessions').expect(204)
    })

    it('should 401 when an unauthenticated user tries to access a protected route', async () => {
      await request(app).delete('/sessions').expect(401)
    })
  })
})
