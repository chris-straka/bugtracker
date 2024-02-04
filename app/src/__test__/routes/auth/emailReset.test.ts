import { faker } from '@faker-js/faker'
import request from 'supertest'
import type { TestUser } from '../../helper'
import { createTestUser } from '../../helper'
import { createResetToken } from '../../../utility'
import { closeDbConnections } from '../../helper/db'
import { emailResetRepository } from '../../../repositories'
import { emailService } from '../../../services'
import app from '../../../config/server'

afterAll(async () => {
  await closeDbConnections()
})

describe('Reset Email Routes', () => {
  let user: TestUser
  const newEmail = faker.internet.email()

  beforeAll(async () => {
    (user = await createTestUser())
  })

  describe('POST /me/email-reset-requests', () => {
    const url = '/me/email-reset-requests'

    describe('nodemailer', () => {
      const sendEmailSpy = jest.spyOn(emailService, 'sendEmail')

      afterEach(() => {
        jest.clearAllMocks()
      })

      it('should call sendEmail() service with correct arguments', async () => {
        await user.agent
          .post(url)
          .send({ newEmail })

        expect(sendEmailSpy).toHaveBeenCalledWith(
          newEmail,
          expect.stringMatching(/email reset/i),
          expect.stringMatching(/\/emails\/[0-9a-f]{40}/i)
        )
      })
    })

    it('should 200 when the user exists and requests a new email', async () => {
      await user.agent
        .post(url)
        .send({ newEmail }) 
        .expect(200)
    })

    it('should 400 if the email is invalid', async () => {
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

  describe('PUT /emails/:emailResetToken', () => {
    const newEmail = faker.internet.email()
    const token = createResetToken()
    const url = `/emails/${token}`

    beforeEach(async () => {
      await emailResetRepository.storeTokenWithEmails(token, user.email, newEmail)
    })

    it('should 200 when updating the email', async () => {
      await user.agent
        .put(url)
        .expect(200)
    })

    it('should 200 when logging in with the new email', async () => {
      await user.agent
        .put(url)

      await user.agent
        .delete('/sessions') 

      await user.agent
        .post('/sessions')
        .send({ email: newEmail, password: user.password })
        .expect(200)
    })

    it('should 400 when attempting to use the same token twice', async () => {
      await user.agent
        .put(url)

      await user.agent
        .put(url)
        .expect(400)
    })

    it('should 400 when a faulty token is provided', async () => {
      const wrongToken = createResetToken()
      const url = `/emails/${wrongToken}`

      await request(app)
        .put(url)
        .expect(400)
    })
  })
})