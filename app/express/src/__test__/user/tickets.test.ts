import { SuperAgentTest } from 'supertest'
import { createPmProjectAndTickets, testPaginationRoutes } from '../helper'

let agent: SuperAgentTest
let lastTicketId: string
const numberOfTickets = 20

beforeAll(async () => {
  const { pm, tickets } = await createPmProjectAndTickets(numberOfTickets)
  agent = pm.agent
  lastTicketId = tickets[tickets.length - 1].id
})

describe('User route for requesting tickets they created', () => {
  describe('GET /users/me/tickets', () => {
    testPaginationRoutes(agent, '/users/me/tickets', 'tickets', lastTicketId)
  })
})