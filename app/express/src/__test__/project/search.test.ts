import { faker } from '@faker-js/faker'
import { ProjectStatus } from '../../types'
import { createPmAndProject, closeDbConnections, createPmAndProjects } from '../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('GET /projects/search?term=:term&status=:status', () => {
  it('should 200 and return the correct project when searching by name', async () => {
    const { pm, projectName } = await createPmAndProject()

    const res = await pm
      .get('/projects/search')
      .query({ term: projectName })
      .expect(200)
    
    expect(res.body).toHaveProperty('projects')
    expect(res.body.projects[0].name).toBe(projectName)
  })
  it('should 200 and return the correct project when searching by description', async () => {
    const { pm, projectDescription } = await createPmAndProject()
    const searchQuery = projectDescription.split('').slice(0, 3).join('')

    const res = await pm
      .get(`/projects/search?term=${searchQuery}`)
      .query({ term: projectDescription })
      .expect(200)

    expect(res.body).toHaveProperty('projects')
    expect(res.body.projects[0].description).toBe(projectDescription)
  })
  it('should 200 and return [] when searching in the wrong status', async () => {
    const { pm, projectName } = await createPmAndProject()
    const status = 'completed' as ProjectStatus

    const res = await pm
      .get('/projects/search')
      .query({ term: projectName, status })
      .expect(200)
    
    expect(res.body).toHaveProperty('projects')
    expect(res.body.projects).toBe([])
  })
  it('should 200 and return multiple projects with pagination when appropriate', async () => {
    const description = faker.company.bs()
    const searchQuery = description.split('').slice(0, 3).join('')
    const { pm } = await createPmAndProjects(20, description)

    const res = await pm
      .get('/projects/search')
      .query({ term: searchQuery })
      .expect(200)
    
    expect(res.body).toHaveProperty('projects')
    expect(res.body.projects.length).toBeGreaterThanOrEqual(20)
  })
  it('should 200 and return the project by its owner\'s username', async () => {
    const { pm, pmUsername } = await createPmAndProject()

    const res = await pm
      .get('/projects/search')
      .query({ term: pmUsername })
      .expect(200)
    
    expect(res.body).toHaveProperty('projects')
    expect(res.body.projects[0].name).toBe(pmUsername)
  })
  it('should 400 when no query parameters are provided')
})
