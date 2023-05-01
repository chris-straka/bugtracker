import { SuperAgentTest } from 'supertest'
import { createTestUser, createPmAndProjectWithUsers, addUserToProject, testPaginationRoutes } from '../helper'

describe('Project Assignments', () => {
  let pm: SuperAgentTest
  let projectId: string

  beforeAll(async () => {
    ({ pm,  projectId } = await createPmAndProjectWithUsers(10))
  })

  describe('GET /projects/:projectId/assignments', () => {
    beforeAll(async () => {
      const { id: endCursor } = await addUserToProject(projectId)
      testPaginationRoutes(pm, `/projects/${projectId}/assignments`, 'projectUserAssignments', endCursor)
    })
  })

  describe('POST /projects/:projectId/assignments', () => {
    it('should 200 when the project owner adds a user to their project', async () => {
      const { id } = await createTestUser('developer')

      await pm
        .post(`/projects/${projectId}/assignments`)
        .send({ id })
        .expect(200)
    })

    it('should 200 when a pm assigned to the project tries to add someone', async () => {
      const { agent: pm } = await addUserToProject(projectId, 'project_manager')
      const userToAdd = await createTestUser('developer')

      await pm
        .post(`/projects/${projectId}/assignments`)
        .send({ id: userToAdd.id })
        .expect(200)
    })

    it('should 401 when a dev tries to assign someone to their project', async () => {
      const { agent: dev } = await addUserToProject(projectId, 'developer')
      const userToAdd = await createTestUser('developer')

      await dev
        .post(`/projects/${projectId}/assignments`)
        .send({ id: userToAdd.id })
        .expect(401)
    })

    it('should 401 when a pm tries to add a user to a project they\'re not a part of', async () => {
      const { agent } = await createTestUser('project_manager')
      const userToAdd = await createTestUser('developer')

      await agent
        .post(`/projects/${projectId}/assignments`)
        .send({ id: userToAdd.id })
        .expect(401)
    })

    it('should 401 when the project owner tries to add a guest to their project', async () => {
      const { id } = await createTestUser('guest')

      await pm
        .post(`/projects/${projectId}/assignments`)
        .send({ id })
        .expect(401)
    })

    it('should 404 when the project is not found', async () => {
      const { agent: pm } = await addUserToProject(projectId, 'project_manager')
      const userToAdd = await createTestUser('developer')

      await pm
        .post('/projects/00000/assignments')
        .send({ id: userToAdd.id })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/assignments/:userId', () => {
    test('should 204 when a pm removes a user from a project', async () => {
      const { agent: pm } = await addUserToProject('project_manager')
      const { id } = await addUserToProject(projectId)

      await pm
        .delete(`/projects/${projectId}/assignments/${id}`)
        .expect(204)
    })

    test('should 401 when a pm who is not assigned to the project, attempts to remove a user', async () => {
      const { agent: pm } = await createTestUser('project_manager')
      const { id } = await addUserToProject('developer')

      await pm
        .delete(`/projects/${projectId}/assignments/${id}`)
        .expect(401)
    })

    test('should 401 when a dev tries to remove a user from a project', async () => {
      const { agent: dev } = await addUserToProject('developer')
      const { id } = await addUserToProject('developer')

      await dev
        .delete(`/projects/${projectId}/assignments/${id}`)
        .expect(401)
    })

    test('should 404 when a user is not found', async () => {
      const { agent } = await addUserToProject('project_manager')

      await agent
        .delete(`/projects/${projectId}/assignments/0000`)
        .expect(404)
    })
  })
})