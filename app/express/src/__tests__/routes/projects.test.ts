import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { createTestUser, closeDbConnections, createProjects, createProject, createRandomTicket } from '../helper'
import { createRandomProjectComment } from '../helper/project'

describe('Project Routes', () => {
  let admin: SuperAgentTest
  let pm: SuperAgentTest
  let dev: SuperAgentTest
  let contributor: SuperAgentTest

  let pmUserId: string

  beforeAll(async () => {
    ({ agent: admin } = await createTestUser('admin'));
    ({ agent: pm, id: pmUserId } = await createTestUser('project_manager'));
    ({ agent: dev } = await createTestUser('developer'));
    ({ agent: contributor } = await createTestUser('contributor'))
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('GET /projects', () => {
    it('should 200 and follow pagination rules when retrieving a list of projects', async () => {
      // arrange
      const page = 1
      const limit = 5
      const numOfProjects = 10
      await createProjects(numOfProjects, pmUserId) 

      // act
      const response = await dev.get(`/projects?page=${page}&limit=${limit}`)

      // assert
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

    it('should 404 when the the page does not exist', async () => {
      await contributor
        .get('/projects?page=10000000000000000000&limit=5')
        .expect(404)
    })
  })

  describe('POST /projects', () => {
    it('should 201 when a pm or admin creates a new project', async () => {
      await admin
        .post('/projects')
        .send({ projectName: faker.company.name(), projectDescription: faker.company.bs() })
        .expect(201)
      
      await pm
        .post('/projects')
        .send({ projectName: faker.company.name(), projectDescription: faker.company.bs() })
        .expect(201)
    })

    it('should 401 when an unauthorized user tries to create a project', async () => {
      dev
        .post('/projects')
        .send({ projectName: faker.company.name(), projectDescription: faker.company.bs() })
        .expect(401)

      contributor
        .post('/projects')
        .send({ projectName: faker.company.name(), projectDescription: faker.company.bs() })
        .expect(401)
    })
  })

  describe('GET /projects/:projectId', () => {
    it('should 200 when fetching project details', async () => {
      // Arrange
      const { id: project_id, description } = await createProject(pmUserId)
      const projectComment = await createRandomProjectComment(project_id, pmUserId)
      const ticket = await createRandomTicket(project_id, pmUserId)

      // Act
      const res = await contributor
        .get(`/projects/${project_id}`)
        .expect(200)

      // Assert
      const project = res.body.project
      expect(project.id).toBe(project_id)
      expect(project.description).toBe(description)
      expect(project.owner_id).toBe(pmUserId)
      expect(project.comments.length).toBe(1)
      expect(project.tickets.length).toBe(1)

      const commentResult = project.comments[0]
      expect(commentResult.id).toBe(projectComment.id)
      expect(commentResult.description).toBe(projectComment.description)
      expect(commentResult.owner_id).toBe(projectComment.owner_id)
      expect(commentResult.project_id).toBe(projectComment.project_id)

      const ticketResult = project.tickets[0]
      expect(ticketResult.id).toBe(ticket.id)
      expect(ticketResult.description).toBe(ticket.description)
      expect(ticketResult.owner_id).toBe(ticket.owner_id)
      expect(ticketResult.project_id).toBe(ticket.project_id)
    })

    it('should 404 when the project is not found', async () => {
      await contributor
        .get('/projects/000000000000000000000000000000')
        .expect(404)
    })
  })

  describe('PUT /projects/:projectId', () => {
    it('should 200 when pms update a project', async () => {
      // arrange
      const { id: project_id } = await createProject(pmUserId)
      const newName = faker.company.name()
      const newDescription = faker.company.bs()

      await pm
        .put(`projects/${project_id}`)
        .send({ name: newName, description: newDescription })
        .expect(200)
        .expect(res => {
          expect(res.body.project.name).toBe(newName)
          expect(res.body.project.description).toBe(newDescription)
        })
    })
    it('should 401 when unauthorized users try to change project details')
    it('should 404 when the project is not found')
  })

  describe('DELETE /projects/:projectId', () => {
    it('should 200 when an authorized user deletes a project')
    it('should 401 when unauthorized users try to delete the project')
    it('should 404 when the project is not found')
  })
})