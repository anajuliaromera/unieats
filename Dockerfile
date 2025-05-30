# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos e instala dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Executar com produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copia somente o necessário
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copie o .env em tempo de build ou monte como volume/env em produção
#COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]
