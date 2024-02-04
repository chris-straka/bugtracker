import { faker } from '@faker-js/faker'
import type { TestUser } from '../../helper'
import type { Project } from '../../../models/Project'
import type { Ticket, TicketStatus } from '../../../models/Ticket'
import { 
  createNewUserAndAddThemToProject, 
  createPmAndProject, createTicket, 
  createTestUser, closeDbConnections,
  // testPaginationRoutes 
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Ticket CRUD Routes', () => {
  let pm: TestUser
  let project: Project
  let admin: TestUser
  let otherPm: TestUser
  let projectDev: TestUser
  let projectContributor: TestUser
  let url: string

  beforeAll(async () => {
    ({ pm, project } = await createPmAndProject())
    admin = await createTestUser('admin')
    otherPm = await createTestUser('project_manager')
    projectDev = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')
    projectContributor = await createNewUserAndAddThemToProject(project.id.toString(), 'contributor')
    url = `/projects/${project.id}/tickets`
  })

  // describe('GET /projects/:projectId/tickets', () => {
  //   testPaginationRoutes(pm.agent, `/projects/${project.id}/tickets`, 'projectTickets')

  //   it('should 403 when a non project user tries to get tickets', async () => {
  //     const dev = await createTestUser('developer')

  //     await dev.agent
  //       .get(`/projects/${project.id}/tickets`)
  //       .expect(403)
  //   })
  // })

  describe('POST /projects/:projectId/tickets', () => {
    it('should 201 when a user assigned to the project creates a ticket', async () => {
      const name = faker.company.name()
      const description = faker.company.bs()

      await projectContributor.agent
        .post(url)
        .send({ name, description })
        .expect(201)
    })

    it('should 400 when the ticket name is missing', async () => {
      const description = faker.company.bs()

      await pm.agent
        .post(url)
        .send({ description })
        .expect(400)
    })

    it('should 400 when the ticket description is missing', async () => {
      const name = faker.company.name()

      await pm.agent
        .post(url)
        .send({ name })
        .expect(400)
    })

    it('should 403 when an unassigned pm tries to create a ticket', async () => {
      const name = faker.company.name()
      const description = faker.company.bs()

      await otherPm.agent
        .post(url)
        .send({ name, description })
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const url = '/projects/000/tickets'
      const name = faker.company.name()
      const description = faker.company.bs()

      await pm.agent
        .post(url)
        .send({ name, description })
        .expect(404)
    })

    it('should 409 when the ticket already exists', async () => {
      const name = faker.company.name()
      const description = faker.company.bs()

      await pm.agent
        .post(url)
        .send({ name, description })
      
      await pm.agent
        .post(url)
        .send({ name, description })
        .expect(409)
    })
  })

  describe('PUT /projects/:projectId/tickets/:ticketId', () => {
    let ticket: Ticket

    beforeAll(async () => {
      ticket = await createTicket(project.id.toString(), projectContributor.id.toString())
      url = url + `/${ticket.id}`
    })

    it('should 200 when the ticket owner tries change the ticket status', async () => {
      const status: TicketStatus = 'closed'

      await projectContributor.agent
        .put(url)
        .send({ status })
        .expect(200)
    })

    it('should 200 when a project dev tries to change the ticket status', async () => {
      const status: TicketStatus = 'in_progress'

      await projectDev.agent
        .put(url)
        .send({ status })
        .expect(200)
    })

    it('should 200 when an assigned pm tries to change the ticket status of a ticket', async () => {
      const status: TicketStatus = 'open'

      await pm.agent
        .put(url)
        .send({ status })
        .expect(200)
    })

    it('should 200 when an admin tries to change a ticket', async () => {
      const name = faker.commerce.productName()

      await admin.agent
        .put(url)
        .send({ name })
        .expect(200)
    })

    it('should 403 when a project contributor tries to change the ticket status of someone else\'s ticket', async () => {
      const otherProjectContributor = await createNewUserAndAddThemToProject(project.id.toString(), 'contributor')
      const status: TicketStatus = 'additional_info_required'

      await otherProjectContributor.agent
        .put(url)
        .send({ status })
        .expect(403)
    })

    it('should 403 when an unassigned pm tries to change the ticket status', async () => {
      const status: TicketStatus = 'in_progress'

      await otherPm.agent
        .put(url)
        .send({ status })
        .expect(403)
    })
    
    it('should 404 when the project is not found', async () => {
      const url = `/projects/0000/tickets/${ticket.id}`
      const status: TicketStatus = 'additional_info_required'

      await pm.agent
        .put(url)
        .send({ status })
        .expect(404)
    })

    it('should 404 when the ticket is not found', async () => {
      const url = `/projects/${project.id}/tickets/000`
      const status: TicketStatus = 'additional_info_required'

      await pm.agent
        .put(url)
        .send({ status })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId', () => {
    let ticket: Ticket
    let url: string

    beforeEach(async () => {
      ticket = await createTicket(project.id.toString(), pm.id.toString())
      url = `/projects/${project.id}/tickets/${ticket.id}`
    })

    it('should 204 when a ticket owner deletes their own ticket', async () => {
      await pm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when a pm deletes a ticket', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id.toString(), 'project_manager')

      await otherPm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when an admin tries to delete a ticket', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when a pm who is not on the project tries to delete a ticket', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(url)
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const url = `/projects/0000/tickets/${ticket.id}`
      const status: TicketStatus = 'additional_info_required'

      await pm.agent
        .put(url)
        .send({ status })
        .expect(404)
    })

    it('should 404 when the ticket is not found', async () => {
      const url = `/projects/${project.id}/tickets/000`
      const status: TicketStatus = 'additional_info_required'

      await pm.agent
        .put(url)
        .send({ status })
        .expect(404)
    })
  })
})