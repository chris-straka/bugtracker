# Learning from Bug Tracker

## 1. The problem

Jira, Linear and GitHub Issues are multi-user systems where people only see the
projects they belong to and act according to their role. Underneath any of them
sits the same core: authenticated users, role and membership checks on every
request, paginated lists, and writes that touch several tables at once.

This repo is a small, complete version of that core. It is a layered Express 5
REST API over Postgres (raw SQL, no ORM) and Redis, with a Lit single-page app on
top. Two parts go beyond a tutorial CRUD app. Every protected route accepts
**both** a browser cookie session and a JWT, and the JWT refresh tokens are
**single-use with reuse detection**. Both mechanisms are worth understanding in
depth.

## 2. Concepts you need

**Layered architecture.** A request flows `routes → middleware → controllers →
services → repositories → pg`. Routes only wire validators and guards
(`app/src/routes/project/projects.ts:17`). Controllers translate HTTP to service
calls. Services hold the rules. Repositories hold the SQL. All the instances are
built in one place, the composition root `app/src/services/index.ts:25`, which is
why services take their repositories as constructor arguments.

**Dual-transport authentication.** `isAuthenticated`
(`app/src/middleware/isAuthenticated.ts:16`) accepts a Redis-backed
`express-session` cookie *or* an `Authorization: Bearer` JWT, and records the
latter on `req.auth`. Everything downstream reads identity through one helper,
`getRequestAuth` (`app/src/utility/requestAuth.ts:16`), so no guard needs to
know which transport was used.

**Rotating refresh tokens with reuse detection.** `POST /tokens` issues a
15-minute access JWT and a 30-day refresh JWT that carries a random `jti`. The
`jti` is stored, hashed, in a Redis allowlist (`app/src/repositories/token.ts:38`).
`rotate` (`app/src/services/token.ts:66`) *consumes* the id atomically
(`MULTI DEL + SREM`, `token.ts:51`) before issuing a new pair. If someone
presents a token whose id is already gone, it has been used before, which means
either a bug or theft. The server then revokes every refresh token for that user.

**Single-flight refresh on the client.** Single-use tokens put a burden on the
client: two parallel requests that both get a 401 must not both spend the same
refresh token. `ApiClient.refreshPair` (`frontend/src/api/client.ts:79`) shares
one in-flight rotation, and `request` retries without rotating when the token
changed while the request was in flight (`client.ts:110`). The controller
persists every rotated token (`frontend/src/state/auth-controller.ts:48`).

**Authorization as composable middleware.** `isActive` re-reads account status
from Postgres on every request, so disabling a user takes effect immediately even
for unexpired JWTs (`app/src/middleware/isActive.ts:7`). `isAuthorized([...roles])`
is a middleware factory (`app/src/middleware/isAuthorized.ts:6`). Membership
guards such as `isProjectMemberOrAdmin` run after both.

**Typed SQL without an ORM.** `queryMany` / `queryOne` / `queryExists` /
`execute` (`app/src/db/query.ts:18`) wrap `pg` with declared row types. Queries
are *named*, so Postgres prepares each statement once per connection. Writes
that span several statements go through `withTransaction`
(`app/src/db/transaction.ts:12`), for example creating a ticket together with its
assignees (`app/src/repositories/tickets/ticket.ts:89`).

**Keyset (cursor) pagination.** Lists use `WHERE id > $cursor ORDER BY id LIMIT
$limit` (`app/src/repositories/tickets/ticket.ts:192`), and the service returns the
last id as `nextCursor` (`app/src/services/admin/tickets.ts:10`). Unlike `OFFSET`,
the cost doesn't grow with the page number, and rows inserted mid-scroll don't
shift later pages. `MAX_PAGE_SIZE` (`app/src/validators/index.ts:4`) bounds the
page size.

**Errors as types.** Every expected failure is an `AppError` subclass that carries
its HTTP status (`app/src/errors/index.ts:1`). The one error handler
(`app/src/middleware/errorHandler.ts:4`) maps those to responses and sends a
plain 500 for anything else. Express 5 forwards rejected promises to it
automatically.

