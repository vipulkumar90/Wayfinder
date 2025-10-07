# ---- 1. Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable
COPY services/trip-service/package.json services/trip-service/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY services/trip-service/prisma ./prisma/
COPY shared/protos ./shared/protos/
RUN pnpm prisma generate
COPY services/trip-service/src ./src
COPY services/trip-service/tsconfig.json ./
RUN pnpm build


# ---- 2. Runner Stage ----
FROM node:20-alpine AS runner

WORKDIR /app
RUN corepack enable
COPY services/trip-service/package.json services/trip-service/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the compiled code from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 50051
EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma generate && pnpm prisma migrate deploy && node dist/app.js"]
