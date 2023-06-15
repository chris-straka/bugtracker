import { faker } from '@faker-js/faker'
import type { TestUser, TestProject, TestTicket, } from '../../helper'
import { 
  createPmAndProjectWithUsersAndTickets,
  createNewUserAndAddThemToProject, 
  createTicket, createTestUser, 
  testPaginationRoutes, closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Ticket CRUD Routes', () => {
  let pm: TestUser
  let project: TestProject

  beforeAll(async () => {
    ({ pm, project } = await createPmAndProjectWithUsersAndTickets(10, 10))
  })

  describe('GET /projects/:projectId/tickets', () => {
    testPaginationRoutes(pm.agent, `/projects/${project.id}/tickets`, 'projectTickets')

    it('should 403 when a non project user tries to get tickets', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .get(`/projects/${project.id}/tickets`)
        .expect(403)
    })
  })

  describe('POST /projects/:projectId/tickets', () => {
    it('should 201 when a user assigned to the project creates a ticket', async () => {
      await pm.agent
        .post(`/projects/${project.id}/tickets`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(201)
    })

    it('should 400 when the ticket name is missing', async () => {
      await pm.agent
        .post(`/projects/${project.id}/tickets`)
        .send({ description: faker.company.bs() })
        .expect(400)
    })

    it('should 403 when a pm who doesn\'t belong to the project tries to create a ticket', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .post(`/projects/${project.id}/tickets`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(403)
    })

    it('should 409 when the ticket already exists', async () => {
      const name = faker.company.name()
      const description = faker.company.bs()

      await pm.agent
        .post(`/projects/${project.id}/tickets`)
        .send({ name, description })
      
      await pm.agent
        .post(`/projects/${project.id}/tickets`)
        .send({ name, description })
        .expect(409)
    })
  })

  describe('PUT /projects/:projectId/tickets/:ticketId', () => {
    let ticket: TestTicket

    beforeAll(async () => {
      ticket = await createTicket(project.id, pm.id)
    })

    it('should 200 when a ticket owner tries change the ticket status', async () => {
      await pm.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}`)
        .send({ status: 'urgent' })
        .expect(200)
    })

    it('should 200 when a dev tries to change the ticket status', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}`)
        .send({ status: 'additional_info_required' })
        .expect(200)
    })

    it('should 200 when a pm tries to change a ticket in their project', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}`)
        .send({ status: 'urgent' })
        .expect(200)
    })

    it('should 200 when an admin tries to change a ticket', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .put(`projects/${project.id}/tickets/${ticket.id}`)
        .send({ name: faker.commerce.productName })
        .expect(200)
    })

    it('should 403 when a contributor tries to change the ticket status of someone else\'s ticket', async () => {
      const contributor = await createNewUserAndAddThemToProject(project.id, 'contributor')

      await contributor.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}`)
        .send({ status: 'urgent' })
        .expect(403)
    })

    it('should 403 when a pm who isn\'t assigned to the project tries to change ticket status', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}`)
        .send({ status: 'urgent' })
        .expect(403)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId', () => {
    let ticket: TestTicket

    beforeEach(async () => {
      ticket = await createTicket(project.id, pm.id)
    })

    it('should 204 when a ticket owner deletes their own ticket', async () => {
      await pm.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}`)
        .expect(204)
    })

    it('should 204 when a pm deletes a ticket', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}`)
        .expect(204)
    })

    it('should 204 when an admin tries to delete a ticket', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}`)
        .expect(204)
    })

    it('should 403 when a pm who is not on the project tries to delete a ticket', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}`)
        .expect(403)
    })
  })

  it('should 404 when project not found', async () => {
    await pm.agent
      .post('/projects/0000/tickets')
      .send({ description: faker.company.bs() })
      .expect(404)
  })

  it('should 404 when a ticket is not found', async () => {
    await pm.agent
      .put(`/projects/${project.id}/tickets/000`)
      .send({ status: 'urgent' })
      .expect(404)
  })
})