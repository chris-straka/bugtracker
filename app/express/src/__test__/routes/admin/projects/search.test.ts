import { faker } from '@faker-js/faker'
import { 
  closeDbConnections, createPmAndProjects, 
  testPaginationRoutes, TestUser, createTestUser
} from '../../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Admin route for checking all projects on the site', () => {
  let admin: TestUser
  const description = faker.random.words(20)

  beforeAll(async () => {
    await createPmAndProjects(20, description)
    admin = await createTestUser('admin')
  })

  describe('GET /admin/projects', () => {
    testPaginationRoutes(admin.agent, '/admin/projects', 'projects')
  })

  describe('GET /admin/projects?search=', () => {
    testPaginationRoutes(admin.agent, '/admin/projects', 'projects', { search: description })
  })
})