**Contract test for the API docs.** `docs/openapi.yaml` is written by hand, so it
can drift from the code. `openapi.test.ts` walks Express's router stack
(`app/src/__test__/docs/openapi.test.ts:20`) and compares the routes it finds
with the spec in both directions. The spec is also served at `/openapi.json`
and `/docs` (`app/src/config/swagger.ts`).

**Forward-only migrations.** `pnpm db:migrate` applies `migrations/NNN_*.sql` in
order, each file in its own transaction, and records them in `schema_migrations`
(`app/src/db/migrate.ts:60`). A database created from the baseline
`bugtracker.sql` gets stamped as migrated instead of being re-run.

## 3. Reading order

1. `app/src/index.ts` and `app/src/config/server.ts`: how the app is assembled.
2. `app/src/routes/index.ts`, then one router: `app/src/routes/project/projects.ts`.
3. `app/src/middleware/isAuthenticated.ts`, `isActive.ts`, `isAuthorized.ts`, and
   `app/src/utility/requestAuth.ts`.
4. `app/src/controllers/project/*`, then `app/src/services/project/project.ts`.
5. `app/src/db/query.ts`, `app/src/db/transaction.ts`, then
   `app/src/repositories/tickets/ticket.ts`.
6. Auth: `app/src/utility/jwt.ts` → `app/src/services/token.ts` →
   `app/src/repositories/token.ts` → `app/src/__test__/routes/auth/tokens.test.ts`.
7. `app/src/errors/index.ts` and `app/src/middleware/errorHandler.ts`.
8. Tests: `app/src/__test__/_setup/globalSetup.ts`,
   `app/src/__test__/helper/pagination.ts`, `app/src/__test__/docs/openapi.test.ts`.
9. Client: `frontend/src/api/client.ts` → `frontend/src/state/auth-controller.ts`
   → `frontend/src/components/bt-app.ts`.
10. `app/scripts/bench.ts`: how the Results numbers are produced.

## 4. Exercises

Set up first: `make install && make up` (or your own Postgres + Redis in
`app/.env`), then confirm `make test` is green.

1. **Break the docs contract.** Add `router.get('/ping', (_, res) => res.send('ok'))`
   in `app/src/routes/index.ts`. Predict which test fails and what it prints.
   <details><summary>Answer</summary>`documents every route the app serves` fails
   with `["GET /ping"]` in the diff. Add a `/ping` entry to `docs/openapi.yaml`
   (or remove the route) to fix it.</details>

2. **Page-size cap.** Request `GET /me/assigned-tickets?limit=101` and then
   `?limit=100`. What status codes do you get, and where is that decided?
   <details><summary>Answer</summary>400 then 200. The `isInt({ max: MAX_PAGE_SIZE })`
   validator rejects the first, and `validateInput` turns the validator errors into
   a 400 before the controller runs.</details>

3. **Refresh-token reuse.** With `curl`, `POST /tokens`, then call `POST
   /tokens/refresh` twice with the *same* refresh token. Then try the token that the
   first refresh returned. Predict all three responses.
   <details><summary>Answer</summary>The first refresh returns 200 with a new pair.
   The second returns 401: the `jti` was already consumed, so this counts as reuse,
   and `revokeAll` wipes the user's allowlist. The third also returns 401, because
   the token from the first refresh was revoked too. That is the point: after a
   leak, neither the attacker nor the victim keeps a usable token, and the victim
   has to log in again.</details>

4. **Why single-flight?** In `frontend/src/api/client.ts`, change `refreshPair` to
   call `this.#rotate()` directly. Run `pnpm test` in `frontend/`. Which tests
   fail, and what would the user experience in production?
   <details><summary>Answer</summary>`shares one rotation between concurrent 401s`
   fails, with three refresh calls instead of one. In production the dashboard's
   parallel fetches would each spend the same refresh token. The second one trips
   reuse detection and the user is logged out every 15 minutes.</details>

5. **Disable a logged-in JWT user.** Log in with `POST /tokens` and keep the
   access token. As an admin, disable that user, then call `GET /me/activity`
   with the old token. Does it work? Why might a "pure JWT" system say yes?
   <details><summary>Answer</summary>It returns 403 (`UserIsDisabledError`) because
   `isActive` checks Postgres on every request. A stateless JWT check alone would
   accept the token until it expired, up to 15 minutes later. The price is one
   indexed lookup per request.</details>

