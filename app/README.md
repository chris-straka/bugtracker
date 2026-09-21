# Express Backend API

Requires Node >= 22 (the Docker images and CI use Node 24 LTS) and pnpm, which
comes from the `packageManager` field via `corepack enable`.

```sh
pnpm install
pnpm ddev   # api + postgres + redis; add pgadmin with `pnpm pgadmin` (port 8080)
pnpm test   # starts postgres/redis via docker if they are not already up
```

`pnpm test` needs Node 24.9 or newer: the suite lets jest load ESM-only
dev dependencies (e.g. `@faker-js/faker`, still the standard fake-data
library) natively instead of transforming them. Dependency notes: TypeScript
is pinned to the v6 line because `typescript-eslint` and `ts-jest` require
the v6 compiler API and refuse the v7 native build; `tsconfig.json` names its
global `@types` (`node`, `jest`) explicitly since newer compilers no longer
auto-include every `@types` package.

Postgres binds host port 5432 by default. If something else already owns it,
override the host side: `PG_HOST_PORT=55432 pnpm dddev` (and set `PGPORT` to
match in your `.env`).

Other scripts: `pnpm lint`, `pnpm format`, `pnpm typecheck`, `pnpm build`.

## Database

- `bugtracker.sql` is the baseline schema. The docker entrypoint and CI use
  it to create fresh databases.
- `migrations/` holds versioned forward migrations (`001_...` matches the
  baseline). Apply them with `pnpm db:migrate`, which tracks applied versions
  in `schema_migrations` and stamps — rather than re-running — databases that
  already have the baseline tables. New schema changes go in a new
  `00N_description.sql` file, never by editing 001.
- `src/db/query.ts` has the typed query helpers every repository uses:
  `queryMany` / `queryMaybeOne` / `queryOne` for rows with declared types,
  `queryExists` for `SELECT 1` probes, `execute` for writes without
  `RETURNING`. No more untyped `pool.query` calls or `SELECT 1` results cast
  to entity types.
- `src/db/transaction.ts` has `withTransaction`, which every multi-statement
  write goes through: project creation, ticket-with-assignees creation, and
  the project/ticket cascade deletes each commit atomically or roll back.

> Express 5, Typescript, Jest, REST, Postgres (no ORM), Docker, K8s, Terraform
> This bug tracker helps an organization keep track of different bugs across various projects.
> routes -> middlewares -> controllers -> services -> repositories

I didn't realize this at the time, but my models are totally anemic (basically DTOs)
Most of the logic is in the services. Mainly because I built this api using functions originally.

I'll do a more DDD/OOP approach in the other version of this api.

`@apollo/server`, `graphql` and the `@opentelemetry/*` packages are still in
package.json but nothing imports them yet, so GraphQL and tracing are aspirational
rather than implemented.

## Bug Tracker User Roles

There's four main roles

Admins can manage everything (users, projects, tickets, and comments).

Project Managers (PMs) can manage projects they create and who's allowed to work in them.

Developers can be assigned to a project or a ticket.

Contributors are developers with less priviledges.

## Workflow

1. User signup/login
2. User creates a project if they're a PM, or they get invited to join an existing project.
3. User creates tickets in their assigned projects
4. User (dev) closes tickets when they're done working on them.

## Debugging (vscode)

You can debug code using jest.

1. Download the Jest Runner extension (as specified in the .vscode folder)
2. Add the breakpoints wherever you want in the application
3. Go to the test case that tests the route you wanna test and hit debug

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [Error](https://stackoverflow.com/questions/783818)
- [Node Green](https://node.green/)
- [Bug Tracker App That I'm Cloning](https://www.youtube.com/watch?v=vG824vBdYY8)
