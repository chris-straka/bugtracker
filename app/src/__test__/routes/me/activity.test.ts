import { faker } from '@faker-js/faker'
import type { TestUser, TestProject, TestTicket } from '../../helper'
import { createPmAndProjects, createTicket, addUserToTickets, closeDbConnections } from '../../helper'

afterAll(async () => {
  await closeDbConnections()
})

describe('User route for checking recent history and statistics', () => {
  let pm: TestUser
  let projects: TestProject[]
  let tickets: TestTicket[]

  beforeAll(async () => {
    ;({ pm, projects } = await createPmAndProjects(2))
    tickets = [
      await createTicket(
        projects[0].id.toString(),
        pm.id.toString(),
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        'critical',
        'bug',
        'open',
      ),
      await createTicket(
        projects[1].id.toString(),
        pm.id.toString(),
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        'low',
        'task',
        'additional_info_required',
      ),
    ]
    // Activity statistics count tickets assigned to the user.
    await addUserToTickets(pm.id.toString(), tickets)
  })

  describe('GET /me/activity', () => {
    it('should 200 and return the correct ticket statistics', async () => {
      const res = await pm.agent.get('/me/activity')
      const firstProjectName = projects[0].name
      const secondProjectName = projects[1].name

      expect(res).toMatchObject({
        status: 200,
        body: {
          priority: {
            none: 0,
            low: 1,
            medium: 0,
            high: 0,
            critical: 1,
          },
          type: {
            bug: 1,
            featureRequest: 0,
            task: 1,
            documentation: 0,
            improvement: 0,
            question: 0,
          },
          status: {
            open: 1,
            inProgress: 0,
            closed: 0,
            additionalInfoRequired: 1,
          },
          project: {
            [firstProjectName]: 1,
            [secondProjectName]: 1,
          },
        },
      })
    })
  })
})
