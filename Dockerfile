# ---------- Stage 1: Build ----------
FROM node:22-bookworm AS builder

WORKDIR /app

# Prevent Prisma from trying to download engines during build
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
# Point Prisma to the engine we are copying from Windows
ENV PRISMA_QUERY_ENGINE_BINARY=/app/node_modules/@prisma/engines/query-engine-debian-openssl-3.0.x

# Copy EVERYTHING (including your node_modules with the Linux engine)
COPY . .

# Build TypeScript
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:22-bookworm

WORKDIR /app

# Set these again for the production container
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV PRISMA_QUERY_ENGINE_BINARY=/app/node_modules/@prisma/engines/query-engine-debian-openssl-3.0.x

# Copy files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 5000

# Start server
CMD ["node", "dist/index.js"]