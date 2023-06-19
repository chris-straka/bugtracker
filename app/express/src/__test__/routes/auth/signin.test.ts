import request from 'supertest'
import { faker } from '@faker-js/faker'
import type { UserRole } from '../../../models/User'
import { closeDbConnections } from '../../helper/db'
import { userService } from '../../../services'
import app from '../../../config/server'

afterAll(async () => {
  await closeDbConnections()
})

describe('User sign in routes', () => {
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const role: UserRole = 'contributor'

  const url = '/sessions'

  beforeAll(async () => {
    await userService.createUser(username, email, password)
  })

  describe('POST /sessions', () => {
    it('should 200 with data on login', async () => {
      const res = await request(app)
        .post(url)
        .send({ email, password })
      
      expect(res).toMatchObject({ 
        status: 200, 
        body: {
          user: { 
            id: expect.any(Number), 
            email, 
            username, 
            role
          } 
        }
      })
    })

    it('should 400 when username is missing', async () => {
      await request(app)
        .post(url)
        .send({ email })
        .expect(400)
    })

    it('should 400 when email is missing', async () => {
      await request(app)
        .post(url)
        .send({ username })
        .expect(400)
    })

    it('should 401 on wrong password', async () => {
      await request(app)
        .post(url)
        .send({ email, password: faker.internet.password() })
        .expect(401)
    })

    it('should 401 when user does not exist', async () => {
      await request(app)
        .post(url)
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401)
    })
  })

  describe('DELETE /sessions', () => {
    it('should 204 on logout', async () => {
      const agent = request.agent(app)

      await agent
        .post(url)
        .send({ email, password })
      
      await agent
        .delete(url)
        .expect(204)
    })

    it('should 401 when not logged in', async () => {
      await request(app)
        .delete(url)
        .expect(401)
    })
  })
})
