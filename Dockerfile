FROM node:23.10.0-alpine AS base

# Instalação do pnpm
RUN npm install -g pnpm@8.9.0

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração global
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Criar a pasta 'scripts' para evitar erro no preinstall
RUN mkdir -p scripts
RUN echo "console.log('Script de preinstall para Docker');" > scripts/preinstall.js

# Instalação das dependências do monorepo
FROM base AS deps
COPY packages ./packages/
RUN pnpm install --ignore-scripts

# Construção de aplicações específicas será feita em Dockerfiles separados para cada app
