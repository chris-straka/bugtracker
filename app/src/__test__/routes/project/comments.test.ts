import { faker } from '@faker-js/faker'
import type { Project } from '../../../models/Project'
import type { ProjectComment } from '../../../models/ProjectComment'
import type { TestUser } from '../../helper'
import { 
  createTestUser, createProjectComment, 
  createNewUserAndAddThemToProject, 
  createPmAndProject, closeDbConnections,
  // testPaginationRoutes, 
} from '../../helper'
 
afterAll(async () => {
  await closeDbConnections()
})

describe('Project Comments', () => {
  let pm: TestUser
  let projectDev: TestUser
  let otherPm: TestUser
  let admin: TestUser
  let project: Project
  let url: string

  beforeAll(async () => {
    ({ pm, project } = await createPmAndProject())
    projectDev = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')
    otherPm = await createNewUserAndAddThemToProject(project.id.toString(), 'project_manager')
    admin = await createTestUser('admin')
    url = `/projects/${project.id}/comments`
  })

  // describe('GET /projects/:projectId/comments', () => {
  //   testPaginationRoutes(pm.agent, `/projects/${project.id}/comments`, 'projectComments')

  //   it('should 403 when a non project member tries to read project comments', async () => {
  //     const user = await createTestUser()

  //     await user.agent
  //       .get(`/projects/${project.id}/comments`)
  //       .expect(403)
  //   })
  // })

  describe('POST /projects/:projectId/comments', () => {
    const comment = faker.random.words(20)

    it('should 201 when a project member creates a comment', async () => {
      await pm.agent
        .post(url)
        .send({ comment })
        .expect(201)
    })

    it('should 201 when an admin creates a comment', async () => {
      await admin.agent
        .post(url)
        .send({ comment })
        .expect(201)
    })

    it('should 403 when a non project member tries to create a comment', async () => {
      const unassignedPm = await createTestUser('project_manager')

      await unassignedPm.agent
        .post(url)
        .send({ comment })
        .expect(403)
    })

    it('should 404 if project is not found', async () => {
      const url = '/projects/0000/comments'

      await pm.agent
        .post(url)
        .send({ comment })
        .expect(404)
    })
  })

  describe('PUT /projects/:projectId/comments/:commentId', () => {
    let projectComment: ProjectComment
    let url: string

    beforeAll(async () => {
      projectComment = await createProjectComment(project.id.toString(), projectDev.id.toString())
      url = `/projects/${project.id}/comments/${projectComment.id}`
    })

    it('should 200 when the comment owner tries to change their comment', async () => {
      const comment = faker.random.words(20)

      await projectDev.agent
        .put(url)
        .send({ comment })
        .expect(200)
    })

    it('should 200 when an admin tries to change a comment', async () => {
      const comment = faker.random.words(20)

      await admin.agent
        .put(url)
        .send({ comment })
        .expect(200)
    })

    it('should 200 when a project manager tries to change someone\'s comment', async () => {
      const comment = faker.random.words(20)

      await otherPm.agent
        .put(url)
        .send({ comment })
        .expect(200)
    })

    it('should 400 when the nothing is passed in', async () => {
      await pm.agent
        .put(url)
        .send({})
        .expect(400)
    })

    it('should 403 when another project assigned developer tries to change a comment they do not own', async () => {
      const projectDev2 = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')
      const comment = faker.random.words(20)

      await projectDev2.agent
        .put(url)
        .send({ comment })
        .expect(403)
    })

    it('should 403 when a project manager from another project tries to change a comment', async () => {
      const unassignedPm = await createTestUser('project_manager')
      const comment = faker.random.words(20)

      await unassignedPm.agent
        .put(url)
        .send({ comment })
        .expect(403)
    })

    it('should 404 if project is not found', async () => {
      const url = `/projects/0000/comments/${projectComment.id}`
      const comment = faker.random.words(20)

      await pm.agent
        .post(url)
        .send({ comment })
        .expect(404)
    })

    it('should 404 when the comment is not found', async () => {
      const url = `/projects/${project.id}/comments/0000`
      const comment = faker.random.words(20)

      await pm.agent
        .put(url)
        .send({ comment })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/comments/:commentId', () => {
    let projectComment: ProjectComment
    let url: string

    beforeEach(async () => {
      projectComment = await createProjectComment(project.id.toString(), pm.id.toString())
      url = `/projects/${project.id}/comments/${projectComment.id}`
    })

    it('should 204 when a comment owner deletes their own comment', async () => {
      await pm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when a project manager deletes someone\'s comment', async () => {
      await otherPm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when an admin tries to delete a comment', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when a project dev attempts to delete someone else\'s comment', async () => {
      const dev = await createNewUserAndAddThemToProject(project.id.toString(), 'developer')

      await dev.agent
        .delete(url)
        .expect(403)
    })

    it('should 403 when a pm who is not assigned to the project tries to delete a comment', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(url)
        .expect(403)
    })

    it('should 404 if project is not found', async () => {
      const url = `/projects/0000/comments/${projectComment.id}`

      await pm.agent
        .delete(url)
        .expect(404)
    })

    it('should 404 when the comment is not found', async () => {
      const url = `/projects/${project.id}/comments/0000`

      await pm.agent
        .delete(url)
        .expect(404)
    })
  })
})
