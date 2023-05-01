import { SuperAgentTest } from 'supertest'
import { 
  createPmProjectWithTicketAndTicketAssignments, 
  testPaginationRoutes, createTicketAssignment 
} from '../../helper'

/** 
 * The purpose of ticket assignments is for users to log in 
 * and look at the tickets they've been assigned on the dashboard
 */
describe('Project Ticket Assignments', () => {
  let pm: SuperAgentTest
  let projectId: string
  let ticketId: string

  beforeAll(async () => {
    ({ pm, projectId, ticketId } = await createPmProjectWithTicketAndTicketAssignments(10))
  })

  describe('GET /projects/:projectId/tickets/:ticketId/assignments', () => {
    beforeAll(async () => {
      const { ticketAssignmentId } = await createTicketAssignment(projectId, ticketId)
      await testPaginationRoutes(
        pm, 
        `/projects/${projectId}/tickets/${ticketId}/assigments`, 
        'ProjectTicketAssignments', 
        ticketAssignmentId
      )
    })
  })

  describe('POST /projects/:projectId/tickets/:ticketId/assignments', () => {
    it('should 200 when a project dev creates a ticket assignment')
    it('should 200 when a project manager creates a ticket assignment')
    it('should 401 when a project contributor makes a ticket assignment')
    it('should 401 when a non project member makes a ticket assignment')
    it('should 404 when the ticket is not found')
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId/assignments/:assignmentId', () => {
    it('should 204 when a project dev removes a ticket assignment')
    it('should 204 when a project manager removes a ticket assignment')
    it('should 401 when a contributor removes a project assignment')
    it('should 401 when a non project member tries to remove a project assignment')
    it('should 404 when the project is not found')
    it('should 404 when the ticket is not found')
  })
})