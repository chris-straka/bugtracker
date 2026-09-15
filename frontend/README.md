# Bugtracker Frontend

Lit single-page app for the bugtracker REST API (`../app`).

- Hash-routed views: login, signup, dashboard (my/assigned projects + create),
  project detail (tickets, members, comments), ticket detail (edit, assignees, comments).
- Auth supports both transports: the default **cookie session** (web) and
  **JWT access + rotating refresh tokens** (`POST /tokens`), selectable on the
  login screen. JWTs are held in memory; only the refresh token is persisted
  (localStorage) for reload restore, with single-use rotation enforced by the API.
- State lives in Lit **ReactiveControllers** (`src/state/`); every component
  styles itself with scoped `static styles` (shadow DOM) composed from
  `src/components/shared-styles.ts`.

## Setup

Requires Node >= 22 and the API running (`../app`: `pnpm install`, then
`pnpm dddev` for postgres/redis and `pnpm dev` for the API on `:3000`).

```sh
npm install
npm run dev      # vite on :5173, API routes proxied to :3000 (see vite.config.ts)
```

Production builds use a relative API base (same origin). To point the SPA at
an API on another origin, set `window.BUGTRACKER_API_URL` before `main.ts`
loads (and enable CORS on the API).

## Scripts

- `npm run dev` — vite dev server with API proxy
- `npm run build` — `tsc --noEmit` + vite build to `dist/`
- `npm test` — jest suite (jsdom; no Docker needed)
- `npm run typecheck`, `npm run lint`
