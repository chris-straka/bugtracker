import type { ReactiveControllerHost } from 'lit'
import { ApiClient } from '../api/client'
import type { User } from '../api/types'
import { AuthController } from './auth-controller'

const USER: User = { id: 1, username: 'ada', email: 'ada@example.com', role: 'developer' }

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial))
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  }
}

function testHost(): ReactiveControllerHost & { updates: number } {
  const host = {
    updates: 0,
    addController: () => {},
    requestUpdate: () => {
      host.updates += 1
    },
    updateComplete: Promise.resolve(true),
  }
  return host as unknown as ReactiveControllerHost & { updates: number }
}

function stubClient() {
  const client = new ApiClient()
  return {
    client,
    post: jest.spyOn(client, 'post'),
    get: jest.spyOn(client, 'get'),
    delete: jest.spyOn(client, 'delete'),
    refreshPair: jest.spyOn(client, 'refreshPair'),
  }
}

describe('AuthController', () => {
  it('logs in with a cookie session', async () => {
    const host = testHost()
    const storage = memoryStorage()
    const { client, post } = stubClient()
    post.mockResolvedValueOnce({ user: USER })
    const auth = new AuthController(host, client, storage)

    await auth.login({ email: USER.email, password: 'secret' })

    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user).toEqual(USER)
    expect(auth.mode).toBe('session')
    expect(client.hasJwt).toBe(false)
    expect(JSON.parse(storage.getItem('bt.auth') as string).mode).toBe('session')
  })

  it('logs in with a JWT pair', async () => {
    const host = testHost()
    const storage = memoryStorage()
    const { client, post } = stubClient()
    post.mockResolvedValueOnce({ user: USER, accessToken: 'a', refreshToken: 'r' })
    const auth = new AuthController(host, client, storage)

    await auth.login({ email: USER.email, password: 'secret' }, 'jwt')

    expect(auth.isLoggedIn).toBe(true)
    expect(auth.mode).toBe('jwt')
    expect(client.accessToken).toBe('a')
    expect(client.refreshToken).toBe('r')
  })

  it('signs up (cookie session) and surfaces server errors', async () => {
    const host = testHost()
    const { client, post } = stubClient()
    const auth = new AuthController(host, client, memoryStorage())

    post.mockResolvedValueOnce({ user: USER })
    await auth.signup('ada', USER.email, 'secret')
    expect(auth.user).toEqual(USER)

    post.mockRejectedValueOnce(Object.assign(new Error('User already exists'), { status: 409 }))
    await expect(auth.signup('ada', USER.email, 'secret')).rejects.toThrow()
    expect(auth.error).toBeTruthy()
  })

  it('restores a JWT login by rotating the stored refresh token', async () => {
    const host = testHost()
    const storage = memoryStorage({
      'bt.auth': JSON.stringify({ user: USER, mode: 'jwt', accessToken: 'stale', refreshToken: 'r' }),
    })
    const { client, refreshPair } = stubClient()
    refreshPair.mockResolvedValueOnce(true)
    const auth = new AuthController(host, client, storage)

    await expect(auth.restore()).resolves.toBe(true)
    expect(auth.user).toEqual(USER)
    expect(refreshPair).toHaveBeenCalled()
  })

  it('restores a cookie session with a probe and drops dead logins', async () => {
    const host = testHost()
    const storage = memoryStorage({
      'bt.auth': JSON.stringify({ user: USER, mode: 'session', accessToken: null, refreshToken: null }),
    })
    const { client, get } = stubClient()
    const auth = new AuthController(host, client, storage)

    get.mockResolvedValueOnce([])
    await expect(auth.restore()).resolves.toBe(true)
    expect(auth.user).toEqual(USER)

    get.mockRejectedValueOnce(new Error('gone'))
    await expect(auth.restore()).resolves.toBe(false)
    expect(auth.user).toBeNull()
    expect(storage.getItem('bt.auth')).toBeNull()
  })

  it('logs out of a JWT login by revoking the refresh token', async () => {
    const host = testHost()
    const storage = memoryStorage()
    const { client, post } = stubClient()
    post.mockResolvedValueOnce({ user: USER, accessToken: 'a', refreshToken: 'r' })
    const auth = new AuthController(host, client, storage)
    await auth.login({ email: USER.email, password: 'secret' }, 'jwt')

    const del = jest.spyOn(client, 'delete').mockResolvedValueOnce(undefined)
    await auth.logout()

    expect(del).toHaveBeenCalledWith('/tokens', { refreshToken: 'r' })
    expect(auth.isLoggedIn).toBe(false)
    expect(storage.getItem('bt.auth')).toBeNull()
  })

  it('notifies the host on state changes', async () => {
    const host = testHost()
    const { client, post } = stubClient()
    post.mockResolvedValueOnce({ user: USER })
    const auth = new AuthController(host, client, memoryStorage())

    const before = host.updates
    await auth.login({ email: USER.email, password: 'secret' })
    expect(host.updates).toBeGreaterThan(before)
  })
})
