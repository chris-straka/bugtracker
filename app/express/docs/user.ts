import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../src/config/server'
import UserRepository from '../src/repositories/User'

describe('User routes', () => {
  let userId: string
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  beforeEach(async () => {
    const user = await UserRepository.createUser(username, email, password, 'contributor')
    userId = user.id
  })

  afterEach(async () => {
    if (userId) await UserRepository.deleteUserById(userId)
  })

  describe('POST /users', () => {
    describe('When a user creates tries to create an account', () => {
      test('It should fail with 404 when the user is missing information', async () => {
        await request(app)
          .post('/users')
          .send({ email: faker.internet.email() })
          .expect(400)
      })

      test('Otherwise it should create a new user with response code 201 and their basic information', async () => {
        const user = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email()
        }

        const res = await request(app).post('/users')
          .send(user)
          .expect(201)
          .expect(res => {
            expect(res.body).toHaveProperty('user')
            expect(res.body.user).toHaveProperty('id')
            expect(res.body.user).toHaveProperty('email')
            expect(res.body.user).toHaveProperty('username')
            expect(res.body.user).toHaveProperty('role')
          })
        
        await request(app)
          .get('/sessions')
          .expect(204)

        await UserRepository.deleteUserById(res.body.user.id)
      })
    })
  })

  describe('GET /users/:userId', () => {
    describe('When someone tries to get another user\'s details', () => {
      test('They should succeed and get 200 if they\'re authenticated', async () => {
        await request(app)
          .get(`/users/${userId}`)
          .expect(200)
          .expect(res => {
            const user = res.body.user
            expect(user).toHaveProperty('username')
            expect(user).toHaveProperty('role')
            expect(user).toHaveProperty('email')
          })
      })

      test('They should fail and get 401 if they\'re not signed in', async () => {
        await request(app)
          .delete('/sessions')
          .expect(204)

        await request(app)
          .get(`/users/${userId}`)
          .expect(401)
      })
    })
  })

  describe('PUT /users/:userId', () => {
    test('When a user updates their email, it should work with a 200 response.', async () => {
      const newEmail = faker.internet.email()

      await request(app)
        .put(`/users/${userId}/email`)
        .send({ email: newEmail })
        .expect(200)

      await request(app)
        .get(`/users/${userId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.user.email).toBe(newEmail)
        })
    }) 

    test('When a user tries to update their email to an email that already exists it should throw a 409', async () => {
      await request(app)
        .put(`/users/${userId}/email`)
        .send({ email })
        .expect(409)
    })

    test('When a user tries to update their username, it should work with a 200 response.', async () => {
      const newUsername = faker.internet.userName()

      await request(app)
        .put(`/users/${userId}/username`)
        .send({ username: newUsername })
        .expect(200)

      await request(app)
        .get(`/users/${userId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.user.username).toBe(newUsername)
        })
    }) 
  })

  describe('DELETE /users/:userId', () => {
    test('The user should be deleted succesfully with a 204 response', async () => {
      await request(app)
        .delete(`/users/${userId}`)
        .expect(204)
    }) 
  })
})
