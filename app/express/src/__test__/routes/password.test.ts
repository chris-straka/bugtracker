import request, { SuperAgentTest } from 'supertest'
import { faker } from '@faker-js/faker'
import { closeDbConnections, createTestUser } from '../helper'
import { sendEmail } from '../../config/nodemailer'
import PasswordService from '../../services/password'
import ResetPasswordRepository from '../../repositories/password'
import app from '../../config/server'

jest.mock('../../config/nodemailer', () => ({
  sendEmail: jest.fn(),
}))

describe('Reset Password Routes', () => {
  let email: string
  let id: string
  let agent: SuperAgentTest

  beforeAll(async () => {
    ({ agent, email, id } = await createTestUser())
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('POST /passwords', () => {
    it('should 200 and sendEmail() when the user forgets their password', async () => {
      await agent.post('/passwords').send({ email }).expect(200)
      expect(sendEmail).toHaveBeenCalled()
    })

    test('should 400 if the email is incorrect', async () => {
      await agent.post('/passwords').send({}).expect(400)
      await agent.post('/passwords').send({ email: '' }).expect(400)
      await agent.post('/passwords').send({ email: 'jeff' }).expect(400)
    })
  })

  describe('PUT /passwords/:passwordResetToken', () => {
    const token = PasswordService.createPasswordResetToken()

    beforeEach(async () => {
      await ResetPasswordRepository.addToken(token, id)
    })

    it('should 204 and change password when given a correct token', async () => {
      const newPassword = faker.internet.password()
      await agent.put(`/passwords/${token}`).send({ newPassword }).expect(204)
    })

    it('should 200 when logging in with the new password', async () => {
      // arrange (change password and logout)
      const newPassword = faker.internet.password()
      await agent.put(`/passwords/${token}`).send({ newPassword })
      await agent.delete('/sessions')

      // act & assert (login with new password)
      await agent.post('/sessions').send({ email, password: newPassword }).expect(200)
    })

    it('should 400 when attempting to use the same token twice', async () => {
      // arrange (change password and logout)
      const newPassword = faker.internet.password()
      const otherNewPassword = faker.internet.password()

      await agent.put(`/passwords/${token}`).send({ newPassword }).expect(204)
      await agent.put(`/passwords/${token}`).send({ newPassword: otherNewPassword }).expect(400)
    })

    it('should 400 when a faulty token is provided', async () => {
      const wrongToken = PasswordService.createPasswordResetToken()
      await request(app).put(`/passwords/${wrongToken}`).expect(400)
    })
  })
})