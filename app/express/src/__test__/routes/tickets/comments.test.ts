import { faker } from '@faker-js/faker'
import type { TestProject, TestUser, TestTicket, TestTicketComment } from '../../helper'
import { 
  testPaginationRoutes, createTestUser, createTicketComment, 
  createNewUserAndAddThemToProject, createTicketComments, 
  createPmAndProjectWithTicket, closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Project Ticket Comment Routes', () => {
  let pm: TestUser
  let project: TestProject
  let ticket: TestTicket

  beforeAll(async () => {
    ({ pm, project, ticket } = await createPmAndProjectWithTicket())
    await createTicketComments(ticket.id, pm.id, 20)
  })

  describe('GET /projects/:projectId/tickets/:ticketId/comments', () => { 
    testPaginationRoutes(pm.agent, `/projects/${project.id}/tickets/${ticket.id}`, 'projectTicketComments')

    it('should 403 when a non project user tries to get ticket comments', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .get(`/projects/${project.id}/tickets/${ticket.id}/comments`)
        .expect(403)
    })
  })

  describe('POST /projects/:projectId/tickets/:ticketId/comments', () => {
    const url = `/projects/${project.id}/tickets/${ticket.id}/comments`

    it('should 201 when a project member creates a ticket comment', async () => {
      await pm.agent
        .post(url)
        .send({ message: faker.random.words(50) })
        .expect(201)
    })

    it('should 403 when someone who doesn\'t belong to the project tries to create a ticket comment', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .post(url)
        .send({ message: faker.random.words(50) })
        .expect(403)
    })
  })

  describe('PUT /projects/:projectId/tickets/:ticketId/comments/:commentId', () => {
    let ticketComment: TestTicketComment

    beforeAll(async () => {
      ticketComment = await createTicketComment(ticket.id, pm.id, faker.random.words(50))
    })

    it('should 200 when a comment owner changes their ticket comment', async () => {
      await pm.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .send({ message: faker.random.words(50) })
        .expect(200)
    })

    it('should 200 when a project manager tries to change a ticket comment', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .send({ message: faker.random.words(50) })
        .expect(200)
    })

    it('should 200 when an admin tries to change a ticket comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .send({ message: faker.random.words(50) })
        .expect(200)
    })

    it('should 403 when a project dev tries to change someone\'s ticket comment', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .send({ message: faker.random.words(50) })
        .expect(403)
    })

    it('should 403 when a pm tries to change a ticket comment in someone else\'s project', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .put(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .send({ message: faker.random.words(50) })
        .expect(403)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId/comments/:commentId', () => {
    let ticketComment: TestTicketComment

    beforeEach(async () => {
      ticketComment = await createTicketComment(ticket.id, pm.id, faker.random.words(50))
    })

    it('should 204 when the owner deletes their own comment', async () => {
      await pm.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .expect(204)
    })

    it('should 204 when a pm deletes someones comment', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .expect(204)
    })

    it('should 204 when an admin tries to delete a ticket comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .expect(204)
    })

    it('should 403 when a pm tries to delete a ticket comment in someone else\'s project', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`)
        .expect(403)
    })
  })

  it('should 404 when the project is not found', async () => {
    await pm.agent
      .post(`/projects/000/tickets/${ticket.id}/comments`)
      .send({ message: faker.random.words(50) })
      .expect(401)
  })

  it('should 404 when the ticket is not found', async () => {
    await pm.agent
      .post(`/projects/${project.id}/tickets/000/comments`)
      .send({ message: faker.random.words(50) })
      .expect(401)
  })

  it('should 404 when the ticket comment is missing', async () => {
    await pm.agent
      .put(`/projects/${project.id}/tickets/${ticket.id}/comments/0000`)
      .send({ message: faker.random.words(50) })
      .expect(404)
  })
})