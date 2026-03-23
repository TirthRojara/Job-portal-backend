# ---------- Stage 1: Build ----------
FROM node:20-bookworm AS builder

WORKDIR /app

# Prevent Prisma auto generate during install
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies (stable + fast)
RUN npm cache clean --force && npm ci

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

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client for production
RUN npx prisma generate

EXPOSE 5000

# Start your app
CMD ["node", "dist/index.js"]