import type { TestUser, TestProject, TestTicket } from '../../helper'
import { 
  createPmAndProjectWithTicket,
  createNewUsersAndAddThemToTicket,
  testPaginationRoutes, createTestUser,
  createNewUserAndAddThemToProject,
  createNewUserAndAddThemToTicket,
  closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User route for finding a ticket\'s assigned users', () => {
  let pm: TestUser
  let project: TestProject
  let ticket: TestTicket

  beforeAll(async () => {
    ({ pm, project, ticket } = await createPmAndProjectWithTicket())
    await createNewUsersAndAddThemToTicket(project.id, ticket.id, 20)
  })

  describe('GET /projects/:projectId/tickets/:ticketId/users', () => {
    testPaginationRoutes(pm.agent, `/projects/${project.id}/tickets/${ticket.id}/users`, 'ticketUsers')

    it('should 401 when a non project user tries to grab ticket users', async () => {
      const dev = await createTestUser('developer')
      await dev.agent
        .get(`/projects/${project.id}/comments`)
        .expect(401)
    })
  })

  describe('POST /projects/:projectId/tickets/:ticketId/users', () => {
    it('should 201 when a project manager assigns a project member to a ticket', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await pm.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: dev.id })
        .expect(201)
    })

    it('should 201 when an admin assigns a user to a ticket', async () => {
      const admin = await createTestUser('admin')
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await admin.agent
        .post(`/tickets/${ticket.id}/users`)
        .send({ id: dev.id })
        .expect(201)
    })

    it('should 403 when a pm tries to assign someone who isn\'t on the project to a ticket', async () => {
      const dev = await createTestUser('developer')

      await pm.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: dev.id })
        .expect(403)
    })

    it('should 403 when a pm who is not assigned to a project tries to add someone to one of its tickets', async () => {
      const otherPm = await createTestUser('project_manager')
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await otherPm.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: dev.id })
        .expect(403)
    })

    it('should 403 when a project developer tries to make a ticket assignment', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')
      const otherDev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: otherDev.id })
        .expect(403)
    })

    it('should 403 when a non project developer makes a ticket assignment', async () => {
      const dev = await createTestUser('developer')
      const otherDev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: otherDev.id })
        .expect(403)
    })

    it('should 409 when the user has already been assigned to the project', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await pm.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: dev.id })

      await pm.agent
        .post(`/projects/${project.id}/tickets/${ticket.id}/users`)
        .send({ id: dev.id })
        .expect(409)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId/users/:userId', () => {
    let user: TestUser

    beforeEach(async () => {
      user = await createNewUserAndAddThemToTicket(project.id, ticket.id)
    })

    it('should 204 when a project manager removes a ticket assignment', async () => {
      await pm.agent  
        .delete(`/projects/${project.id}/tickets/${ticket.id}/users/${user.id}`)
        .expect(204)
    })

    it('should 204 when an admin removes a user from a ticket', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(`/tickets/${ticket.id}/users/${user.id}`)
        .expect(204)
    })

    it('should 403 when a pm who is not assigned to a project tries to remove someone from one of the tickets', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent  
        .delete(`/projects/${project.id}/tickets/${ticket.id}/users/${user.id}`)
        .expect(403)
    })

    it('should 403 when a project developer tries to remove someone from a ticket', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id)

      await dev.agent  
        .delete(`/projects/${project.id}/tickets/${ticket.id}/users/${user.id}`)
        .expect(403)
    })

    it('should 403 when a non project developer tries to remove someone from a ticket', async () => {
      const dev = await createTestUser('developer')

      await dev.agent  
        .delete(`/projects/${project.id}/tickets/${ticket.id}/users/${user.id}`)
        .expect(403)
    })
    
    it('should 404 when the user is not found', async () => {
      await pm.agent  
        .delete(`/projects/${project.id}/tickets/${ticket.id}/users/000`)
        .expect(404)
    })
  })

  it('should 404 when the project is not found', async () => {
    const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

    await pm.agent
      .post(`/projects/0000/tickets/${ticket.id}/users`)
      .send({ id: dev.id })
      .expect(404)
  })

  it('should 404 when the ticket is not found', async () => {
    const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

    await pm.agent
      .post(`/projects/${project.id}/tickets/000/users`)
      .send({ id: dev.id })
      .expect(404)
  })
})