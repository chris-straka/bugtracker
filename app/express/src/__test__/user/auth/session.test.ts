import request from 'supertest'
import { faker } from '@faker-js/faker'
import { closeDbConnections } from '../../helper'
import UserService from '../../../services/user'
import app from '../../../config/server'

describe('Auth Routes', () => {
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  beforeAll(async () => {
    await UserService.createUser(username, email, password)
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('POST /sessions', () => {
    it('should 200 with data on login', async () => {
      const res = await request(app)
        .post('/sessions')
        .send({ email, password })
      
      expect(res).toMatchObject({ 
        status: 200, 
        body: {
          user: { 
            id: expect.any(Number), 
            email, 
            username, 
            role: expect('guest') 
          } 
        }
      })

    })

    it('should 400 when something is missing', async () => {
      await request(app)
        .post('/sessions')
        .send({ email })
        .expect(400)
    })

    it('should 401 on wrong password', async () => {
      await request(app)
        .post('/sessions')
        .send({ email, password: faker.internet.password() })
        .expect(401)
    })

    it('should 401 when user does not exist', async () => {
      await request(app)
        .post('/sessions')
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401)
    })
  })

  describe('DELETE /sessions', () => {
    it('should 204 on logout', async () => {
      const agent = request.agent(app)
      await agent
        .post('/sessions')
        .send({ email, password })

      await agent.delete('/sessions').expect(204)
    })

    it('should 401 when not logged in', async () => {
      await request(app).delete('/sessions').expect(401)
    })
  })
})
