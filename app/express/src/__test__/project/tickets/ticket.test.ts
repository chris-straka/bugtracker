import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { 
  closeDbConnections, createTicket, createPmProjectWithUsersAndTickets,
  testPaginationRoutes, createTestUser, addUserToProject 
} from '../../helper'

describe('Project Ticket CRUD Routes', () => {
  let pm: SuperAgentTest
  let pmId: string
  let projectId: string

  beforeAll(async () => {
    ({ pm, pmId, projectId } = await createPmProjectWithUsersAndTickets(10, 10))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('GET /projects/:projectId/tickets', () => {
    beforeAll(async () => {
      const { id: endCursor } = await createTicket(projectId, pmId)
      await testPaginationRoutes(pm, `/projects/${projectId}/tickets`, 'projectTickets', endCursor)
    })
  })

  describe('POST /projects/:projectId/tickets', () => {
    it('should 201 when a user assigned to the project creates a new ticket', async () => {
      await pm
        .post(`/projects/${projectId}/tickets`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(201)
    })

    it('should 401 when a user not assigned to the project tries to create a ticket', async () => {
      const { agent: dev } = await createTestUser()

      await dev
        .post(`/projects/${projectId}/tickets`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(401)
    })

    it('should 409 when the ticket already exists', async () => {
      const name = faker.company.name()
      const description = faker.company.bs()

      await pm
        .post(`/projects/${projectId}/tickets`)
        .send({ name, description })
      
      await pm
        .post(`/projects/${projectId}/tickets`)
        .send({ name, description })
        .expect(409)
    })

    it('should 400 when there is no ticket name specified', async () => {
      await pm
        .post(`/projects/${projectId}/tickets`)
        .send({ description: faker.company.bs() })
        .expect(400)
    })
  })

  describe('PUT /projects/:projectId/tickets/:ticketId', () => {
    let ticketId: string

    beforeAll(async () => {
      ({ ticketId } = await createTicket(projectId, pmId))
    })

    it('should 200 when a project member changes ticket status', async () => {
      await pm
        .put(`/projects/${projectId}/tickets/${ticketId}`)
        .send({ status: 'urgent' })
        .expect(200)
    })

    it('should 200 when a project contributor changes the status of their own ticket', async () => {
      const { agent: contributor, id } =  await addUserToProject(projectId, 'contributor')
      const { ticketId } = await createTicket(projectId, id)

      await contributor
        .put(`/projects/${projectId}/tickets/${ticketId}`)
        .send({ status: 'urgent' })
        .expect(200)
    })

    it('should 401 when a project contributor changes the status of someone else\'s ticket', async () => {
      const { agent: contributor } =  await addUserToProject(projectId, 'contributor')

      await contributor
        .put(`/projects/${projectId}/tickets/${ticketId}`)
        .send({ status: 'urgent' })
        .expect(401)
    })

    it('should 401 when a non project member tries to change ticket status', async () => {
      const { agent: dev } = await createTestUser('developer')

      await dev
        .put(`/projects/${projectId}/tickets/${ticketId}`)
        .send({ status: 'urgent' })
        .expect(401)
    })

    it('should 404 when the tickets is not found', async () => {
      await pm
        .put(`/projects/${projectId}/tickets/0000`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId', () => {
    it('should 204 when the ticket owner deletes their own ticket', async () => {
      const { id: devId, agent: dev } = await addUserToProject(projectId, 'developer')
      const { id: ticketId } = await createTicket(projectId, devId)

      await dev
        .delete(`/projects/${projectId}/tickets/${ticketId}`)
        .expect(204)
    })

    it('should 204 when a pm deletes a ticket', async () => {
      const { id: devId } = await addUserToProject(projectId, 'developer')
      const { id: ticketId } = await createTicket(projectId, devId)

      await pm
        .delete(`/projects/${projectId}/tickets/${ticketId}`)
        .expect(204)
    })

    it('should 401 when a non-pm project member tries to delete a ticket they don\'t own', async () => {
      const { agent: dev } = await addUserToProject(projectId, 'developer')
      const { id: ticketId } = await createTicket(projectId, pmId)

      await dev
        .delete(`/projects/${projectId}/tickets/${ticketId}`)
        .expect(204)
    })
  })
})