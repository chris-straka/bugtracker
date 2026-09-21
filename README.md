# Bug Tracker

Full-stack bug-tracking app: the **Express 5 + TypeScript REST API** in
[`app/`](app/) plus the **Lit single-page app** in [`frontend/`](frontend/)
(the root Makefile's `frontend/`/`backend/` targets are stale).

## Layout

- [`app/`](app/) — the API. See [`app/README.md`](app/README.md) for setup.
  - `src/routes` → `src/middleware` → `src/controllers` → `src/services` →
    `src/repositories` → Postgres (`pg`, no ORM; baseline schema in
    `app/bugtracker.sql`, forward migrations in `app/migrations/` via
    `pnpm db:migrate`, typed helpers in `app/src/db/`)
  - Session auth backed by Redis (`express-session` + `connect-redis`),
    plus JWT access + rotating refresh tokens (`POST /tokens*`) for API/mobile
    clients; every protected route accepts either transport
- [`frontend/`](frontend/) — the Lit SPA. See
  [`frontend/README.md`](frontend/README.md) for setup.
  - Route areas: `admin`, `auth` (signup/signin/password + email reset), `me`,
    `project` (projects, members, comments), `ticket` (tickets, assignees,
    comments)
  - Security/logging/compression via `helmet` / `morgan` / `compression`,
    wired in `app/src/config/server.ts`
  - Tests: Jest via `ts-jest` + `supertest` (`app/src/__test__`); docs in
    `app/docs/`; requests scratchpad in `app/postman.http`
  - Deploys: `app/Dockerfile`, `app/docker-compose.yaml` (api, postgres,
    redis, pgadmin), K8s manifests in `app/k8s/` (api, frontend, postgres,
    redis)
- [`LICENSE`](LICENSE) — license.

## Workflow

There are different types of users in this app.

A project manager creates a project and then adds users to that project.
Those users can then create and edit tickets and comments.

1. User signup/login
2. User creates a project if they're a PM, or they get invited to join an existing project.
3. User creates tickets in their assigned projects
4. User (dev) closes tickets when they're done working on them.

## Quickstart

Requires Node >= 22 and pnpm (see `app/package.json` `packageManager`).

```sh
cd app
pnpm install
pnpm ddev   # api + postgres + redis; add pgadmin with `pnpm pgadmin` (port 8080)
pnpm test
```
