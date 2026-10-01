import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ApiClient, ApiError } from '../api/client'
import type { AuthMode, User } from '../api/types'

const STORAGE_KEY = 'bt.auth'

interface StoredAuth {
  user: User
  mode: AuthMode
  accessToken: string | null
  refreshToken: string | null
}

export interface LoginInput {
  email: string
  password: string
}

/**
 * Session + JWT identity for the SPA, as a Lit ReactiveController.
 *
 * Hosts add it in their constructor (`new AuthController(this, client)`) and
 * re-render automatically whenever `user`, `mode`, `busy` or `error` changes.
 * Only the JWT refresh token is kept in storage, so a reload can restore a JWT
 * login. Cookie sessions are restored with an authenticated probe.
 */
export class AuthController implements ReactiveController {
  host: ReactiveControllerHost
  client: ApiClient
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

  user: User | null = null
  mode: AuthMode = 'session'
  busy = false
  error: string | null = null

  constructor(
    host: ReactiveControllerHost,
    client: ApiClient,
    storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null = null,
  ) {
    this.host = host
    this.client = client
    this.storage =
      storage ?? (typeof localStorage !== 'undefined' ? localStorage : nullStorage)
    host.addController(this)
  }

  get isLoggedIn(): boolean {
    return this.user !== null
  }

  hostConnected(): void {
    void this.restore()
  }

  async signup(username: string, email: string, password: string): Promise<void> {
    await this.run(async () => {
      const res = await this.client.post<{ user: User }>('/users', { username, email, password })
      this.setSession(res.user)
    })
  }

  async login(input: LoginInput, mode: AuthMode = 'session'): Promise<void> {
    if (mode === 'jwt') {
      await this.run(async () => {
        const res = await this.client.post<{
          user: User
          accessToken: string
          refreshToken: string
        }>('/tokens', input)
        this.client.setTokens(res.accessToken, res.refreshToken)
        this.setStored({ user: res.user, mode, accessToken: res.accessToken, refreshToken: res.refreshToken })
      })
    } else {
      await this.run(async () => {
        const res = await this.client.post<{ user: User }>('/sessions', input)
        this.setSession(res.user)
      })
    }
  }

  async logout(): Promise<void> {
    await this.run(async () => {
      if (this.mode === 'jwt' && this.client.refreshToken) {
        try {
          await this.client.delete('/tokens', { refreshToken: this.client.refreshToken })
        } catch {
          // Best effort: the token may already be expired or revoked.
        }
      } else if (this.mode === 'session') {
        try {
          await this.client.delete('/sessions')
        } catch {
          // Best effort: the cookie may already be gone.
        }
      }
      this.client.clearTokens()
      this.storage.removeItem(STORAGE_KEY)
      this.user = null
    })
  }

  /** Re-establishes identity after a reload. Returns true when logged in. */
  async restore(): Promise<boolean> {
    const stored = this.readStored()
    if (!stored) return false

    this.busy = true
    this.host.requestUpdate()
    try {
      if (stored.mode === 'jwt' && stored.refreshToken) {
        this.client.setTokens(stored.accessToken ?? '', stored.refreshToken)
        // Drop the stale access token; a single rotation proves the login.
        this.client.accessToken = null
        if (await this.client.refreshPair()) {
          this.user = stored.user
          this.mode = 'jwt'
          this.persist()
          return true
        }
      } else {
        // Cookie session: a cheap authenticated probe validates it.
        await this.client.get('/me/activity')
        this.user = stored.user
        this.mode = 'session'
        return true
      }
    } catch {
      // Fall through to logged-out below.
    } finally {
      this.busy = false
    }

    this.client.clearTokens()
    this.storage.removeItem(STORAGE_KEY)
    this.user = null
    this.host.requestUpdate()
    return false
  }

  private setSession(user: User): void {
    this.client.clearTokens()
    this.setStored({ user, mode: 'session', accessToken: null, refreshToken: null })
  }

  private setStored(stored: StoredAuth): void {
    this.user = stored.user
    this.mode = stored.mode
    this.error = null
    this.persist()
  }

  private persist(): void {
    if (!this.user) return
    const stored: StoredAuth = {
      user: this.user,
      mode: this.mode,
      accessToken: this.client.accessToken,
      refreshToken: this.client.refreshToken,
    }
    this.storage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }

  private readStored(): StoredAuth | null {
    try {
      const raw = this.storage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as StoredAuth
    } catch {
      return null
    }
  }

  private async run(fn: () => Promise<void>): Promise<void> {
    this.busy = true
    this.error = null
    this.host.requestUpdate()
    try {
      await fn()
    } catch (e) {
      this.error = e instanceof ApiError ? e.body || `Error ${e.status}` : 'Something went wrong'
      throw e
    } finally {
      this.busy = false
      this.host.requestUpdate()
    }
  }
}

const nullStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}
