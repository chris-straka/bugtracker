FROM node:18.15.0-bullseye-slim AS base
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
EXPOSE 3000

FROM base AS dev
WORKDIR /usr/src/app
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
CMD ["pnpm", "dev"]

# I need the dev dependencies for pnpm build to work (tsc)
FROM dev AS build
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY . .
RUN pnpm build

FROM base as prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --chown=node:node --from=build ./usr/src/app/build .
RUN pnpm install --prod --frozen-lockfile 
USER node
CMD ["node", "index.js"]
