import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { 
  closeDbConnections, createTestUser, 
  createProject, createProjects, createProjectComment, createProjectComments, 
  createTicket
} from '../helper'

describe('Project Routes', () => {
  let admin: SuperAgentTest
  let pm: SuperAgentTest
  let dev: SuperAgentTest
  let contributor: SuperAgentTest
  let guest: SuperAgentTest

  let pmUserId: string

  beforeAll(async () => {
    ({ agent: admin } = await createTestUser('admin'));
    ({ agent: pm, id: pmUserId } = await createTestUser('project_manager'));
    ({ agent: dev } = await createTestUser('developer'));
    ({ agent: contributor } = await createTestUser('contributor'));
    ({ agent: guest } = await createTestUser('guest'))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('Projects', () => {
    describe('GET /projects', () => {
      it('should 200 and follow pagination rules when retrieving a list of projects', async () => {
        const page = 1
        const limit = 5
        const numOfProjects = 10
        await createProjects(numOfProjects, pmUserId) 

        const response = await dev.get(`/projects?page=${page}&limit=${limit}`)

        expect(response.status).toBe(200)
        expect(response.body.pagination.page).toBe(page)
        expect(response.body.pagination.limit).toBe(limit)
        expect(response.body.projects.length).toBeGreaterThanOrEqual(numOfProjects)
      }) 

      it('should 400 when the page or offset is incorrect', async () => {
        await contributor
          .get('/projects?page=-1&limit=5')
          .expect(400)

        await contributor
          .get('/projects?page=1&limit=-5')
          .expect(400)
      })

      it('should 404 when the the page or offset does not exist', async () => {
        await contributor
          .get('/projects?page=10000000000000000000&limit=5')
          .expect(404)
      })
    })

    describe('GET /projects/:projectId', () => {
      it('should 200 when fetching project details', async () => {
        const project = await createProject(pmUserId)
        await createProjectComment(project.id, pmUserId)
        await createTicket(project.id, pmUserId)

        const res = await contributor
          .get(`/projects/${project.id}`)
          .expect(200)

        expect(res.body.project).toMatchObject({
          id: project.id,
          ownerId: pmUserId,
          name: project.name,
          description: project.description,
          comments: expect.any(Array),
          tickets: expect.any(Array)
        })
      })

      it('should 404 when the project is not found', async () => {
        await contributor
          .get('/projects/000000000000000000000000000000')
          .expect(404)
      })
    })

    describe('POST /projects', () => {
      it('should 201 when a pm or admin creates a new project', async () => {
        await admin
          .post('/projects')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(201)
      
        await pm
          .post('/projects')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(201)
      })

      it('should 401 when an unauthorized user tries to create a project', async () => {
        await dev
          .post('/projects')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(401)

        await contributor
          .post('/projects')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(401)

        await guest
          .post('/projects')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(401)
      })

      it('should 409 when the project name already exists', async () => {
        const name = faker.company.name()
        const description = faker.company.bs()

        await pm
          .post('/projects')
          .send({ name, description })
      
        await pm
          .post('/projects')
          .send({ name, description: 'jeff' })
          .expect(409)
      })

      it('should 400 when there is no project name specified', async () => {
        await pm
          .post('/projects')
          .send({ description: faker.company.bs() })
          .expect(400)

        await pm
          .post('/projects')
          .send({ name: '' })
          .expect(400)
      })
    })

    describe('PUT /projects/:projectId', () => {
      let projectId: string

      beforeAll(async () => {
        ({ id: projectId } = await createProject(pmUserId))
      })

      it('should 200 when the pm changes their own project', async () => {
        const newName = faker.company.name()
        const newDescription = faker.company.bs()

        const res = await pm
          .put(`projects/${projectId}`)
          .send({ name: newName, description: newDescription })

        expect(res.statusCode).toBe(200)
        expect(res.body.project.name).toBe(newName)
        expect(res.body.project.description).toBe(newDescription)
      })

      it('should 200 when an admin changes a project', async () => {
        const newName = faker.company.name()
        const newDescription = faker.company.bs()

        const res = await admin
          .put(`projects/${projectId}`)
          .send({ name: newName, description: newDescription })

        expect(res.statusCode).toBe(200)
        expect(res.body.project.name).toBe(newName)
        expect(res.body.project.description).toBe(newDescription)
      })

      it('should 401 when a pm changes someone else\'s project', async () => {
        const { agent: pm2 } = await createTestUser('project_manager')

        await pm2
          .put(`/projects/${projectId}`)
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(401)
      })

      it('should 401 when an unauthorized user tries to change the project details', async () => {
        await dev
          .put(`/projects/${projectId}`)
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(401)
      })

      it('should 404 when the project is not found', async () => {
        await pm
          .put('projects/00000000000000000000000000')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(404)
      })
    })

    describe('DELETE /projects/:projectId', () => {
      let projectId: string

      beforeAll(async () => {
        ({ id: projectId } = await createProject(pmUserId))
      })

      it('should 204 when an authorized user deletes a project', async () => {
        const project = await createProject(pmUserId)
        await pm.delete(`/projects/${project.id}`).expect(204)
      })

      it('should 401 when unauthorized users try to delete the project', async () => {
        await dev.delete(`/projects/${projectId}`).expect(401)
      })

      it('should 401 when a pm tries to delete someone else\'s project', async () => {
        const { agent: pm2 } = await createTestUser('project_manager')
        pm2.delete(`/projects/${projectId}`).expect(401)
      })

      it('should 404 when the project is not found', async () => {
        await pm.delete('/projects/0000000000000').expect(404)
      })
    })
  })

  describe('Project Users', () => {
    let projectId: string

    afterAll(async () => {
      ({ projectId } = await createProject(pmUserId))
    })

    describe('GET /projects/:projectId/users', () => {
      it('should 200 and return all users in a project', async () => {
        const res = await guest
          .get(`/projects/${projectId}/users`)
        
        expect(res.statusCode).toBe(200)
      })
    })

    describe('POST /projects/:projectId/users', () => {
      it('should 200 when a pm adds a user to their project', async () => {
        const { id: devId } = await createTestUser('developer')

        await pm
          .post(`/projects/${projectId}/users`)
          .send({ id: devId })
          .expect(200)
      })
      it('should 200 when an admin adds a user to a project', async () => {
        
      })

      it('should 401 when a pm adds a user to someone else\'s project project', async () => {
      })

      it('should 404 when a pm adds someone to a nonexistant project', async () => {
      })
    })

    describe('DELETE /projects/:projectId/users/:userId', () => {})
  })

  describe('Project Comments', () => {
    let projectId: string

    beforeAll(async () => {
      projectId = await createProject(pmUserId)
      await createProjectComments(3, pmUserId, projectId)
    })

    describe('GET /projects/:projectId/comments', () => {
      it('should 200 and follow pagination rules when retrieving a list of comments', async () => {
        const page = 1
        const limit = 5
        const response = await dev.get(`/projects/${projectId}/comments?page=${page}&limit=${limit}`)

        expect(response.status).toBe(200)
        expect(response.body.pagination.page).toBe(page)
        expect(response.body.pagination.limit).toBe(limit)
        expect(response.body.comments).toBeInstanceOf(Array)
      })

      it('should 400 when the page or offset is incorrect', async () => {
        await contributor
          .get(`/projects/${projectId}/comments?page=-1&limit=5`)
          .expect(400)

        await contributor
          .get(`/projects/${projectId}/comments?page=1&limit=-5`)
          .expect(400)
      })

      it('should 404 when the the page does not exist', async () => {
        await contributor
          .get(`/projects/${projectId}/comments?page=10000000000000000000&limit=5`)
          .expect(404)
      })
    })

    describe('POST /projects/:projectId/comments', () => {
      it('should 201 when an authorized user creates a comment', async () => {
        await dev
          .post(`/projects/${projectId}/comments`)
          .send({ description: faker.commerce.productDescription() })
          .expect(201)
      })

      it('should 401 when an unauthorized user tries to create a comment', async () => {
        await guest
          .post('/projects')
          .send({ description: faker.commerce.productDescription() })
          .expect(401)
      })
    })

    describe('PUT /projects/:projectId/comments/:commentId', () => {
      let commentId: string

      beforeAll(async () => {
        ({ id: commentId }  = await createProjectComment(projectId, pmUserId))
      })

      it('should 201 after the owner changes their own comment', async () => {
        await pm
          .put(`/projects/${projectId}/comments/${commentId}`)
          .send({ description: faker.commerce.productDescription() })
          .expect(201)
      })

      it('should 201 after an admin changes their comment', async () => {
        await admin
          .put(`/projects/${projectId}/comments/${commentId}`)
          .send({ description: faker.commerce.productDescription() })
          .expect(201)
      })

      it('should 401 when someone other than the owner or an admin tries to change a comment', async () => {
        await dev
          .put(`/projects/${projectId}/comments/${commentId}`)
          .send({ description: faker.commerce.productDescription() })
          .expect(401)
      })
    })

    describe('DELETE /projects/:projectId/comments/:commentId', () => {
      let commentId: string

      beforeEach(async () => {
        ({ id: commentId }  = await createProjectComment(projectId, pmUserId))
      })

      it('should 204 when the owner deletes their own comment', async () => {
        await pm
          .delete(`/projects/${projectId}/comments/${commentId}`)
          .expect(204)
      })

      it('should 204 when an admin tries to delete a comment', async () => {
        await admin
          .delete(`/projects/${projectId}/comments/${commentId}`)
          .expect(204)
      })

      it('should 401 when someone other than the owner/admin tries to delete a comment', async () => {
        await dev
          .post(`/projects/${projectId}/comments/${commentId}`)
          .expect(401)
      })
    })
  })
})