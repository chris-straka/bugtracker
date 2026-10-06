/**
 * HTTP load test for the two auth transports on the same authenticated read.
 *
 *   pnpm bench            # needs the Postgres + Redis from .env (pnpm dddev)
 *
 * Starts the app in-process on an ephemeral port, signs up a throwaway user,
 * logs in once via the Redis cookie session (POST /sessions) and once via JWT
 * (POST /tokens), then drives GET /me/assigned-tickets with autocannon using
 * each credential. The cookie path costs a Redis round trip per request; the
 * Bearer path verifies an HMAC signature instead. Both then hit Postgres.
 */
import 'dotenv/config'
import type { AddressInfo } from 'node:net'
import autocannon from 'autocannon'
import app from '../src/config/server'
import { closeDbConnections } from '../src/__test__/helper/db'

const CONNECTIONS = Number(process.env.BENCH_CONNECTIONS ?? 50)
const DURATION = Number(process.env.BENCH_SECONDS ?? 10)
const ROUNDS = Number(process.env.BENCH_ROUNDS ?? 3)
const PATH = '/me/assigned-tickets'

async function main() {
  const server = app.listen(0)
  await new Promise((r) => server.once('listening', r))
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`

  const email = `bench-${Date.now()}@example.com`
  const password = 'bench-password'
  const json = { 'content-type': 'application/json' }
  const signup = await fetch(`${base}/users`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ username: `bench${Date.now()}`, email, password }),
  })
  if (signup.status !== 201) throw new Error(`signup failed: ${signup.status} ${await signup.text()}`)

  const login = await fetch(`${base}/sessions`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ email, password }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0]
  if (!cookie) throw new Error(`session login failed: ${login.status}`)

  const tokens = await fetch(`${base}/tokens`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ email, password }),
  })
  const { accessToken } = (await tokens.json()) as { accessToken: string }

  const results: Record<string, { rps: number; p50: number; p99: number }[]> = {}
  const run = async (label: string, headers: Record<string, string>) => {
    const r = await autocannon({ url: base + PATH, connections: CONNECTIONS, duration: DURATION, headers })
    if (r.non2xx) throw new Error(`${label}: ${r.non2xx} non-2xx responses`)
    ;(results[label] ??= []).push({ rps: r.requests.average, p50: r.latency.p50, p99: r.latency.p99 })
  }
  const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)]

  const transports: [string, Record<string, string>][] = [
    ['bearer jwt', { authorization: `Bearer ${accessToken}` }],
    ['cookie+redis', { cookie }],
  ]
  console.log(
    `GET ${PATH}, ${CONNECTIONS} connections, ${ROUNDS} alternating rounds of ${DURATION}s, medians:`,
  )
  for (const [, headers] of transports) {
    await autocannon({ url: base + PATH, connections: CONNECTIONS, duration: 2, headers }) // warm-up
  }
  for (let i = 0; i < ROUNDS; i++) {
    for (const [label, headers] of i % 2 ? [...transports].reverse() : transports) await run(label, headers)
  }
  for (const [label, rs] of Object.entries(results)) {
    console.log(
      `${label.padEnd(14)} ${Math.round(median(rs.map((r) => r.rps)))} req/s  ` +
        `p50 ${median(rs.map((r) => r.p50))} ms  p99 ${median(rs.map((r) => r.p99))} ms`,
    )
  }

  server.closeAllConnections()
  await new Promise((r) => server.close(r))
  await new Promise((r) => setTimeout(r, 500)) // let aborted handlers finish their queries
  await closeDbConnections()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
