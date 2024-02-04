import { faker } from '@faker-js/faker'
import type { Project } from '../../../models/Project'
import type { Ticket } from '../../../models/Ticket'
import type { TicketComment } from '../../../models/TicketComment'
import type { TestUser } from '../../helper'
import { 
  testPaginationRoutes, createTestUser, 
  createNewUserAndAddThemToProject,
  createTicketComment, createPmAndProjectWithTicket, 
  closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Project Ticket Comment Routes', () => {
  let pm: TestUser
  let project: Project
  let ticket: Ticket
  let ticketComment: TicketComment

  beforeAll(async () => {
    ({ pm, project, ticket } = await createPmAndProjectWithTicket())
    ticketComment = await createTicketComment(ticket.id.toString(), pm.id.toString())
  })

  // describe('GET /projects/:projectId/tickets/:ticketId/comments', () => { 
  //   testPaginationRoutes(pm.agent, `/projects/${project.id}/tickets/${ticket.id}`, 'projectTicketComments')

  //   it('should 403 when a non project user tries to get ticket comments', async () => {
  //     const dev = await createTestUser('developer')

  //     await dev.agent
  //       .get(`/projects/${project.id}/tickets/${ticket.id}/comments`)
  //       .expect(403)
  //   })
  // })

  describe('POST /projects/:projectId/tickets/:ticketId/comments', () => {
    const url = `/projects/${project.id}/tickets/${ticket.id}/comments`

    it('should 201 when a project member creates a ticket comment', async () => {
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(201)
    })

    it('should 403 when someone who doesn\'t belong to the project tries to create a ticket comment', async () => {
      const dev = await createTestUser('developer')
      const message = faker.random.words(50)

      await dev.agent
        .post(url)
        .send({ message })
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const url = `/projects/000/tickets/${ticket.id}/comments`
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(401)
    })

    it('should 404 when the ticket is not found', async () => {
      const url = `/projects/${project.id}/tickets/000/comments`
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(401)
    })
  })

  describe('PUT /projects/:projectId/tickets/:ticketId/comments/:commentId', () => {
    const url = `/projects/${project.id}/tickets/${ticket.id}/comments/${ticketComment.id}`

    it('should 200 when a comment owner changes their ticket comment', async () => {
      const message = faker.random.words(50)

      await pm.agent
        .put(url)
        .send({ message })
        .expect(200)
    })

    it('should 200 when a project manager tries to change a ticket comment', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')
      const message = faker.random.words(50)

      await otherPm.agent
        .put(url)
        .send({ message })
        .expect(200)
    })

    it('should 200 when an admin tries to change a ticket comment', async () => {
      const admin = await createTestUser('admin')
      const message = faker.random.words(50)

      await admin.agent
        .put(url)
        .send({ message })
        .expect(200)
    })

    it('should 403 when a project dev tries to change someone\'s ticket comment', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')
      const message = faker.random.words(50)

      await dev.agent
        .put(url)
        .send({ message })
        .expect(403)
    })

    it('should 403 when a pm tries to change a ticket comment in someone else\'s project', async () => {
      const otherPm = await createTestUser('project_manager')
      const message = faker.random.words(50)

      await otherPm.agent
        .put(url)
        .send({ message })
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const url = `/projects/000/tickets/${ticket.id}/comments/${ticketComment.id}`
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(404)
    })

    it('should 404 when the ticket is not found', async () => {
      const url = `/projects/${project.id}/tickets/000/comments/${ticketComment.id}`
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(404)
    })

    it('should 404 when the ticket comment is missing', async () => {
      const url = `/projects/${project.id}/tickets/${ticket.id}/comments/0000`
      const message = faker.random.words(50)

      await pm.agent
        .put(url)
        .send({ message })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId/comments/:commentId', () => {
    let ticketComment: TicketComment
    let url: string

    beforeEach(async () => {
      ticketComment = await createTicketComment(ticket.id, pm.id, faker.random.words(50))
      url = `/projects/${project.id}/tickets/${ticketComment.id}/comments/${ticketComment.id}`
    })

    it('should 204 when the owner deletes their own comment', async () => {
      await pm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when a pm deletes someones comment', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when an admin tries to delete a ticket comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when a pm tries to delete a ticket comment in someone else\'s project', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(url)
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const url = `/projects/000/tickets/${ticket.id}/comments/${ticketComment.id}`
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(404)
    })

    it('should 404 when the ticket is not found', async () => {
      const url = `/projects/${project.id}/tickets/000/comments/${ticketComment.id}`
      const message = faker.random.words(50)

      await pm.agent
        .post(url)
        .send({ message })
        .expect(404)
    })

    it('should 404 when the ticket comment is missing', async () => {
      const url = `/projects/${project.id}/tickets/${ticket.id}/comments/0000`
      const message = faker.random.words(50)

      await pm.agent
        .put(url)
        .send({ message })
        .expect(404)
    })
  })
})