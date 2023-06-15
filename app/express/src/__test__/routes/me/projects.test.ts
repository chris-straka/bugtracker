import { faker } from '@faker-js/faker'
import type { TestUser, TestProject } from '../../helper'
import { 
  createPmAndProjects, testPaginationRoutes, 
  createTestUser, addUserToProjects, 
  closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User route for checking all the projects they created', () => {
  let pm: TestUser

  beforeAll(async () => {
    ({ pm } = await createPmAndProjects(20))
  })

  describe('GET /me/my-projects', () => {
    testPaginationRoutes(pm.agent, '/me/my-projects', 'projects')

    it('should 403 when a dev tries to see projects they created', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .get('me/my-projects')
        .expect(403)
    })
  })
})

describe('User route for checking the projects they\'re assigned to', () => {
  let dev: TestUser
  let projects: TestProject[]
  const description = faker.random.words(20)

  beforeAll(async () => {
    ({ projects } = await createPmAndProjects(20, description))
    dev = await createTestUser('developer')
    await addUserToProjects(dev.id, projects)
  })

  describe('GET /me/assigned-projects', () => {
    testPaginationRoutes(dev.agent, '/me/assigned-projects', 'projects')
  })

  describe('GET /me/assigned-projects?search=', () => {
    testPaginationRoutes(dev.agent, '/me/assigned-projects', 'projects', { search: description })
  })
})