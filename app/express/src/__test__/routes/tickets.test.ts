import { faker } from '@faker-js/faker'
import { SuperAgentTest } from 'supertest'
import { closeDbConnections, createTestUser, createProject, createTicket, createTickets } from '../helper'

describe('Ticket Routes', () => {
  let admin: SuperAgentTest
  let pm: SuperAgentTest
  let dev: SuperAgentTest
  let contributor: SuperAgentTest
  let guest: SuperAgentTest

  let pmUserId: string
  let projectId: string

  beforeAll(async () => {
    ({ agent: admin } = await createTestUser('admin'));
    ({ agent: pm, id: pmUserId } = await createTestUser('project_manager'));
    ({ agent: dev } = await createTestUser('developer'));
    ({ agent: contributor } = await createTestUser('contributor'));
    ({ agent: guest } = await createTestUser('guest'))

    projectId = await createProject(pmUserId)
  })

  afterAll(async () => {
    await closeDbConnections()
  })

  describe('Tickets', () => {
    describe('GET /tickets', () => {
      const page = 1
      const limit = 12
      const numOfTickets = 15

      it('should 200 and return tickets with correct pagination', async () => {
        await createTickets(numOfTickets, projectId, pmUserId) 

        const response = await dev.get(`/tickets?page=${page}&limit=${limit}`)

        expect(response.status).toBe(200)
        expect(response.body.pagination.page).toBe(page)
        expect(response.body.pagination.limit).toBe(limit)
        expect(response.body.projects.length).toBeGreaterThanOrEqual(numOfTickets)
      })

      it('should 400 when the page or offset is incorrect', async () => {
        await contributor
          .get('/tickets?page=-1&limit=5')
          .expect(400)

        await contributor
          .get('/tickets?page=1&limit=-5')
          .expect(400)
      })

      it('should 404 when the the page does not exist', async () => {
        await contributor
          .get('/tickets?page=10000000000000000000&limit=5')
          .expect(404)
      })
    })

    describe('GET /tickets/:ticketId', () => {
      it('should 200 when fetching the details for a ticket', async () => {
        const ticket = await createTicket(pmUserId, pmUserId)

        const res = await contributor
          .get(`/tickets/${ticket.id}`)
          .expect(200)

        expect(res.body.ticket).toMatchObject({
          id: ticket.id,
          projectId,
          ownerId: pmUserId,
          name: ticket.name,
          description: ticket.description,
          comments: expect.any(Array),
          tickets: expect.any(Array)
        })
      })

      it('should 404 when the ticket is not found', async () => {
        await contributor
          .get('/tickets/000000000000000000000000000000')
          .expect(404)
      })
    })

    describe('POST /tickets', () => {
      it('should 201 when an authorized user creates a new ticket', async () => {
        await dev
          .post('/tickets')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(201)
      })

      it('should 401 when an unauthorized user tries to create a ticket', async () => {
        await guest
          .post('/tickets')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(401)
      })

      it('should 409 when the ticket already exists', async () => {
        const name = faker.company.name()
        const description = faker.company.bs()

        await pm
          .post('/tickets')
          .send({ name, description })
      
        await pm
          .post('/tickets')
          .send({ name, description })
          .expect(409)
      })

      it('should 400 when there is no ticket name specified', async () => {
        await pm
          .post('/tickets')
          .send({ description: faker.company.bs() })
          .expect(400)
      })
    })

    describe('PUT /tickets/:ticketId', () => {
      let ticketId: string

      beforeAll(async () => {
        ({ ticketId } = await createTicket(projectId, pmUserId))
      })

      it('should 200 when an authorized pm assigns a dev to a ticket', async () => {
        const name = faker.company.name()
        const description = faker.company.bs()

        const res = await pm
          .put(`tickets/${ticketId}`)
          .send({ status: 'urgent' })

        expect(res.statusCode).toBe(200)
        expect(res.body.ticket.name).toBe(name)
        expect(res.body.ticket.description).toBe(description)
      })

      it('should 401 when unauthorized users try to assign a dev to a ticket', async () => {
        await guest
          .put(`tickets/${ticketId}`)
          .send({ status: 'urgent' })
          .expect(401)
      })

      it('should 404 when the tickets is not found', async () => {
        await pm
          .put('tickets/00000000000000000000000000')
          .send({ name: faker.company.name(), description: faker.company.bs() })
          .expect(404)
      })
    })

    describe('DELETE /tickets/:ticketId/users/:userId', () => {
      it('should 200 when removing a dev from a ticket', async () => {
        pm
      })
    })
  })

  describe('Ticket Comments', () => {

  })
})
