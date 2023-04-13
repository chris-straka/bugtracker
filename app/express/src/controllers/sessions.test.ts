import request from 'supertest'
import { faker } from '@faker-js/faker'
import { closeDBConnections } from '../utility/closeDbConnections'
import UserService from '../services/user'
import app from '../config/server'

describe('Auth Routes', () => {
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  // Create a new user for testing purposes
  beforeAll(async () => {
    await UserService.createUser(username, email, password, 'developer')
  })

  afterAll(async () => {
    await UserService.deleteUserByEmail(email)
    await closeDBConnections()
  })

  describe('POST /sessions', () => {
    test('When the user logs in successfully, it should return 200 along with their info', async () => {
      await request(app)
        .post('/sessions')
        .send({ email, password })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('user')
          expect(res.body.user).toHaveProperty('id')
          expect(res.body.user).toHaveProperty('email')
          expect(res.body.user).toHaveProperty('username')
          expect(res.body.user).toHaveProperty('role')
        })
    })

    test('When the user fails to provide their email or password, it should return 400', async () => {
      await request(app)
        .post('/sessions')
        .send({ email: faker.internet.email() })
        .expect(400)

      await request(app)
        .post('/sessions')
        .send({ password: faker.internet.password() })
        .expect(400)
    })

    test('When the user tries to sign into someone that does not exist, it should return 401', async () => {
      await request(app)
        .post('/sessions')
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401)
    })

    test('When the user inserts the correct email but the wrong password, it should return 401', async () => {
      await request(app)
        .post('/sessions')
        .send({ email, password: faker.internet.password() })
        .expect(401)
    })
  })

  describe('DELETE /sessions', () => {
    test('When the user logs out successfully, it should return 204', async () => {
      const agent = request.agent(app)

      await agent
        .post('/sessions')
        .send({ email, password })

      await agent
        .delete('/sessions')
        .expect(204)
    })

    test('When an unauthenticated user tries to access a protected route, it should return 401', async () => {
      await request(app)
        .delete('/sessions')
        .expect(401)
    })
  })
})
