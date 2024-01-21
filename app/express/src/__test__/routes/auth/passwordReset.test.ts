import { faker } from '@faker-js/faker'
import request from 'supertest'
import { createTestUser, TestUser, closeDbConnections } from '../../helper'
import { createResetToken } from '../../../utility'
import { passwordResetRepository } from '../../../repositories'
import { emailService } from '../../../services'
import app from '../../../config/server'

afterAll(async () => {
  await closeDbConnections()
})

describe('Reset Password Routes', () => {
  let user: TestUser

  beforeAll(async () => {
    (user = await createTestUser())
  })

  describe('POST /password-reset-requests', () => {
    const url = '/password-reset-requests'

    describe('nodemailer', () => {
      const sendEmailSpy = jest.spyOn(emailService, 'sendEmail')

      afterEach(() => {
        jest.clearAllMocks()
      })

      it('should call the sendEmail() service with correct arguments', async () => {
        await user.agent
          .post(url)
          .send({ email: user.email }) // requires the user's current email

        expect(sendEmailSpy).toHaveBeenCalledWith(
          user.email,
          expect.stringMatching(/password reset/i),
          expect.stringMatching(/\/passwords\/[0-9a-f]{40}/i)
        )
      })

      it('should not call the sendEmail() service if the user is not found', async () => {
        await user.agent
          .post(url)
          .send({ email: faker.internet.email() })

        expect(sendEmailSpy).not.toBeCalled()
      })
    })

    it('should 200 when the user requests a new password', async () => {
      await user.agent
        .post(url)
        .send({ email: user.email }) // requires the user's current email
        .expect(200)
    })

    it('should 200 when the user requests a new password for an account that does not exist', async () => {
      await user.agent
        .post(url)
        .send({ email: faker.internet.email() })
        .expect(200)
    })

    it('should 400 if they provide an incorrect email', async () => {
      await user.agent
        .post(url)
        .send({ email: 'jeff' })
        .expect(400)
    })

    it('should 400 if the email is missing', async () => {
      await user.agent
        .post(url)
        .send({})
        .expect(400)
    })
  })

  describe('PUT /passwords/:passwordResetToken', () => {
    const token = createResetToken()
    const url = `/passwords/${token}`
    const newPassword = faker.internet.password()

    beforeEach(async () => {
      await passwordResetRepository.storePasswordResetTokenUnderUserId(token, user.id.toString())
    })

    it('should 200 and update the password when given a correct token and a new password', async () => {
      await user.agent
        .put(url)
        .send({ newPassword })
        .expect(200)
    })

    it('should 200 when logging in with the new password', async () => {
      await user.agent
        .put(url)
        .send({ newPassword })

      await user.agent
        .delete('/sessions') 

      await user.agent
        .post('/sessions')
        .send({ email: user.email, password: newPassword })
        .expect(200)
    })

    it('should 400 when attempting to use the same token twice', async () => {
      const otherNewPassword = faker.internet.password()

      await user.agent
        .put(url)
        .send({ newPassword })

      await user.agent
        .put(url)
        .send({ password: otherNewPassword })
        .expect(400)
    })

    it('should 400 when a faulty token is provided', async () => {
      const wrongToken = createResetToken()
      const url = `/passwords/${wrongToken}`

      await request(app)
        .put(url)
        .expect(400)
    })
  })
})