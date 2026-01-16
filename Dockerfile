FROM node:20-alpine

WORKDIR /app

# Copy backend + local db package
COPY apps/api ./apps/api
COPY packages/db ./packages/db

# -----------------------------
# Install DB package deps & generate Prisma client
# -----------------------------
WORKDIR /app/packages/db
RUN npm install
RUN npx prisma generate

# -----------------------------
# Install API deps & build
# -----------------------------
WORKDIR /app/apps/api
RUN npm install
RUN npm run build

# -----------------------------
# Runtime
# -----------------------------
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
