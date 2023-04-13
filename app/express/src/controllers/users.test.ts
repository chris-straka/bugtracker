import { faker } from '@faker-js/faker'
import request from 'supertest'
import { closeDBConnections } from '../utility/closeDbConnections'
import app from '../config/server'

async function createUserAndLogin() {
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  const agent = request.agent(app)

  const res = await agent
    .post('/users')
    .send({ username, email, password })
  
  const userId = res.body.user.id

  return { agent, userId, email, username }
}

describe('User Routes', () => {
  afterAll(async () => {
    await closeDBConnections()
  })

  describe('POST /users', () => {
    const username = faker.internet.userName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    test('When the user provides a valid username, email and password, they should receive a 201 response with their data', async () => {
      await request(app)
        .post('/users')
        .send({ username, email, password })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('user')
          expect(res.body.user).toHaveProperty('id')
          expect(res.body.user).toHaveProperty('email')
          expect(res.body.user).toHaveProperty('username')
          expect(res.body.user).toHaveProperty('role')
        })
    })

    test('When the user fails to provide their email, username or password it should fail with a 400 response', async () => {
      const username = faker.internet.userName()
      const email = faker.internet.email()
      const password = faker.internet.password()

      await request(app)
        .post('/users')
        .send({ username, email })
        .expect(400)

      await request(app)
        .post('/users')
        .send({ username, password })
        .expect(400)

      await request(app)
        .post('/users')
        .send({ email, password })
        .expect(400)
    })

    test('When the user tries to create an account with an email or username that is already in use, it should fail with a 409 response', async () => {
      const differentEmail = faker.internet.email()
      const differentPassword = faker.internet.email()

      await request(app)
        .post('/users')
        .send({ username: differentPassword, email, password })
        .expect(409)

      await request(app)
        .post('/users')
        .send({ username, email: differentEmail, password })
        .expect(409)
    })

    test('When the user provides an invalid email format, it should fail with a 400 response', async () => {
      await request(app)
        .post('/users')
        .send({ username, email: 'mynamejeff', password })
        .expect(400)
    })
  })

  describe('GET /users/:userId', () => {
    test('It should return the user\'s details with a 200 response', async () => {
      const { agent, userId } = await createUserAndLogin()

      await agent
        .get(`/users/${userId}`)
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

    test('It should return 401 when the userId does not exist', async () => {
      await request(app)
        .get('/users/00000000000000000000000000000000')
        .expect(401)
    })
  })

  describe('PUT /users/:userId/email', () => {
    test('The user should be able to change their own email and receive a 204', async () => {
      const { agent, userId } = await createUserAndLogin()
      const newEmail = faker.internet.email()
      await agent
        .put(`/users/${userId}/email`)
        .send({ email: newEmail })
    })

    test('The user should fail and receive 401 when trying to change someone else\'s email', async () => {
      const { userId } = await createUserAndLogin()
      const { agent: agent2 } = await createUserAndLogin()

      const newEmail = faker.internet.email()

      await agent2
        .put(`/users/${userId}/email`)
        .send({ email: newEmail })
        .expect(401)
    })

    test('The user should receive a 409 whenever they try to change their email to an already existing email', async () => {
      const { email } = await createUserAndLogin()
      const { agent, userId } = await createUserAndLogin()

      await agent
        .put(`/users/${userId}/email`) 
        .send({ email })
        .expect(409)
    })
  })

  describe('PUT /users/:userId/username', () => {
    test('The user should be able to change their own email and receive a 204', async () => {
      const { agent, userId } = await createUserAndLogin()
      const newUsername = faker.internet.userName()

      await agent
        .put(`/users/${userId}/username`)
        .send({ username: newUsername })
    })

    test('The user should fail when trying to change someone else\'s email and receive 401', async () => {
      const { userId } = await createUserAndLogin()
      const { agent: agent2 } = await createUserAndLogin()
      const newUsername = faker.internet.userName()

      await agent2
        .put(`/users/${userId}/username`)
        .send({ username: newUsername })
        .expect(401)
    })

    test('The user should receive a 409 whenever they try to change their username to an already existing username', async () => {
      const { username } = await createUserAndLogin()
      const { agent, userId } = await createUserAndLogin()

      await agent
        .put(`/users/${userId}/username`) 
        .send({ username })
        .expect(409)
    })
  })

  describe('DELETE /users/:userId', () => {
    test('The user should be able to delete themselves and receive a 204', async () => {
      const { agent, userId } = await createUserAndLogin()

      await agent
        .delete(`/users/${userId}`)
        .expect(204)
    })
  })
})
