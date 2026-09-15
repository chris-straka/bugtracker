import { faker } from '@faker-js/faker'
import type { TestUser } from '../../../helper'
import {
  createPmAndProjectWithTickets,
  createTestUser,
  testPaginationRoutes,
  closeDbConnections,
} from '../../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Admin route for searching all tickets', () => {
  let admin: TestUser
  const description = faker.lorem.words(5)

  beforeAll(async () => {
    await createPmAndProjectWithTickets(20, description)
    admin = await createTestUser('admin')
  })

  describe('GET /admin/tickets', () => {
    testPaginationRoutes(() => admin.agent, '/admin/tickets', 'tickets')
  })

  describe('GET /admin/tickets?search=', () => {
    testPaginationRoutes(() => admin.agent, '/admin/tickets', 'tickets', { search: description })
  })
})
