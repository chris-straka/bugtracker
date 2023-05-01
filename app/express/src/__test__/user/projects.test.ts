import { SuperAgentTest } from 'supertest'
import { createPmAndProjects, testPaginationRoutes } from '../helper'

let agent: SuperAgentTest
let lastTicketId: string

beforeAll(async () => {
  const { pm, projects } = await createPmAndProjects(20)
  agent = pm.agent
  lastTicketId = projects[projects.length - 1].id
})

describe('Project Manager Routes for looking at the projects they created', () => {
  describe('GET /users/me/projects', () => {
    testPaginationRoutes(agent, '/users/me/projects', 'projects', lastTicketId) 
  })
})