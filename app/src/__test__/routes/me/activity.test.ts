import { faker } from '@faker-js/faker'
import type { TestUser, TestProject } from '../../helper'
import { 
  createPmAndProjects, createTicket,
  closeDbConnections
} from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User route for checking recent history and statistics', () => {
  let pm: TestUser
  let projects: TestProject[]

  beforeAll(async () => {
    ({ pm, projects } = await createPmAndProjects(2))
    await createTicket(
      projects[0].id, 
      pm.id, 
      faker.lorem.sentence(), 
      faker.lorem.paragraph(), 
      'critical', 
      'bug', 
      'open'
    )

    await createTicket(
      projects[1].id, 
      pm.id,
      faker.lorem.sentence(), 
      faker.lorem.paragraph(), 
      'low', 
      'task', 
      'additional_info_required'
    )
  })

  describe('GET /me/activity', () => {
    it('should 200 and return the correct ticket statistics', async () => {
      const res = await pm.agent.get('/me/activity')
      const firstProjectName = projects[0].name
      const secondProjectName = projects[1].name
      
      expect(res).toMatchObject({
        status: 200,
        body: {
          tickets: {
            priority: {
              critical: 1,
              low: 1
            },
            type: {
              bug: 1,
              task: 1 
            },
            status: {
              open: 1,
              additionalInfoRequired: 1,
            }
          },
          projects: {
            [firstProjectName]: { numberOfTickets: 1 },
            [secondProjectName]: { numberOfTickets: 1 }
          }
        }
      })
    })
  })
})