# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

# copy package files
COPY package*.json ./

# install all deps (including dev)
RUN npm install

# copy project files
COPY . .

# generate prisma client
RUN npx prisma generate

# build typescript
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:22-alpine

WORKDIR /app

# copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# copy built app from builder
COPY --from=builder /app/dist ./dist

# copy prisma files
COPY --from=builder /app/prisma ./prisma

# expose port
EXPOSE 5000

# start server
CMD ["node", "dist/index.js"]