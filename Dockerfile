ARG BUN_VERSION=1.2
FROM oven/bun:${BUN_VERSION}-slim AS base
RUN ["apt-get", "update", "-y"]
RUN ["apt-get", "install", "-y", "openssl"]
WORKDIR /app
COPY package.json .

FROM base AS prod-deps
COPY bun.lock .
COPY src/prisma/schema.prisma src/prisma/schema.prisma
RUN --mount=type=cache,id=bun,target=~/.bun/install/cache \
    bun install --frozen-lockfile --production --ignore-scripts
RUN bun run db:gen

FROM prod-deps AS deps
RUN --mount=type=cache,id=bun,target=~/.bun/install/cache \
    bun install --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN --mount=type=cache,target=/app/.next/cache \
    bun run build

FROM prod-deps AS release
COPY .env* .
COPY --from=build /app/.next .next
COPY --from=build /app/next.config.ts next.config.ts
COPY --from=build /app/public public

ENV NEXT_TELEMETRY_DISABLED=1
USER bun
EXPOSE 3000
CMD bun run db:push && bun run start
