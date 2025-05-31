# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos e instala dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY . .

# Adicione este ARG para a DATABASE_URL
ARG DATABASE_URL

# Defina a variável de ambiente DATABASE_URL para que o build possa usá-la
ENV DATABASE_URL=${DATABASE_URL}

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

# Remova ou comente esta linha se você vai passar a DATABASE_URL em tempo de execução
# COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]