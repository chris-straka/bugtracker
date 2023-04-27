import { SuperAgentTest } from 'supertest'
import { createTestUser, createPmAndProjectWithAssignments, addUserToProject } from '../../helper'
import { encodeBase64 } from '../../../utility/base64'

describe('Project Users', () => {
  let pm: SuperAgentTest
  let projectId: string

  beforeAll(async () => {
    ({ pm,  projectId } = await createPmAndProjectWithAssignments(10))
  })

  describe('GET /projects/:projectId/users', () => {
    it('should 200 and return users assigned to a project', async () => {
      const res = await pm.get(`/projects/${projectId}/users`)

      expect(res).toMatchObject({
        status: 200,
        body: {
          users: expect.any(Array),
          nextCursor: expect.any(String)
        }
      })
    })

    it('should 200 and return users up to a limit', async () => {
      const limit = 6
      const res = await pm.get(`/projects/${projectId}/users?limit=${limit}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.users.length).toBe(limit)
    })

    it('should 200 when using the cursor', async () => {
      const first = await pm.get(`/projects/${projectId}/users`)
      const nextCursor = first.body.nextCursor

      await pm
        .get(`/projects/${projectId}/users?cursor=${nextCursor}`)
        .expect(200)
    })

    it('should 200 and return [] when the cursor is at the end', async () => {
      const { id: userId } = await addUserToProject(projectId)
      const endCursor = encodeBase64(userId)

      const res = await pm.get(`/projects/${projectId}/users?cursor=${endCursor}`)
      
      expect(res.status).toBe(200)
      expect(res.body.users.length).toBe(0)
    })

    it('should 400 when the limit is 0', async () => {
      const limit = 0
      await pm.get(`/projects/${projectId}/users?limit=${limit}`).expect(400)
    })

    it('should 400 when given an invalid cursor', async () => {
      await pm.get(`/projects/${projectId}/users?cursor=wrong`).expect(400)
    })
  })

  describe('POST /projects/:projectId/users', () => {
    it('should 200 when the project owner adds a user to their project', async () => {
      const { id } = await createTestUser('developer')

      await pm
        .post(`/projects/${projectId}/users`)
        .send({ id })
        .expect(200)
    })

    it('should 200 when a pm assigned to the project tries to add someone', async () => {
      const { agent: pm } = await addUserToProject(projectId, 'project_manager')
      const userToAdd = await createTestUser('developer')

      await pm
        .post(`/projects/${projectId}/users`)
        .send({ id: userToAdd.id })
        .expect(200)
    })

    it('should 401 when a dev tries to assign someone to their project', async () => {
      const { agent: dev } = await addUserToProject(projectId, 'developer')
      const userToAdd = await createTestUser('developer')

      await dev
        .post(`/projects/${projectId}/users`)
        .send({ id: userToAdd.id })
        .expect(401)
    })

    it('should 401 when a pm tries to add a user to a project they\'re not a part of', async () => {
      const { agent } = await createTestUser('project_manager')
      const userToAdd = await createTestUser('developer')

      await agent
        .post(`/projects/${projectId}/users`)
        .send({ id: userToAdd.id })
        .expect(401)
    })

    it('should 401 when the project owner tries to add a guest to their project', async () => {
      const { id } = await createTestUser('guest')

      await pm
        .post(`/projects/${projectId}/users`)
        .send({ id })
        .expect(401)
    })

    it('should 404 when the project is not found', async () => {
      const { agent: pm } = await addUserToProject(projectId, 'project_manager')
      const userToAdd = await createTestUser('developer')

      await pm
        .post('/projects/00000/users')
        .send({ id: userToAdd.id })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId/users/:userId', () => {
    test('should 204 when a pm removes a user from a project', async () => {
      const { agent: pm } = await addUserToProject('project_manager')
      const { id } = await addUserToProject(projectId)

      await pm
        .delete(`/projects/${projectId}/users/${id}`)
        .expect(204)
    })

    test('should 401 when a pm who is not assigned to the project, attempts to remove a user', async () => {
      const { agent: pm } = await createTestUser('project_manager')
      const { id } = await addUserToProject('developer')

      await pm
        .delete(`/projects/${projectId}/users/${id}`)
        .expect(401)
    })

    test('should 401 when a dev tries to remove a user from a project', async () => {
      const { agent: dev } = await addUserToProject('developer')
      const { id } = await addUserToProject('developer')

      await dev
        .delete(`/projects/${projectId}/users/${id}`)
        .expect(401)
    })

    test('should 404 when a user is not found', async () => {
      const { agent } = await addUserToProject('project_manager')

      await agent
        .delete(`/projects/${projectId}/users/0000`)
        .expect(404)
    })
  })
})