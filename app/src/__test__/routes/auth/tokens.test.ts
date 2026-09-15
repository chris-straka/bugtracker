import request from 'supertest'
import { faker } from '@faker-js/faker'
import { closeDbConnections } from '../../helper/db'
import { userService, adminUserService } from '../../../services'
import app from '../../../config/server'

afterAll(async () => {
  await closeDbConnections()
})

describe('JWT token routes', () => {
  const username = faker.internet.username()
  const email = faker.internet.email()
  const password = faker.internet.password()
  let userId: string

  beforeAll(async () => {
    const user = await userService.createUser(username, email, password)
    userId = user.id.toString()
  })

  function login() {
    return request(app).post('/tokens').send({ email, password })
  }

  describe('POST /tokens', () => {
    it('issues a JWT pair on valid login', async () => {
      const res = await login()

      expect(res.status).toBe(200)
      expect(res.body.user).toMatchObject({ email, username })
      expect(typeof res.body.accessToken).toBe('string')
      expect(typeof res.body.refreshToken).toBe('string')
      expect(res.body.expiresIn).toBe(15 * 60)
    })

    it('does not set a cookie session for token logins', async () => {
      const res = await login()
      expect(res.headers['set-cookie']).toBeUndefined()
    })

    it('401s on the wrong password', async () => {
      await request(app).post('/tokens').send({ email, password: faker.internet.password() }).expect(401)
    })

    it('401s for an unknown user', async () => {
      await request(app)
        .post('/tokens')
        .send({ email: faker.internet.email(), password: faker.internet.password() })
        .expect(401)
    })

    it('400s when the email or password is missing', async () => {
      await request(app).post('/tokens').send({ email }).expect(400)
      await request(app).post('/tokens').send({ password }).expect(400)
    })

    it('403s for a disabled user', async () => {
      await adminUserService.changeAccountStatus(userId, 'disabled', 'admin')
      await login().expect(403)
      await adminUserService.changeAccountStatus(userId, 'active', 'admin')
    })
  })

  describe('Bearer access', () => {
    it('reaches protected routes without a cookie', async () => {
      const { body } = await login()
      await request(app).get('/me/activity').set('Authorization', `Bearer ${body.accessToken}`).expect(200)
    })

    it('401s without any credential', async () => {
      await request(app).get('/me/activity').expect(401)
    })

    it('401s on a forged token', async () => {
      await request(app).get('/me/activity').set('Authorization', 'Bearer forged.invalid.sig').expect(401)
    })

    it('still accepts the classic cookie session', async () => {
      const agent = request.agent(app)
      await agent.post('/sessions').send({ email, password }).expect(200)
      await agent.get('/me/activity').expect(200)
    })
  })

  describe('POST /tokens/refresh', () => {
    it('rotates: returns a fresh pair and kills the old refresh token', async () => {
      const first = (await login()).body

      const res = await request(app).post('/tokens/refresh').send({ refreshToken: first.refreshToken })
      expect(res.status).toBe(200)
      expect(typeof res.body.accessToken).toBe('string')
      expect(res.body.refreshToken).not.toBe(first.refreshToken)

      // The rotated-out token is single-use: replaying it fails ...
      await request(app).post('/tokens/refresh').send({ refreshToken: first.refreshToken }).expect(401)

      // ... and the replay revokes the whole family, so even the newest token is dead.
      await request(app).post('/tokens/refresh').send({ refreshToken: res.body.refreshToken }).expect(401)
    })

    it('401s on a forged refresh token', async () => {
      await request(app).post('/tokens/refresh').send({ refreshToken: 'forged.invalid.sig' }).expect(401)
    })

    it('400s when the refresh token is missing', async () => {
      await request(app).post('/tokens/refresh').send({}).expect(400)
    })
  })

  describe('DELETE /tokens', () => {
    it('revokes a single refresh token', async () => {
      const { body } = await login()

      await request(app).delete('/tokens').send({ refreshToken: body.refreshToken }).expect(204)
      await request(app).post('/tokens/refresh').send({ refreshToken: body.refreshToken }).expect(401)
    })

    it('204s for an unknown token (idempotent logout)', async () => {
      await request(app).delete('/tokens').send({ refreshToken: 'forged.invalid.sig' }).expect(204)
    })

    it('revokes every live token with { all: true }', async () => {
      const first = (await login()).body
      const second = (await login()).body

      await request(app)
        .delete('/tokens')
        .set('Authorization', `Bearer ${first.refreshToken}`)
        .send({ all: true })
        .expect(204)

      await request(app).post('/tokens/refresh').send({ refreshToken: first.refreshToken }).expect(401)
      await request(app).post('/tokens/refresh').send({ refreshToken: second.refreshToken }).expect(401)
    })
  })
})
