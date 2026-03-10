# ---------- Stage 1: Build ----------
# Using the FULL Node 22 image so OpenSSL is already installed
FROM node:22-bookworm AS builder

WORKDIR /app

# Copy EVERYTHING (including your local Windows node_modules)
COPY . .

# Lock down Prisma so it doesn't try to fetch anything from the internet
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Build TypeScript
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:22-bookworm

WORKDIR /app

# Copy all the ready-to-go files from the builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 5000

# Start server
CMD ["node", "dist/index.js"]