import { faker } from '@faker-js/faker'
import request, { SuperAgentTest } from 'supertest'
import { closeDbConnections, createTestUser } from '../helper'
import app from '../../config/server'

describe('User Routes', () => {
  afterAll(async () => {
    await closeDbConnections()
  })

  describe('POST /users', () => {
    // arrange
    const email = faker.internet.email()
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const role = 'guest'

    it('should 201 with user data when valid email, username, and password are provided', async () => {
      // act
      const response = await request(app)
        .post('/users')
        .send({ email, username, password })
        .expect(201)

      // assert
      expect(response.body).toMatchObject({ user: { id: expect.any(Number), email, username, role } })
    })

    it('should 400 when email, username or password is missing', async () => {
      await request(app).post('/users').send({ email, username }).expect(400)
      await request(app).post('/users').send({ username, password }).expect(400)
      await request(app).post('/users').send({ email, password }).expect(400)
    })

    it('should 400 when an invalid email format is provided', async () => {
      await request(app).post('/users').send({ username, email: 'jeff', password }).expect(400)
    })

    it('should 409 when trying to create an account with an already used email/username', async () => {
      const differentEmail = faker.internet.email()
      const differentPassword = faker.internet.password()

      await request(app)
        .post('/users')
        .send({ username: differentPassword, email, password })
        .expect(409)

      await request(app)
        .post('/users')
        .send({ username, email: differentEmail, password })
        .expect(409)
    })
  })

  describe('GET /users/:userId', () => {
    it('should 200 with user details', async () => {
      const { agent, id, email, username, role } = await createTestUser()

      const res = await agent.get(`/users/${id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ user: { id, email, username, role } })
    })

    it('should 401 when the userId does not exist', async () => {
      await request(app).get('/users/0').expect(401)
    })
  })

  describe('PUT /users/:userId', () => {
    // user 1
    let agent: SuperAgentTest
    let id: string
    let username: string

    // user 2
    let agent2: SuperAgentTest
    let email: string

    beforeAll(async () => {
      ({ agent, id, username } = await createTestUser());
      ({ agent: agent2, email } = await createTestUser())
    })

    describe('/email', () => {
      it('should 204 when the user changes their own email', async () => {
        await agent
          .put(`/users/${id}/email`)
          .send({ email: faker.internet.email() })
          .expect(204)
      })

      it('should 401 when changing an email you don\'t own', async () => {
        await agent2
          .put(`/users/${id}/email`)
          .send({ email: faker.internet.email() })
          .expect(401)
      })

      it('should 409 when changing to an already existing email', async () => {
        await agent
          .put(`/users/${id}/email`) 
          .send({ email })
          .expect(409)
      })
    })

    describe('/username', () => {
      it('should 204 when the user changes their own username', async () => {
        await agent
          .put(`/users/${id}/username`)
          .send({ username: faker.internet.userName() })
          .expect(204)
      })

      it('should 401 when changing a username you don\'t own', async () => {
        await agent2
          .put(`/users/${id}/username`)
          .send({ username: faker.internet.userName() })
          .expect(401)
      })

      it('should 409 when changing to an already existing username', async () => {
        await agent
          .put(`/users/${id}/username`) 
          .send({ username })
          .expect(409)
      })
    })
  })

  describe('DELETE /users/:userId', () => {
    it('should 204 when the user deletes themselves', async () => {
      const { agent, id } = await createTestUser()

      await agent.delete(`/users/${id}`).expect(204)
    })
  })
})
