import { SuperAgentTest } from 'supertest'
import { createTicket, createPmAndProject, testPaginationRoutes, createTestUser } from '../../../helper'

describe('Ticket Routes', () => {
  let admin: SuperAgentTest
  let pmId: string
  let projectId: string

  beforeAll(async () => {
    ({ pmId, projectId } = await createPmAndProject());
    ({ agent: admin } = await createTestUser('admin'))
  })

  describe('GET /tickets', () => {
    beforeAll(async () => {
      const ticket = await createTicket(projectId, pmId)
      testPaginationRoutes(admin, '/tickets', 'tickets', ticket.id)
    })
  })

  describe('GET /tickets/:ticketId', () => {
    it('should 200 when fetching the details for a ticket')
    it('should 404 when the ticket is not found')
  })
})
