# Multi-stage build for the pnpm monorepo. Build from the REPO ROOT:
#   docker build -f apps/web/Dockerfile -t divan-web .
# next.config.ts has output: "standalone"; turbopack.root points at the repo root,
# so the standalone bundle lands in apps/web/.next/standalone/apps/web/server.js.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable && corepack prepare pnpm@10.18.0 --activate
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/prettier-config/package.json packages/prettier-config/
COPY packages/typescript-config/package.json packages/typescript-config/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /repo/packages/ui/node_modules ./packages/ui/node_modules
COPY . .
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ARG NEXT_PUBLIC_BRAND_NAME="Divan Shop"
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL NEXT_PUBLIC_BRAND_NAME=$NEXT_PUBLIC_BRAND_NAME
# Build does not need the database: generateStaticParams fall back to [] when it is unreachable.
ENV PAYLOAD_SECRET=build-time-placeholder DATABASE_URL=postgres://build:build@localhost:5432/build
RUN pnpm --filter web build

# Full-source image used for one-off commands: migrations, seed, payload CLI.
FROM build AS tools
WORKDIR /repo/apps/web
CMD ["pnpm", "payload", "migrate"]

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
RUN mkdir -p /app/apps/web/public/media && chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then((r)=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["node", "apps/web/server.js"]
