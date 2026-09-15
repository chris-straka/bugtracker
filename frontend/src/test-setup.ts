/** Jest setup: the jsdom env has no fetch `Response`, so tests stub it here. */

class TestResponse {
  status: number
  headers: Record<string, string>
  #body: string

  constructor(body: string | null, init: { status?: number; headers?: Record<string, string> } = {}) {
    this.#body = body ?? ''
    this.status = init.status ?? 200
    this.headers = init.headers ?? {}
  }

  get ok(): boolean {
    return this.status >= 200 && this.status < 300
  }

  async text(): Promise<string> {
    return this.#body
  }

  async json(): Promise<unknown> {
    return JSON.parse(this.#body)
  }
}

if (typeof (globalThis as Record<string, unknown>).Response === 'undefined') {
  ;(globalThis as Record<string, unknown>).Response = TestResponse
}
