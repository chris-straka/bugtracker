/** HTTP client for the bugtracker REST API. */

export class ApiError extends Error {
  status: number
  body: string

  constructor(status: number, body: string) {
    super(body || `Request failed with status ${status}`)
    this.status = status
    this.body = body
  }
}

export interface ApiClientOptions {
  baseUrl?: string
  /** Called when a stored JWT pair can no longer be refreshed (logged out). */
  onAuthExpired?: () => void
  /** Called after every successful refresh rotation, so callers can persist the new refresh token. */
  onTokensRotated?: () => void
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/**
 * Fetch wrapper with two auth transports:
 * - cookie sessions (`credentials: 'include'`), the default for browsers;
 * - JWT access tokens, attached as `Authorization` when set.
 *
 * On a 401 with a refresh token available, it rotates once and retries.
 * Rotation is single-flight: refresh tokens are single use and the API treats
 * a replayed one as theft (revoking every session), so concurrent 401s must
 * share one /tokens/refresh call instead of each spending the same token.
 */
export class ApiClient {
  baseUrl: string
  accessToken: string | null = null
  refreshToken: string | null = null
  onAuthExpired: () => void
  onTokensRotated: () => void
  #refreshing: Promise<boolean> | null = null

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? '').replace(/\/$/, '')
    this.onAuthExpired = options.onAuthExpired ?? (() => {})
    this.onTokensRotated = options.onTokensRotated ?? (() => {})
  }

  get hasJwt(): boolean {
    return this.accessToken !== null && this.refreshToken !== null
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path)
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body)
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body)
  }

  async delete(path: string, body?: unknown): Promise<void> {
    await this.request<unknown>('DELETE', path, body)
  }

  /** Rotates the refresh token. Concurrent callers share the in-flight rotation. */
  refreshPair(): Promise<boolean> {
    this.#refreshing ??= this.#rotate().finally(() => {
      this.#refreshing = null
    })
    return this.#refreshing
  }

  async #rotate(): Promise<boolean> {
    if (!this.refreshToken) return false
    try {
      const res = await fetch(`${this.baseUrl}/tokens/refresh`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      })
      if (!res.ok) {
        this.clearTokens()
        this.onAuthExpired()
        return false
      }
      const pair = (await res.json()) as { accessToken: string; refreshToken: string }
      this.setTokens(pair.accessToken, pair.refreshToken)
      this.onTokensRotated()
      return true
    } catch {
      return false
    }
  }

  private async request<T>(method: string, path: string, body?: unknown, retried = false): Promise<T> {
    const headers: Record<string, string> = { ...JSON_HEADERS }
    const sentToken = this.accessToken
    if (sentToken) headers['Authorization'] = `Bearer ${sentToken}`

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (res.status === 401 && this.refreshToken && !retried) {
      // Another request may already have rotated while this one was in flight.
      const rotated = this.accessToken !== sentToken || (await this.refreshPair())
      if (rotated) return this.request<T>(method, path, body, true)
    }

    if (res.status === 204) return undefined as T
    const text = await res.text()
    if (!res.ok) throw new ApiError(res.status, text)

    try {
      return JSON.parse(text) as T
    } catch {
      return text as unknown as T
    }
  }
}
