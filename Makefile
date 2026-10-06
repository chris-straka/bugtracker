# One-command entry points. The API tests need Postgres + Redis: either run
# `make up` (Docker), or point app/.env at your own (see app/README.md).
.PHONY: install up down test test-api test-frontend lint build bench

install:
	cd app && pnpm install --frozen-lockfile
	cd frontend && pnpm install --frozen-lockfile

up:
	cd app && pnpm dddev && pnpm db:migrate

down:
	cd app && pnpm ddown

test: test-api test-frontend

test-api:
	cd app && pnpm test

test-frontend:
	cd frontend && pnpm test

lint:
	cd app && pnpm lint && pnpm format:check && pnpm typecheck
	cd frontend && pnpm lint && pnpm typecheck

build:
	cd app && pnpm build
	cd frontend && pnpm build

bench:
	cd app && pnpm bench
