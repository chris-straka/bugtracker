import request from 'supertest'
import { faker } from '@faker-js/faker'
import { TestUser, closeDbConnections, createTestUser } from '../../helper'
import PasswordService from '../../../services/auth/password'
import ResetPasswordRepository from '../../../repositories/password'
import app from '../../../config/server'

afterAll(async () => {
  await closeDbConnections()
})

describe('Reset Password Routes', () => {
  let user: TestUser

  beforeAll(async () => {
    (user = await createTestUser())
  })

  describe('POST /passwords', () => {
    it('should 200 when user forgets their password and wants to change it', async () => {
      await user.agent
        .post('/passwords')
        .send({ email: user.email })
        .expect(200)
    })

    test('should 400 if email is incorrect', async () => {
      await user.agent
        .post('/passwords')
        .send({ email: 'jeff' })
        .expect(400)
    })

    test('should 400 if the email is missing', async () => {
      await user.agent
        .post('/passwords')
        .send({})
        .expect(400)
    })
  })

  describe('PUT /passwords/:passwordResetToken', () => {
    const token = PasswordService.createPasswordResetToken()

    beforeEach(async () => {
      await ResetPasswordRepository.storeUserIdForPasswordReset(token, user.id)
    })

    it('should 200 and update the password when given a correct token and a newPassword', async () => {
      await user.agent
        .put(`/passwords/${token}`)
        .send({ newPassword: faker.internet.password() })
        .expect(200)
    })

    it('should 200 when logging in with the new password', async () => {
      const newPassword = faker.internet.password()
      await user.agent.put(`/passwords/${token}`).send({ newPassword: faker.internet.password() })
      await user.agent.delete('/sessions') // logout

      await user.agent
        .post('/sessions')
        .send({ email: user.email, password: newPassword })
        .expect(200)
    })

    it('should 400 when attempting to use the same token twice', async () => {
      const newPassword = faker.internet.password()
      const otherNewPassword = faker.internet.password()

      await user.agent
        .put(`/passwords/${token}`)
        .send({ newPassword })

      await user.agent
        .put(`/passwords/${token}`)
        .send({ newPassword: otherNewPassword })
        .expect(400)
    })

    it('should 400 when a faulty token is provided', async () => {
      const wrongToken = PasswordService.createPasswordResetToken()

      await request(app)
        .put(`/passwords/${wrongToken}`)
        .expect(400)
    })
  })
})