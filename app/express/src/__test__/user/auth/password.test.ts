import request, { SuperAgentTest } from 'supertest'
import { faker } from '@faker-js/faker'
import { closeDbConnections, createTestUser } from '../../helper'
import PasswordService from '../../../services/password'
import ResetPasswordRepository from '../../../repositories/password'
import app from '../../../config/server'

describe('Reset Password Routes', () => {
  let agent: SuperAgentTest
  let email: string
  let id: string

  beforeAll(async () => {
    ({ agent, email, id } = await createTestUser())
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('POST /passwords', () => {
    it('should 200 when user forgets their password and wants to change it', async () => {
      await agent.post('/passwords')
        .send({ email })
        .expect(200)
    })

    test('should 400 if email is incorrect', async () => {
      await agent
        .post('/passwords')
        .send({ email: 'jeff' })
        .expect(400)
    })
  })

  describe('PUT /passwords/:passwordResetToken', () => {
    const token = PasswordService.createPasswordResetToken()

    beforeEach(async () => {
      await ResetPasswordRepository.storeUserIdForPasswordReset(token, id)
    })

    it('should 204 and update the password when given a correct token and a newPassword', async () => {
      const newPassword = faker.internet.password()

      await agent
        .put(`/passwords/${token}`)
        .send({ newPassword })
        .expect(204)
    })

    it('should 200 when logging in with the new password', async () => {
      const newPassword = faker.internet.password()
      await agent.put(`/passwords/${token}`).send({ newPassword })
      await agent.delete('/sessions') // logout

      await agent
        .post('/sessions')
        .send({ email, password: newPassword })
        .expect(200)
    })

    it('should 400 when attempting to use the same token twice', async () => {
      const newPassword = faker.internet.password()
      const otherNewPassword = faker.internet.password()
      await agent
        .put(`/passwords/${token}`)
        .send({ newPassword })

      await agent
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