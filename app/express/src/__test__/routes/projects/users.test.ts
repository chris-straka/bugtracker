import { 
  createTestUser, createNewUserAndAddThemToProject, testPaginationRoutes, 
  TestUser, TestProject, createPmAndProjectWithUsers, closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Project User Routes', () => {
  let pm: TestUser 
  let project: TestProject

  beforeAll(async () => {
    ({ pm, project } = await createPmAndProjectWithUsers(20))
  })

  describe('GET /projects/:projectId/users', () => {
    testPaginationRoutes(pm.agent, `/projects/${project.id}/users`, 'projectUsers')

    it('should 403 when a non project member tries to see project users', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .get(`/projects/${project.id}/users`)
        .expect(403)
    })
  })

  describe('POST /projects/:projectId/users', () => {
    it('should 201 when a pm tries to add a user to a project', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')
      const newUser = await createTestUser()

      await otherPm.agent
        .post(`/projects/${project.id}/users`)
        .send({ id: newUser.id })
        .expect(201)
    })

    it('should 201 when an admin adds a user to a project', async () => {
      const admin = await createTestUser('admin')
      const dev = await createTestUser('developer')

      await admin.agent
        .post(`admin/projects/${project.id}/users`)
        .send({ id: dev.id })
        .expect(201)
    })

    it('should 403 when a dev tries to add someone to a project', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')
      const newUser = await createTestUser()

      await dev.agent
        .post(`/projects/${project.id}/users`)
        .send({ id: newUser.id })
        .expect(403)
    })

    it('should 403 when a pm tries to add a user to a project they\'re not a part of', async () => {
      const otherPm = await createTestUser('project_manager')
      const newUser = await createTestUser()

      await otherPm.agent
        .post(`/projects/${project.id}/users`)
        .send({ id: newUser.id })
        .expect(403)
    })

    it('should 409 when the user is already assigned to the project', async () => {
      const newUser = await createTestUser()

      await pm.agent
        .post(`/projects/${project.id}/users`)
        .send({ id: newUser.id })
    
      await pm.agent
        .post(`/projects/${project.id}/users`)
        .send({ id: newUser.id })
        .expect(409)
    })
  })

  describe('DELETE /projects/:projectId/users/:userId', () => {
    let newlyCreatedUser: TestUser

    beforeEach(async () => {
      newlyCreatedUser = await createNewUserAndAddThemToProject(project.id)
    })

    test('should 204 when a pm removes a user from a project', async () => {
      await pm.agent
        .delete(`/projects/${project.id}/users/${newlyCreatedUser.id}`)
        .expect(204)
    })

    it('should 204 when an admin removes a user from a project', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .post(`admin/projects/${project.id}/users`)
        .send({ id: newlyCreatedUser.id })
        .expect(204)
    })

    test('should 403 when a pm who is not assigned to the project, attempts to remove a user', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/users/${newlyCreatedUser.id}`)
        .expect(403)
    })

    test('should 403 when a project member tries to remove a user from a project', async () => {
      const dev = await createNewUserAndAddThemToProject('developer')

      await dev.agent
        .delete(`/projects/${project.id}/users/${newlyCreatedUser.id}`)
        .expect(403)
    })

    test('should 404 when a user is not found', async () => {
      await pm.agent
        .delete(`/projects/${project.id}/users/0000`)
        .expect(404)
    })
  })

  test('should 404 when a project is not found', async () => {
    await pm.agent
      .delete(`/projects/000/users/${pm.id}`)
      .expect(404)
  })
})