6. **Transaction rollback.** In `createTicket`'s `withTransaction` callback,
   throw after the `INSERT INTO ticket`. Create a ticket with assignees. Is a
   ticket row left behind?
   <details><summary>Answer</summary>No. `ROLLBACK` undoes the insert, and the client
   is released in `finally`. Move the insert outside `withTransaction` and you get
   an orphaned ticket with no assignees.</details>

7. **Measure the transports.** Run `make bench` twice, swapping the order of the
   two entries in `transports` in `app/scripts/bench.ts`. How much do the numbers
   move? What does that tell you about benchmarking on a shared machine?
   <details><summary>Answer</summary>On a loaded machine, single runs can differ by
   30% or more depending on order. Warm-up, alternating rounds and medians are the
   minimum for a fair comparison. Here the Redis round trip and the HMAC check cost
   about the same next to the Postgres query that both paths make.</details>

8. **(Hard) OFFSET vs keyset.** Seed 1M tickets
   (`INSERT ... SELECT generate_series(...)`). Compare `EXPLAIN ANALYZE` of
   `OFFSET 900000 LIMIT 10` against `WHERE id > 900000 ORDER BY id LIMIT 10`.
   <details><summary>Answer</summary>OFFSET scans and throws away 900k rows (tens to
   hundreds of ms). The keyset query does an index range scan on the primary key
   and finishes in well under a millisecond.</details>

## 5. Interview questions

1. **Sessions or JWTs? Why both?** Cookie sessions are easy to revoke (delete
   the Redis key) and keep secrets out of JavaScript, which suits browsers. JWTs
   suit API and mobile clients that can't rely on cookies. Here both feed one
   identity object (`getRequestAuth`), so the guards don't care which was used.

2. **How do you revoke a JWT?** You keep access tokens short-lived (15 min) and
   keep refresh tokens stateful: a Redis allowlist of hashed `jti`s. Logging out
   deletes the id. `isActive` also blocks disabled users even while their access
   token is still valid.

3. **What is refresh-token reuse detection?** Each refresh token works once. If a
   consumed token comes back, either the client is buggy or the token was stolen,
   so the server revokes the whole token family for that user. It has to consume
   atomically (`MULTI`), or two concurrent refreshes could both succeed.

4. **Why are the refresh-token ids hashed in Redis?** A dump of Redis then doesn't
   give anyone usable token ids. It is the same reasoning as hashing passwords,
   but SHA-256 is enough because the ids are random 122-bit UUIDs, not
   guessable passwords.

5. **Why keyset pagination?** The cost stays the same at any depth, and the
   pages stay stable while rows are inserted. The trade-off is that you can't
   jump to page N, and you need a unique sort key.

6. **What does `withTransaction` guarantee, and what doesn't it?** It makes one
   request's multi-statement write atomic. It doesn't stop concurrent requests
   from interleaving (that would need isolation levels or row locks). It also
   only works if every statement uses the `client` it hands you, not the pool.

7. **How do you stop API docs from drifting?** Generate the docs from the code,
   or test the docs against the code. This repo keeps a hand-written spec, which
   reads better, and a test that walks the router and fails in CI on any mismatch.

8. **Your API tests need Postgres and Redis. How do you keep them reliable?**
   `globalSetup` starts the services if needed and truncates all tables once.
   Each suite creates its own users with faker. CI uses service containers.
   Concurrent runs against one database are documented as unsupported rather
   than half-handled.

## 6. Connections

- **game-store** solves the same auth and tenancy problems in Next.js (Server
  Components, Stripe webhooks). Compare its credential-scoped tenancy with this
  repo's role and membership middleware.
- **Ledger** and **PaymentOrchestration** use the same layered
  service/repository design and transactional writes, applied to money, where
  idempotency matters even more.
- **durable** (the workflow engine) and **cdc-pipe** (outbox/inbox) are the
  next step if ticket events had to fan out reliably to email, search or
  analytics, instead of the inline nodemailer call used here.
- **tiny-search** would replace the `ILIKE '%term%'` search, which can't use a
  B-tree index, with a real inverted index.
