# Production Dockerfile for Next.js App (/luoi/ 4-Module Architecture)
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL required by Prisma Query Engine on Alpine
RUN apk add --no-cache openssl libc6-compat

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
COPY luoi ./luoi/
RUN npm ci

# Copy source code and build
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma && \
    npx prisma generate --schema=luoi/cms/cms.prisma && \
    npx prisma generate --schema=luoi/minicrm/crm.prisma && \
    npx prisma generate --schema=luoi/omni/omni.prisma

# Push schemas to SQLite files to ensure tables exist during static prerendering
RUN npx prisma db push --schema=prisma/schema.prisma --accept-data-loss && \
    npx prisma db push --schema=luoi/cms/cms.prisma --accept-data-loss && \
    npx prisma db push --schema=luoi/minicrm/crm.prisma --accept-data-loss && \
    npx prisma db push --schema=luoi/omni/omni.prisma --accept-data-loss

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
COPY --from=builder /app/luoi ./luoi

EXPOSE 3000

CMD ["npm", "run", "start"]
