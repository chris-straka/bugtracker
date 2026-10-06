# Bug Tracker — resume bullets

- Built a multi-user issue tracker: an Express 5 / TypeScript REST API over
  Postgres (raw parameterized SQL, typed query helpers, transactional
  multi-table writes, forward migrations) and Redis, plus a Lit SPA. 350 API
  tests run against real Postgres and Redis, and 32 SPA tests run under jsdom.
- Implemented two auth transports on every route: Redis cookie sessions, and
  JWT access tokens with single-use rotating refresh tokens. A replayed refresh
  token revokes the user's whole token family. Fixed two client bugs that
  logged users out (concurrent 401s spending the same refresh token, and a
  spent token persisted across reloads) with a single-flight refresh.
- Kept a hand-written OpenAPI 3 spec (45 operations) honest with a CI contract
  test that walks the Express router and fails on any undocumented or stale
  route. The spec is served as Swagger UI at `/docs`.
- Benchmarked authenticated reads with autocannon at ~6.2-6.4k req/s, p50 5-6 ms
  (50 connections, Apple M4 Mini under shared load). The JWT and Redis-session
  transports were within noise of each other.
