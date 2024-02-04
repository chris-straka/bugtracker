import type { Project } from '../../../models/Project'
import type { Ticket } from '../../../models/Ticket'
import type { TestUser } from '../../helper'
import { 
  createPmAndProjectWithTicket,
  createNewUserAndAddThemToProject,
  createNewUserAndAddThemToTicket,
  createTestUser, closeDbConnections
  // testPaginationRoutes
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User route for finding a ticket\'s assigned users', () => {
  let pm: TestUser
  let projectDev: TestUser
  let project: Project
  let ticket: Ticket

  beforeAll(async () => {
    ({ pm, project, ticket } = await createPmAndProjectWithTicket())
    projectDev = createNewUserAndAddThemToProject(project.id.toString(), 'developer')
  })

  // describe('GET /projects/:projectId/tickets/:ticketId/users', () => {
  //   testPaginationRoutes(pm.agent, `/projects/${project.id}/tickets/${ticket.id}/users`, 'ticketUsers')

  //   it('should 401 when a non project user tries to grab ticket users', async () => {
  //     const dev = await createTestUser('developer')
  //     await dev.agent
  //       .get(`/projects/${project.id}/comments`)
  //       .expect(401)
  //   })
  // })

  describe('POST /projects/:projectId/tickets/:ticketId/users', () => {
    const url = `/projects/${project.id}/tickets/${ticket.id}/users`

    it('should 201 when a project manager assigns a project member to a ticket', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await pm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(201)
    })

    it('should 201 when an admin assigns a user to a ticket', async () => {
      const admin = await createTestUser('admin')
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await admin.agent
        .post(url)
        .send({ id: dev.id })
        .expect(201)
    })

    it('should 403 when a pm tries to assign someone who isn\'t on the project to a ticket', async () => {
      const dev = await createTestUser('developer')

      await pm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(403)
    })

    it('should 403 when a pm who is not assigned to a project tries to add someone to one of its tickets', async () => {
      const otherPm = await createTestUser('project_manager')
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await otherPm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(403)
    })

    it('should 403 when a project developer tries to make a ticket assignment', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')
      const otherDev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .post(url)
        .send({ id: otherDev.id })
        .expect(403)
    })

    it('should 403 when a non project developer makes a ticket assignment', async () => {
      const dev = await createTestUser('developer')
      const otherDev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .post(url)
        .send({ id: otherDev.id })
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')
      const url = `/projects/0000/tickets/${ticket.id}/users`

      await pm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(404)
    })

    it('should 404 when the ticket is not found', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')
      const url = `/projects/${project.id}/tickets/000/users`

      await pm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(404)
    })

    it('should 409 when the user has already been assigned to the project', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await pm.agent
        .post(url)
        .send({ id: dev.id })

      await pm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(409)
    })
  })

  describe('DELETE /projects/:projectId/tickets/:ticketId/users/:userId', () => {
    let user: TestUser
    let url: string

    beforeEach(async () => {
      user = await createNewUserAndAddThemToTicket(project.id.toString(), ticket.id.toString())
      url = `/projects/${project.id}/tickets/${ticket.id}/users/${user.id}`
    })

    it('should 204 when a project manager removes a ticket assignment', async () => {
      await pm.agent  
        .delete(url)
        .expect(204)
    })

    it('should 204 when an admin removes a user from a ticket', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when a pm who is not assigned to a project tries to remove someone from one of the tickets', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent  
        .delete(url)
        .expect(403)
    })

    it('should 403 when a project developer tries to remove someone from a ticket', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id)

      await dev.agent  
        .delete(url)
        .expect(403)
    })

    it('should 403 when a non project developer tries to remove someone from a ticket', async () => {
      const dev = await createTestUser('developer')

      await dev.agent  
        .delete(url)
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')
      const url = `/projects/0000/tickets/${ticket.id}/users/${user.id}`

      await pm.agent
        .post(url)
        .send({ id: dev.id })
        .expect(404)
    })

    it('should 404 when the ticket is not found', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await pm.agent
        .post(`/projects/${project.id}/tickets/000/users/${user.id}`)
        .send({ id: dev.id })
        .expect(404)
    })
    
    it('should 404 when the user is not found', async () => {
      const url = `/projects/${project.id}/tickets/${ticket.id}/users/000`

      await pm.agent  
        .delete(url)
        .expect(404)
    })
  })
})