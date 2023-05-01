import request from 'supertest'
import { faker } from '@faker-js/faker'
import { Roles } from '../../../types'
import app from '../../../config/server'
import UserService from '../../../services/user'

export async function createTestUser(role: Roles = 'developer') {
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  await UserService.createUser(username, email, password, role)

  const agent = request.agent(app)
  const res = await agent.post('/sessions').send({ email, password })
  const id = res.body.user.id.toString()

  return { agent, id, username, email, password, role }
}

export async function createProjectManager() {
  return await createTestUser('project_manager')
}
