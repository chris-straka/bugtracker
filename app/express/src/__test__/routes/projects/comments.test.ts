import { faker } from '@faker-js/faker'
import type { TestUser, TestProject, TestProjectComment } from '../../helper'
import { 
  createTestUser, createProjectComment, 
  createNewUserAndAddThemToProject, 
  testPaginationRoutes, closeDbConnections,
  createPmAndProjectWithUsersAndComments, 
} from '../../helper'
 
afterAll(async () => {
  await closeDbConnections()
})

describe('Project Comments', () => {
  let pm: TestUser
  let project: TestProject

  beforeAll(async () => {
    ({ pm, project } = await createPmAndProjectWithUsersAndComments(10, 20))
  })

  describe('GET /projects/:projectId/comments', () => {
    testPaginationRoutes(pm.agent, `/projects/${project.id}/comments`, 'projectComments')

    it('should 403 when a non project member tries to read project comments', async () => {
      const user = await createTestUser()

      await user.agent
        .get(`/projects/${project.id}/comments`)
        .expect(403)
    })
  })

  describe('POST /projects/:projectId/comments', () => {
    it('should 201 when a project member creates a comment', async () => {
      await pm.agent
        .post(`/projects/${project.id}/comments`)
        .send({ message: faker.random.words(50) })
        .expect(201)
    })

    it('should 201 when an admin creates a comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .post(`/projects/${project.id}/comments`)
        .send({ message: faker.random.words(50) })
        .expect(201)
    })

    it('should 403 when a non project member tries to create a comment', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .post(`/projects/${project.id}/comments`)
        .send({ message: faker.random.words(50) })
        .expect(403)
    })
  })

  describe('PUT /projects/:projectId/comments/:commentId', () => {
    let projectComment: TestProjectComment

    beforeAll(async () => {
      projectComment = await createProjectComment(project.id, pm.id)
    })

    it('should 200 after the comment owner changes their comment', async () => {
      await pm.agent
        .put(`/projects/${project.id}/comments/${projectComment.id}`)
        .send({ message: faker.commerce.productDescription() })
        .expect(200)
    })

    it('should 200 after the admin changes a comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .put(`/projects/${project.id}/comments/${projectComment.id}`)
        .send({ message: faker.commerce.productDescription() })
        .expect(200)
    })

    it('should 200 when a project manager tries to change someone\'s comment', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .put(`/projects/${project.id}/comments/${projectComment.id}`)
        .send({ message: faker.random.words(50) })
        .expect(200)
    })

    it('should 400 when the nothing is passed in', async () => {
      await pm.agent
        .put(`/projects/${project.id}/comments/${projectComment.id}`)
        .send({})
        .expect(400)
    })

    it('should 403 when another developer tries to change someone\'s comment', async () => {
      const user = await createNewUserAndAddThemToProject(project.id, 'developer')

      await user.agent
        .put(`/projects/${project.id}/comments/${projectComment.id}`)
        .send({ message: faker.commerce.productDescription() })
        .expect(403)
    })

    it('should 403 when a project manager from another project tries to change a comment', async () => {
      const pm = await createTestUser('project_manager')

      await pm.agent
        .put(`/projects/${project.id}/comments/${projectComment.id}`)
        .send({ message: faker.commerce.productDescription() })
        .expect(403)
    })
  })

  describe('DELETE /projects/:projectId/comments/:commentId', () => {
    let projectComment: TestProjectComment

    beforeEach(async () => {
      projectComment = await createProjectComment(project.id, pm.id)
    })

    it('should 204 when a comment owner deletes their own comment', async () => {
      await pm.agent
        .delete(`/projects/${project.id}/comments/${projectComment.id}`)
        .expect(204)
    })

    it('should 204 when a project manager tries to delete someone\'s comment', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/comments/${projectComment.id}`)
        .expect(201)
    })

    it('should 204 when an admin tries to delete a comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(`admin/projects/${project.id}/comments/${projectComment.id}`)
        .expect(204)
    })

    it('should 403 when a project dev attempts to delete someone else\'s comment', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id, 'developer')

      await dev.agent
        .delete(`/projects/${project.id}/comments/${projectComment.id}`)
        .expect(403)
    })

    it('should 403 when a pm who is not assigned to the project tries to delete a comment', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}/comments/${projectComment.id}`)
        .expect(403)
    })
  })

  it('should 404 if project is not found', async () => {
    await pm.agent
      .post('/projects/00000/comments')
      .send({ message: faker.random.words(50) })
      .expect(404)
  })

  it('should 404 when the project comment is not found', async () => { 
    await pm.agent
      .put(`/projects/${project.id}/comments/0000`)
      .send({ message: faker.random.words(50) })
      .expect(404)
  })
})