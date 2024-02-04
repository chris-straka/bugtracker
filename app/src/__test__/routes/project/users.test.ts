import type { Project } from '../../../models/Project'
import type { TestUser } from '../../helper'
import { 
  createTestUser, createNewUserAndAddThemToProject, 
  createPmAndProject, closeDbConnections,
  // testPaginationRoutes
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Project User Routes', () => {
  let pmProjectOwner: TestUser 
  let pmAssigned: TestUser
  let projectDev: TestUser
  let project: Project
  let url: string

  beforeAll(async () => {
    ({ pm: pmProjectOwner, project } = await createPmAndProject())
    pmAssigned = await createNewUserAndAddThemToProject(project.id.toString(), 'project_manager')
    projectDev = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')
    url = `/projects/${project.id}/users`
  })

  // describe('GET /projects/:projectId/users', () => {
  //   testPaginationRoutes(pm.agent, url, 'projectUsers')

  //   it('should 403 when a non project member tries to see project users', async () => {
  //     const dev = await createTestUser('developer')

  //     await dev.agent
  //       .get(url)
  //       .expect(403)
  //   })
  // })

  describe('POST /projects/:projectId/users', () => {
    it('should 201 when a pm assigned to the project tries to add a new user to that project', async () => {
      const newUser = await createTestUser()

      await pmAssigned.agent
        .post(url)
        .send({ userId: newUser.id })
        .expect(201)
    })

    it('should 201 when an admin adds a user to a project', async () => {
      const admin = await createTestUser('admin')
      const newUser = await createTestUser()

      await admin.agent
        .post(url)
        .send({ userId: newUser.id })
        .expect(201)
    })

    it('should 404 when the project is not found', async () => {
      const newUser = await createTestUser()

      await pmProjectOwner.agent
        .post('/projects/0000/users')
        .send({ userId: newUser.id })
        .expect(404)
    })

    it('should 400 when no userId is provided', async () => {
      await pmProjectOwner.agent
        .post(url)
        .send({})
        .expect(400)
    })

    it('should 403 when a project dev tries to add someone to a project', async () => {
      const newUser = await createTestUser()

      await projectDev.agent
        .post(`/projects/${project.id}/users`)
        .send({ userId: newUser.id })
        .expect(403)
    })

    it('should 403 when a pm not assigned to the project tries to add a new user', async () => {
      const pm = await createTestUser('project_manager')
      const newUser = await createTestUser()

      await pm.agent
        .post(`/projects/${project.id}/users`)
        .send({ userId: newUser.id })
        .expect(403)
    })

    it('should 409 when the user is already assigned to the project', async () => {
      const newUser = await createTestUser()

      await pmProjectOwner.agent
        .post(`/projects/${project.id}/users`)
        .send({ userId: newUser.id })
    
      await pmProjectOwner.agent
        .post(`/projects/${project.id}/users`)
        .send({ userId: newUser.id })
        .expect(409)
    })
  })

  describe('DELETE /projects/:projectId/users/:userId', () => {
    let newlyCreatedUser: TestUser

    beforeEach(async () => {
      newlyCreatedUser = await createNewUserAndAddThemToProject(project.id.toString())
      url = `/projects/${project.id}/users/${newlyCreatedUser.id}`
    })

    it('should 204 when a pm removes a user from their project', async () => {
      await pmProjectOwner.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when an admin removes a user from a project', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when a pm who is not assigned to the project tries to remove a user from a project', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(url)
        .expect(403)
    })

    it('should 403 when a developer tries to remove a user from a project', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id.toString())

      await dev.agent
        .delete(url)
        .expect(403)
    })

    it('should 403 when an admin tries to remove the project owner from their own project', async () => {
      const admin = await createTestUser('admin')
      url = `/projects/${project.id}/users/${pmProjectOwner.id}`
      console.log('url', url)

      await admin.agent
        .delete(url)
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      await pmProjectOwner.agent
        .delete(`/projects/0000/users/${newlyCreatedUser.id}`)
        .expect(404)
    })

    it('should 404 when the user is not found', async () => {
      await pmProjectOwner.agent
        .delete(`/projects/${project.id}/users/0000`)
        .expect(404)
    })
  })
})
  