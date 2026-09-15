import { ApiClient, ApiError } from './client'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('ApiClient', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('sends JSON with cookies included', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))
    const client = new ApiClient({ baseUrl: 'http://api' })

    await client.post('/projects', { name: 'x' })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api/projects',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ name: 'x' }),
      }),
    )
  })

  it('attaches the JWT access token when set', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    const client = new ApiClient()
    client.setTokens('a-token', 'r-token')

    await client.get('/me/activity')

    expect(fetchMock).toHaveBeenCalledWith(
      '/me/activity',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer a-token' }),
      }),
    )
  })

  it('rotates once and retries after a 401', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('nope', { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ accessToken: 'new-a', refreshToken: 'new-r' }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }))
    const client = new ApiClient()
    client.setTokens('old-a', 'old-r')

    await client.get('/me/activity')

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[1][0]).toBe('/tokens/refresh')
    expect(client.accessToken).toBe('new-a')
    expect(client.refreshToken).toBe('new-r')
  })

  it('logs out locally when rotation fails', async () => {
    const onAuthExpired = jest.fn()
    fetchMock
      .mockResolvedValueOnce(new Response('nope', { status: 401 }))
      .mockResolvedValueOnce(new Response('gone', { status: 401 }))
    const client = new ApiClient({ onAuthExpired })
    client.setTokens('old-a', 'old-r')

    await expect(client.get('/me/activity')).rejects.toBeInstanceOf(ApiError)
    expect(client.hasJwt).toBe(false)
    expect(onAuthExpired).toHaveBeenCalled()
  })

  it('throws ApiError with the status and body', async () => {
    fetchMock.mockResolvedValueOnce(new Response('bad input', { status: 400 }))
    const client = new ApiClient()

    const err = await client.get('/projects/1').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).status).toBe(400)
    expect((err as ApiError).body).toBe('bad input')
  })

  it('resolves undefined on 204', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    const client = new ApiClient()

    await expect(client.delete('/sessions')).resolves.toBeUndefined()
  })
})
