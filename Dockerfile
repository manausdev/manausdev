# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including devDependencies required for the build)
COPY package*.json ./
RUN npm ci

# Copy source and produce the standalone build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
