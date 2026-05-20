FROM node:22-slim AS base
WORKDIR /app

# Prisma braucht openssl – sonst gibt's beim Start oft einen Engine-Fehler
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Erst nur die package-Dateien -> besseres Layer-Caching
COPY package.json package-lock.json ./
RUN npm ci

# Prisma-Schema kopieren und Client generieren
COPY prisma ./prisma
RUN npx prisma generate

# Restlicher Code
COPY . .

ENV NODE_ENV=production
EXPOSE 3001

# Beim Start: Migrationen anwenden, dann Server starten
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node index.js"]