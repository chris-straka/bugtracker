import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Roles } from '../../../types'
import { createTestUser, closeDbConnections } from '../../helper'
import app from '../../../config/server'

describe('POST /users', () => {
  const email    = faker.internet.email()
  const username = faker.internet.userName()
  const password = faker.internet.password()
  const role     = 'guest' as Roles

  afterAll(async () => {
    await closeDbConnections()
  })

  it('should 201 with data on signup', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email, username, password })

    expect(response).toMatchObject({ 
      status: 201, 
      body: {
        user: { id: expect.any(Number), email, username, role, } 
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