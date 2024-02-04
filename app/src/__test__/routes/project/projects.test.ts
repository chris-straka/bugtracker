import { faker } from '@faker-js/faker'
import type { TestUser } from '../../helper'
import type { Project } from '../../../models/Project'
import { createTestUser, createPmAndProject, closeDbConnections, createNewUserAndAddThemToProject, createProject } from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('Project Manager Project Routes', () => {
  let pm: TestUser
  let pmId: string
  let project: Project
  let url: string 

  beforeAll(async () => {
    ({ pm, project } = await createPmAndProject())
    pmId = pm.id.toString()
    url = `/projects/${project.id}`
  })

  describe('POST /projects', () => {
    const url = '/projects'
    it('should 201 when a pm creates a project', async () => {
      const name = faker.company.name()
      const description = faker.random.words(50)

      const res = await pm.agent
        .post(url)
        .send({ name,  description })
        .expect(201)

      expect(res.body.project.name).toBe(name)
      expect(res.body.project.description).toBe(description)
    })

    it('should 201 when an admin creates a project', async () => {
      const admin = await createTestUser('admin')
      const name = faker.company.name()
      const description = faker.random.words(50)

      await admin.agent
        .post(url)
        .send({ name, description })
        .expect(201)
    })

    it('should 400 when something is missing', async () => {
      await pm.agent
        .post(url)
        .send({})
        .expect(400)
    })

    it('should 403 when a dev creates a project', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .post(url)
        .send({ name: faker.company.name(), description: faker.company.bs() })
        .expect(403)
    })

    it('should 409 when the project name already exists', async () => {
      const { project } = await createPmAndProject()
      
      await pm.agent
        .post(url)
        .send({ name: project.name, description: project.description })
        .expect(409)
    })
  })

  describe('PUT /projects/:projectId', () => {
    const name = faker.company.name()
    const description = faker.company.bs()

    it('should 200 when the project owner tries to change their own project', async () => {
      await pm.agent
        .put(url)
        .send({ name, description })
        .expect(200)
    })

    it('should 200 when an assigned project manager tries to change the project', async () => {
      const pm = await createNewUserAndAddThemToProject(project.id.toString(),'project_manager')

      await pm.agent
        .put(url)
        .send({ name, description })
        .expect(200)
    })

    it('should 200 when admin changes a project', async () => {
      const admin = await createTestUser('admin')

      await admin.agent
        .put(url)
        .send({ name, description })
        .expect(200)
    })

    it('should 403 when a project dev tries to change a project', async () => {
      const dev = await createTestUser('developer')

      await dev.agent
        .put(url)
        .send({ name, description })
        .expect(403)
    })

    it('should 403 when a pm changes a project they do not own', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .put(url)
        .send({ name, description })
        .expect(403)
    })

    it('should 404 when the project is not found', async () => {
      await pm.agent
        .put('/projects/0000')
        .send({ name, description })
        .expect(404)
    })
  })

  describe('DELETE /projects/:projectId', () => {
    let project: Project

    beforeEach(async () => {
      project = await createProject(pmId)
      url = `/projects/${project.id}`
    })

    it('should 204 when the project owner deletes their own project', async () => {
      await pm.agent
        .delete(url)
        .expect(204)
    })

    it('should 204 when an admin deletes a project', async () => {
      const admin = await createTestUser('admin')
      
      await admin.agent
        .delete(url)
        .expect(204)
    })

    it('should 403 when a pm who is assigned to the project tries to delete a project', async () => {
      const otherPm = await createNewUserAndAddThemToProject(project.id.toString(), 'project_manager') 

      await otherPm.agent
        .delete(url)
        .expect(403)
    })

    it('should 403 when a pm who is not assigned to the project tries to delete it', async () => {
      const otherPm = await createTestUser('project_manager')

      await otherPm.agent
        .delete(url)
        .expect(403)
    })

    it('should 404 when the project does not exist', async () => {
      const url = '/projects/0000000000000000000'

      await pm.agent
        .delete(url)
        .expect(404)
    })
  })
})
