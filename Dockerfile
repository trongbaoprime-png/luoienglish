# Production Dockerfile for Next.js App
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL required by Prisma Query Engine on Alpine
RUN apk add --no-cache openssl libc6-compat

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source code and build
COPY . .
RUN npx prisma generate --schema=prisma/cms.prisma && \
    npx prisma generate --schema=prisma/crm.prisma && \
    npx prisma generate --schema=prisma/omnichannel.prisma
RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]
