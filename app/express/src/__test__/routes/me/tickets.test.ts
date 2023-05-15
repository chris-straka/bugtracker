import { faker } from '@faker-js/faker'
import { 
  TestTicket, addUserToTickets, createPmAndProjectWithTickets, 
  createTestUser, testPaginationRoutes, TestUser, closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User route for checking all the tickets they created', () => {
  let pm: TestUser

  beforeAll(async () => {
    ({ pm } = await createPmAndProjectWithTickets(20))
  })

  describe('GET /me/my-tickets', () => {
    testPaginationRoutes(pm.agent, '/me/my-tickets', 'tickets')
  })
})

describe('User route for checking all the tickets they\'re assigned to', () => {
  let dev: TestUser
  let tickets: TestTicket[]
  const description = faker.random.words(20)

  beforeAll(async () => {
    ({ tickets } = await createPmAndProjectWithTickets(20))
    dev = await createTestUser('developer')
    await addUserToTickets(dev.id, tickets)
  })

  describe('GET /me/assigned-tickets', () => {
    testPaginationRoutes(dev.agent, '/me/assigned-tickets', 'tickets')
  })

  describe('GET /me/assigned-tickets?search=', () => {
    testPaginationRoutes(dev.agent, '/me/assigned-tickets', 'tickets', { search: description })
  })
})