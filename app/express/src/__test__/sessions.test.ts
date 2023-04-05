import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '../config/server'

describe('Auth Routes', () => {
  let userId: number
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  // Create a new user for testing purposes
  beforeAll(async () => {
    const res = await request(app)
      .post('/users')
      .send({ username, email, password })
    userId = res.body.user.id
  })

  // Delete that user
  afterAll(async () => {
    await request(app).delete(`/users/${userId}`)
  })

  describe('GET /sessions', () => {
    test('If the user is logged in, they should receive a 204', async () => {
      await request(app)
        .get('/sessions')
        .expect(204)
    })
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

    test('When the user tries to sign in with credentials that don\'t exist, it should return 401', async () => {
      await request(app)
        .post('/sessions')
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401)
    })

    test('When the user inserts the wrong password, it should return 401', async () => {
      await request(app)
        .post('/sessions')
        .send({ email, password: faker.internet.password() })
        .expect(401)
    })
  })

  describe('DELETE /sessions', () => {
    test('When the user logs out successfully, it should return 204', async () => {
      await request(app)
        .delete('/sessions')
        .expect(204)
    })

    test('After the user has been signed out, it should return 401 on any route that requires authentication', async () => {
      await request(app)
        .delete('/sessions')
        .expect(401)
    })
  })
})
