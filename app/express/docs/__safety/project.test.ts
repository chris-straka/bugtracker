import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { encodeBase64 } from '../../src/utility/base64'
import { closeDbConnections, createTestUser, createPmAndProject, createPmAndProjects } from '../../src/__test__/helper'

describe('Project Routes', () => {
  afterAll(async () => {
    await closeDbConnections()
  })

  describe('GET /projects', () => {
    let pm: SuperAgentTest

    beforeAll(async () => {
      ({ pm } = await createPmAndProjects(10))
    })

    it('should 200 and return projects', async () => {
      const res = await pm.get('/projects').expect(200)

      expect(res.body).toHaveProperty('projects')
      expect(res.body).toHaveProperty('nextCursor')
    }) 

    it('should 200 and return the number of projects you ask for', async () => {
      const limit = 6
      const res = await pm.get(`/projects?limit=${limit}`)
        
      expect(res.status).toBe(limit)
      expect(res.body.projects.length).toBe(limit)
    })

    it('should 200 when using nextCursor to retrieve more projects', async () => {
      const first = await pm.get('/projects')
      const nextCursor = first.body.nextCursor

      await pm
        .get(`/projects?cursor=${nextCursor}`)
        .expect(200)
    })

    it('should 200 and [] when nothing is left', async () => {
      const { projectId } = await createPmAndProject()
      const cursorEnd = encodeBase64(projectId.toString())

      const res = await pm.get(`/projects?cursor=${cursorEnd}`)

      expect(res.status).toBe(200)
      expect(res.body.projects.length).toBe(0)
    })

    it('should 400 when given a limit of 0', async () => {
      await pm.get('/projects?limit=0').expect(400)
    })

    it('should 400 when given an invalid cursor', async () => {
      await pm.get('/projects?cursor=wrong').expect(400)
    })
  })

  describe('GET /projects/:projectId', () => {
    it('should 200 when fetching project details', async () => {
      const { projectId, projectName, projectDescription, pmId, pm } = await createPmAndProject()

      const res = await pm
        .get(`/projects/${projectId}`)
        .expect(200)

      expect(res.body.project).toMatchObject({
        id: projectId,
        ownerId: pmId,
        name: projectName,
        description: projectDescription,
        comments: expect.any(Array),
        tickets: expect.any(Array)
      })
    })

    it('should 404 when the project is not found', async () => {
      const { agent } = await createTestUser()
      await agent
        .get('/projects/000000000000000000000000000000')
        .expect(404)
    })
  })

  describe('POST /projects', () => {
    it('should 201 when creating a project', async () => {
      const { agent: pm } = await createTestUser('project_manager')

      await pm
        .post('/projects')
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(201)
    })

    it('should 401 when a dev creates a project', async () => {
      const { agent: dev } = await createTestUser('developer')

      await dev
        .post('/projects')
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(401)
    })

    it('should 409 when the project name already exists', async () => {
      const { pm, projectName } = await createPmAndProject()
      
      await pm
        .post('/projects')
        .send({ name: projectName, description: 'foo' })
        .expect(409)
    })

    it('should 400 when something is missing', async () => {
      const { agent: pm } = await createTestUser('project_manager')
      
      await pm
        .post('/projects')
        .send({})
        .expect(400)
    })
  })

  describe('PUT /projects/:projectId', () => {
    it('should 200 when a pm tries to change their own project', async () => {
      const { pm, projectId } = await createPmAndProject()
      const name = faker.company.name()
      const description = faker.company.bs()

      const res = await pm
        .put(`projects/${projectId}`)
        .send({ name, description })

      expect(res).toMatchObject({
        status: 200,
        body: {
          project: {
            name,
            description
          }
        }
      })
    })

    it('should 401 when a pm changes a project they do not own', async () => {
      const { projectId } = await createPmAndProject()
      const { agent } = await createTestUser('project_manager')

      await agent
        .put(`/projects/${projectId}`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(401)
    })

    it('should 401 when a dev changes project details', async () => {
      const { agent } = await createTestUser('developer')
      const { projectId } = await createPmAndProject()

      await agent
        .put(`/projects/${projectId}`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(401)
    })

    it('should 404 when the project is not found', async () => {
      const { agent } = await createTestUser('project_manager')

      await agent
        .put('projects/0')
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId', () => {
    it('should 204 when the project owner deletes their project', async () => {
      const { projectId, pm } = await createPmAndProject()
      await pm.delete(`/projects/${projectId}`).expect(204)
    })

    it('should 401 when another pm tries to delete their project', async () => {
      const { projectId } = await createPmAndProject()
      const { agent } = await createTestUser('project_manager')

      await agent.delete(`/projects/${projectId}`).expect(401)
    })

    it('should 404 when the project is not found', async () => {
      const { agent } = await createTestUser('project_manager')

      await agent.delete('/projects/0').expect(404)
    })
  })
})