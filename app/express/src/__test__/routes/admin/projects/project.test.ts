import { 
  TestProject, TestUser, closeDbConnections, 
  createNewUserAndAddThemToProject, 
  createPmAndProject, createTestUser 
} from '../../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Admin route for changing the owner of a project', () => {
  let admin: TestUser
  let originalProjectOwner: TestUser
  let project: TestProject

  beforeEach(async () => {
    admin = await createTestUser('admin');
    ({ pm: originalProjectOwner, project } = await createPmAndProject(project.name, project.description))
  })

  describe('PUT /admin/project/:projectId/owner', () => {
    it('should 200 when an admin makes a pm the owner of someone else\'s project', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })
        .expect(200)
    })

    it('should 200 and show the new owner when fetching project details', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })

      const res = await pm.agent
        .get(`/projects/${project.id}`)
        .expect(200)
      
      expect(res.body.project.ownerId).toBe(pm.id)
    })

    it('should 200 when a new project owner tries to remove the old project owner from the project', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await admin.agent
        .put(`/admin/project/${project.id}/owner`)
        .send({ id: pm.id })
      
      await pm.agent
        .delete(`/projects/${project.id}/users/${originalProjectOwner.id}`)
        .expect(200)
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