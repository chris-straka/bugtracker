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

  it('shares one rotation between concurrent 401s', async () => {
    // Both requests 401 on the stale token; spending the single-use refresh
    // token twice would trip the API's reuse detection and revoke the login.
    const onTokensRotated = jest.fn()
    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (url === '/tokens/refresh') return jsonResponse({ accessToken: 'new-a', refreshToken: 'new-r' })
      const auth = (init.headers as Record<string, string>).Authorization
      return auth === 'Bearer new-a' ? jsonResponse({ url }) : new Response('nope', { status: 401 })
    })
    const client = new ApiClient({ onTokensRotated })
    client.setTokens('old-a', 'old-r')

    const results = await Promise.all([client.get('/a'), client.get('/b'), client.get('/c')])

    expect(results).toEqual([{ url: '/a' }, { url: '/b' }, { url: '/c' }])
    expect(fetchMock.mock.calls.filter(([url]) => url === '/tokens/refresh')).toHaveLength(1)
    expect(onTokensRotated).toHaveBeenCalledTimes(1)
  })

  it('retries without rotating when another request already rotated', async () => {
    const client = new ApiClient()
    client.setTokens('old-a', 'old-r')
    fetchMock
      .mockImplementationOnce(async () => {
        client.setTokens('new-a', 'new-r') // a concurrent rotation finished meanwhile
        return new Response('nope', { status: 401 })
      })
      .mockResolvedValueOnce(jsonResponse({ ok: true }))

    await expect(client.get('/me/activity')).resolves.toEqual({ ok: true })
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(['/me/activity', '/me/activity'])
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
