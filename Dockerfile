# ---------- Stage 1: Build ----------
FROM node:20-bookworm AS builder

WORKDIR /app

# Prevent Prisma auto generate during install
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies (stable + fast)
RUN npm ci

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-bookworm

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/uploads ./uploads
COPY package*.json ./


EXPOSE 5000

# Start your app
CMD ["node", "dist/index.js"]