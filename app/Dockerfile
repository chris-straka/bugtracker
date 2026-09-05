# Node 24 is the active LTS line. connect-redis 10 requires >= 22.
FROM node:24-bookworm-slim AS base
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Reads the "packageManager" field in package.json to pin the pnpm version,
# so it has to run after the manifest is copied in.
RUN corepack enable && corepack prepare --activate
EXPOSE 3000

# I need dev dependencies in order to build for production (typescript)
# So I can't just install prod dependencies like I want to just yet
FROM base AS dev
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
CMD ["dumb-init", "pnpm", "dev"]

# Build the production app
FROM dev AS build
ENV NODE_ENV=production
COPY . .
RUN pnpm build

# Grab the production app from build and only install the production dependencies
FROM base AS prod
ENV NODE_ENV=production
COPY --chown=node:node --from=build /usr/src/app/build ./
RUN pnpm install --prod --frozen-lockfile
USER node
# dumb-init reaps zombies and forwards signals, so the container stops cleanly.
CMD ["dumb-init", "node", "index.js"]
