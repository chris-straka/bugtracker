import { faker } from '@faker-js/faker'
import type { TestProject, TestUser } from '../../../helper'
import { 
  createPmAndProjects, testPaginationRoutes, 
  createNewUserAndAddThemToProject, 
  createPmAndProject, createTestUser,
  closeDbConnections
} from '../../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Admin project routes', () => {
  let admin: TestUser

  beforeEach(async () => {
    admin = await createTestUser('admin')
  })

  describe('GET /admin/projects', () => {
    beforeAll(async () => {
      await createPmAndProjects(20, description)
    })

    testPaginationRoutes(admin.agent, '/admin/projects', 'projects')

    const description = faker.random.words(20)
    testPaginationRoutes(admin.agent, '/admin/projects', 'projects', { search: description })
  })

  describe('PUT /admin/project/:projectId/owner', () => {
    let originalPm: TestUser
    let project: TestProject

    beforeEach(async () => {
      ({ pm: originalPm, project } = await createPmAndProject(project.name, project.description))
    })

    it('should 200 when an admin changes project ownership to a new pm', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })
        .expect(200)
    })

    it('should show the new pm when fetching project details after the change', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })

      const res = await pm.agent
        .get(`/projects/${project.id}`)
        .expect(200)
      
      expect(res.body.project.ownerId).toBe(pm.id)
    })

    it('should show the new pm in the list of assigned users for that project', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })

      const res = await pm.agent
        .get(`/projects/${project.id}`)
        .expect(200)
      
      expect(res.body.project.ownerId).toBe(pm.id)
    })

    it('should 204 when the new pm tries to remove the old pm from the project after changing ownership', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })
      
      await pm.agent
        .delete(`/projects/${project.id}/users/${originalPm.id}`)
        .expect(204)
    })

    it('should 403 if the admin tries to promote a pm who is not assigned to the project', async () => {
      const pm = await createTestUser('project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })
    })

    it('should 403 when the admin tries to make a developer the new project owner', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: dev.id })
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put('/admin/project/000/owner')
        .send({ id: pm.id })
        .expect(200)
    })
  })
})