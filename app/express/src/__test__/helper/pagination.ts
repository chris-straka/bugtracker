import { SuperAgentTest } from 'supertest'
import { encodeBase64 } from '../../utility/base64'

export function testPaginationRoutes(
  agent: SuperAgentTest,
  endpoint: string,
  resourceName: string,
  endCursor: string
) {

  it(`should 200 and return ${resourceName}`, async () => {
    const res = await agent.get(endpoint).expect(200)

    expect(res.body).toHaveProperty(resourceName)
    expect(res.body).toHaveProperty('nextCursor')
  })

  it(`should 200 and return the number of ${resourceName} that you asked for`, async () => {
    const limit = 6
    const res = await agent.get(`${endpoint}?limit=${limit}`).expect(200)
        
    expect(res.body[resourceName].length).toBe(limit)
  })

  it(`should 200 when using the paging cursor to retrieve more ${resourceName}`, async () => {
    const first = await agent.get(endpoint)
    const nextCursor = first.body.nextCursor

    await agent
      .get(`${endpoint}?cursor=${nextCursor}`)
      .expect(200)
  })

  it(`should 200 and send the same ${resourceName} when using the same cursor`, async () => {
    const limit = 3
    const first = await agent.get(`${endpoint}?limit=${limit}`).expect(200)
    const nextCursor = first.body.nextCursor

    await agent
      .get(`${endpoint}?cursor=${nextCursor}`)
      .expect(200)
  })

  it('should 200 and return [] when nothing is left', async () => {
    const res = await agent.get(`${endpoint}?cursor=${encodeBase64(endCursor)}`)

    expect(res.status).toBe(200)
    expect(res.body[resourceName].length).toBe(0)
  })

  // limit
  it('should 400 when given a limit of 0', async () => {
    await agent.get(`${endpoint}?limit=0`).expect(400)
  })

  it('should 400 when given a negative limit', async () => {
    await agent.get(`${endpoint}?limit=-5`).expect(400)
  })

  it('should 400 when the limit value is missing', async () => {
    await agent.get(`${endpoint}?limit=`).expect(400)
  })

  // cursor
  it('should 400 when given an invalid cursor', async () => {
    await agent.get(`${endpoint}?cursor=wrong`).expect(400)
  })

  it('should 400 when given a missing cursor', async () => {
    await agent.get(`${endpoint}?cursor=`).expect(400)
  })
}