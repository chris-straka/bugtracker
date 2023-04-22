import request from 'supertest'
import { faker } from '@faker-js/faker'
import { Roles } from '../../types'
import app from '../../config/server'
import UserService from '../../services/user'

export async function createTestUser(role: Roles = 'contributor') {
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  await UserService.createUser(username, email, password, role)

  const agent = request.agent(app)

  const res = await agent
    .post('/sessions')
    .send({ email, password })
  
  const id = res.body.user.id

  return { agent, id, username, email, password, role }
}

export async function deleteAllUsers() {
  if (process.env.NODE_ENV === 'production') throw new Error('Attempted to deleteAllUsers() in production! Stopped')

}