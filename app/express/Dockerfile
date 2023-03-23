# base
FROM node:18.15.0-bullseye AS base
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
EXPOSE 3000

# dev
FROM base AS dev
WORKDIR /usr/src/app
RUN pnpm install --frozen-lockfile

# build
FROM dev AS build
WORKDIR /usr/src/app
COPY . .
RUN pnpm build

# deps
FROM base AS deps
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN pnpm install 

# prod
FROM gcr.io/distroless/nodejs18-debian11:nonroot as prod
ENV NODE_ENV=production
USER nonroot
COPY --from=build --chown=nonroot:nonroot /usr/src/app/build ./
COPY --from=deps --chown=nonroot:nonroot /usr/src/app/node_modules ./node_modules
CMD ["./build/index.js"]
