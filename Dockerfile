FROM node:20-alpine

# Needed for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# -----------------------------
# 1. Copy root manifests FIRST (cache-friendly)
# -----------------------------
COPY package.json package-lock.json turbo.json .npmrc ./

# -----------------------------
# 2. Copy workspaces
# -----------------------------
COPY apps ./apps
COPY packages ./packages

# -----------------------------
# 3. Install ALL deps once (workspace-aware)
# -----------------------------
RUN npm ci

# -----------------------------
# 4. Generate Prisma client
# -----------------------------
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma

# -----------------------------
# 5. Build API
# -----------------------------
RUN npm run build --workspace=apps/api

# -----------------------------
# Runtime
# -----------------------------
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
