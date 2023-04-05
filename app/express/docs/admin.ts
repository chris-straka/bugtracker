import { faker } from '@faker-js/faker'
import type { User } from '../src/models/User'
import request from 'supertest'
import app from '../src/config/server'
import UserService from '../src/services/user'

describe('Admin routes', () => {
  const adminUsername =  faker.internet.userName()
  const adminEmail =  faker.internet.email()
  const adminPassword = faker.internet.password()
  let admin: User

  let userId: number
  const username = faker.internet.userName() 
  const email = faker.internet.email()
  const password = faker.internet.password()

  // Create an admin for testing purposes
  beforeAll(async () => {
    admin = await UserService.createNewUser(adminUsername, adminEmail, adminPassword, 'admin')

    // sign in
    await request(app)
      .post('/sessions')
      .send({ adminEmail, adminPassword })
  })

  afterAll(async () => {
    await UserService.deleteUserById(admin.id)
  })

  describe('POST /admin/users', () => {
    test('The admin should be able to create new users successfully with a 201 response', async () => {
      const res = await request(app)
        .post('/admin/users')
        .send({ username, email, password })
        .expect(201)
      
      userId = res.body.user.id
    }) 
  })
    
  describe('PUT /admin/users/:userId', () => {
    test('The admin can update the user\'s role and get back 200', async () => {
      // The user's current role should be contributor
      await request(app)
        .get(`/users/${userId}`)
        .expect(res => {
          expect(res.body.user.role).toBe('contributor')
        })

      // Change the user's role to developer
      await request(app)
        .post(`/admin/users/${userId}`)
        .send({ role: 'developer' })

      // The user's new role should be developer
      await request(app)
        .get(`/users/${userId}`)
        .expect(res => {
          expect(res.body.user.role).toBe('developer')
        })
    }) 

    test('The admin should not be able to update anything else (email, password, etc.) and they should get a 400 error when they try', async () => {
      await request(app)
        .post(`/admin/users/${userId}`)
        .send({ email: faker.internet.email() })
        .expect(400)
    })
  })

  describe('DELETE /admin/users/:userId', () => {
    test('The admin can delete users and get back a 204 response', async () => {
      await request(app)
        .delete(`/admin/users/${userId}`)
        .expect(204)
    })
  })
})