import { SuperAgentTest } from 'supertest'
import { 
  testPaginationRoutes, createPmProjectWithTicketAndTicketComments, 
  createTicketComment 
} from '../../helper'

describe('Project Ticket Comment Routes', () => {
  let pm: SuperAgentTest
  let pmId: string
  let projectId: string
  let ticketId: string

  beforeAll(async () => {
    ({ pm, pmId, projectId, ticketId } = await createPmProjectWithTicketAndTicketComments(10))
  })

  describe('GET /projects/:projectId/tickets/:ticketId/comments', () => { 
    beforeAll(async () => {
      const { id: endCursor } = await createTicketComment(ticketId, pmId)
      await testPaginationRoutes(pm, `/projects/${projectId}/tickets/${ticketId}`, 'ProjectTicketComments', endCursor)
    })
  })

  describe('POST /projects/:projectId/tickets/:ticketId/comments', () => {
    it('should 200 when a project dev creates a ticket comment')
    it('should 401 when a non project dev tries to create a ticket comment')
    it('should 404 when the project is not found')
    it('should 404 when the ticket is not found')
  })

  describe('PUT /projects/:projectId/tickets/:ticketId/comments/:commentId', () => {
    it('should 200 when the owner changes their comment on a ticket')
    it('should 401 when another project member tries to change the owner\'s ticket comment')
    it('should 404 when the project is not found')
    it('should 404 when the ticket is not found')
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId/comments', () => {
    it('should 204 when the owner deletes their own comment')
    it('should 401 when the another project member tries to delete the owner\'s comment')
    it('should 404 when the project is not found')
    it('should 404 when the ticket is not found')
  })
})