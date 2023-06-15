import { faker } from '@faker-js/faker'
import type { TestProject, TestUser, } from '../../helper'
import { 
  createTestUser, createPmAndProjects, 
  createPmAndProject, closeDbConnections, 
  createNewUserAndAddThemToProject
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Project Manager Project Routes', () => {
  let pm: TestUser

  beforeAll(async () => {
    ({ pm } = await createPmAndProjects(20))
  })

  describe('POST /projects', () => {
    it('should 201 when a pm creates a project', async () => {
      const name = faker.company.name(20)
      const description = faker.random.words(50)

      const res = await pm.agent
        .post('/projects')
        .send({ name,  description })
        .expect(201)

      expect(res.body.project.name).toBe(name)
      expect(res.body.project.description).toBe(description)
    })

    it('should 400 when something is missing', async () => {
      await pm.agent
        .post('/projects')
        .send({})
        .expect(400)
    })

    it('should 403 when a dev creates a project', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .post('/projects')
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(403)
    })

    it('should 409 when the project name already exists', async () => {
      const { project } = await createPmAndProject()
      
      await pm.agent
        .post('/projects')
        .send({ name: project.name, description: project.description })
        .expect(409)
    })
  })

  describe('PUT /projects/:projectId', () => {
    let pm: TestUser
    let project: TestProject

    beforeAll(async () => {
      ({ pm, project } = await createPmAndProject())
    })

    it('should 200 when a pm tries to change their own project', async () => {
      const name = faker.company.name()
      const description = faker.company.bs()

      const res = await pm.agent
        .put(`projects/${project.id}`)
        .send({ name, description })
        .expect(200)

      expect(res.body.project.name).toBe(name)
      expect(res.body.project.description).toBe(description)
    })

    it('should 200 when admin changes a project', async () => {
      const admin = await createTestUser('admin')
      const name = faker.company.name()
      const description = faker.company.bs()

      const res = await admin.agent
        .put(`admin/projects/${project.id}`)
        .send({ name, description })
        .expect(200)

      expect(res.body.project.name).toBe(name)
      expect(res.body.project.description).toBe(description)
    })

    it('should 401 when a project dev changes project details', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .put(`/projects/${project.id}`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(401)
    })

    it('should 403 when a pm changes a project they do not own', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .put(`/projects/${project.id}`)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(403)
    })
  })

  describe('DELETE /projects/:projectId', () => {
    let project: TestProject

    beforeEach(async () => {
      ({ project } = await createPmAndProject())
    })

    it('should 204 when the project owner deletes their own project', async () => {
      await pm.agent
        .delete(`/projects/${project.id}`)
        .expect(204)
    })

    it('should 204 when an admin deletes a project', async () => {
      const admin = await createTestUser('admin')
      
      await admin.agent
        .delete(`/projects/${project.id}`)
        .expect(204)
    })

    it('should 403 when a pm who is assigned to the project tries to delete a project', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id, 'project_manager') 

      await otherPm.agent
        .delete(`/projects/${project.id}`)
        .expect(403)
    })

    it('should 403 when a pm who is not assigned to the project tries to delete it', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(`/projects/${project.id}`)
        .expect(403)
    })
  })

  it('should 404 when the project is not found', async () => {
    const dev = await createTestUser('project_manager')

    await dev.agent
      .put('projects/0')
      .send({ name: faker.company.name(), description: faker.company.bs() })
      .expect(404)
  })
})