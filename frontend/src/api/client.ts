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
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/**
 * Fetch wrapper with two auth transports:
 * - cookie sessions (`credentials: 'include'`), the default for browsers;
 * - JWT access tokens, attached as `Authorization` when set.
 *
 * On a 401 with a refresh token available, it rotates once and retries.
 */
export class ApiClient {
  baseUrl: string
  accessToken: string | null = null
  refreshToken: string | null = null
  onAuthExpired: () => void

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? '').replace(/\/$/, '')
    this.onAuthExpired = options.onAuthExpired ?? (() => {})
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

  async refreshPair(): Promise<boolean> {
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
      return true
    } catch {
      return false
    }
  }

  private async request<T>(method: string, path: string, body?: unknown, retried = false): Promise<T> {
    const headers: Record<string, string> = { ...JSON_HEADERS }
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (res.status === 401 && this.refreshToken && !retried) {
      if (await this.refreshPair()) return this.request<T>(method, path, body, true)
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
