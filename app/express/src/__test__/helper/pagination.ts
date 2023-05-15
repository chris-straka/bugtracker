import { SuperAgentTest } from 'supertest'

export function testPaginationRoutes(
  agent: SuperAgentTest,
  endpoint: string,
  resource: string,
  baseQuery: Record<string, string> = {}, 
) {
  async function searchWithQuery(query: Record<string, string> = {}, statusCode = 200) {
    return await agent.get(endpoint).query(query).expect(statusCode)
  }

  it(`should 200 and return a list of ${resource} with the nextCursor`, async () => {
    const res = await searchWithQuery(baseQuery)

    expect(res.body).toHaveProperty(resource)
    expect(res.body).toHaveProperty('nextCursor')
  })

  it(`should 200 and return the number of ${resource} that you asked for`, async () => {
    const res = await searchWithQuery({ ...baseQuery, limit: '6' })
    expect(res.body[resource].length).toBe(6)
  })

  it(`should 200 when using the cursor to grab more ${resource}`, async () => {
    const first = await searchWithQuery(baseQuery)
    await searchWithQuery({ ...baseQuery, cursor: first.body.nextCursor })
  })

  it(`should 200 and retrieve the same ${resource} when using the same cursor`, async () => {
    const first = await searchWithQuery(baseQuery)
    const second = await searchWithQuery({ ...baseQuery, cursor: first.body.nextCursor })
    const secondAgain = await searchWithQuery({ ...baseQuery, cursor: first.body.nextCursor })

    expect(second.body[resource]).toEqual(secondAgain.body[resource])
  })

  // limit
  it('should 400 when given a limit of 0', async () => {
    await searchWithQuery({ ...baseQuery, limit: '0' }, 400)
  })

  it('should 400 when given a negative limit', async () => {
    await searchWithQuery({ ...baseQuery, limit: '-1' }, 400)
  })

  it('should 400 when the limit is specified but missing a value', async () => {
    await searchWithQuery({ ...baseQuery, limit: '' }, 400)
  })

  // cursor
  it('should 400 when given an invalid cursor', async () => {
    await searchWithQuery({ ...baseQuery, cursor: 'wrong' }, 400)
  })

  it('should 400 when given a missing cursor', async () => {
    await searchWithQuery({ ...baseQuery, cursor: '' }, 400)
  })
}
