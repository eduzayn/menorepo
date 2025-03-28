#!/bin/bash

# Script para configurar a integração do WhatsApp na produção
# Este script deve ser executado na raiz do projeto apps/comunicacao

echo "🟢 Iniciando configuração da integração WhatsApp..."

# Instalando dependências
echo "📦 Instalando dependências necessárias..."
npm install --save whatsapp-web.js puppeteer

# Criando diretório para armazenamento de sessões do WhatsApp
echo "📁 Criando diretório para sessões do WhatsApp..."
mkdir -p .wwebjs_auth

# Configurando permissões
echo "🔒 Configurando permissões..."
chmod -R 755 .wwebjs_auth

# Instalando pacotes do sistema se necessário (para servidor Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "🐧 Detectado sistema Linux, instalando dependências adicionais..."
  
  # Verifica se estamos rodando como root
  if [[ $EUID -ne 0 ]]; then
    echo "⚠️ Para instalar dependências do sistema, execute este script como root (sudo)."
  else
    # Instala dependências para o Puppeteer no Ubuntu/Debian
    apt-get update
    apt-get install -y \
      gconf-service \
      libasound2 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libc6 \
      libcairo2 \
      libcups2 \
      libdbus-1-3 \
      libexpat1 \
      libfontconfig1 \
      libgcc1 \
      libgconf-2-4 \
      libgdk-pixbuf2.0-0 \
      libglib2.0-0 \
      libgtk-3-0 \
      libnspr4 \
      libpango-1.0-0 \
      libpangocairo-1.0-0 \
      libstdc++6 \
      libx11-6 \
      libx11-xcb1 \
      libxcb1 \
      libxcomposite1 \
      libxcursor1 \
      libxdamage1 \
      libxext6 \
      libxfixes3 \
      libxi6 \
      libxrandr2 \
      libxrender1 \
      libxss1 \
      libxtst6 \
      ca-certificates \
      fonts-liberation \
      libappindicator1 \
      libnss3 \
      lsb-release \
      xdg-utils \
      wget
  fi
fi

# Criando arquivo .env.local se não existir
if [ ! -f .env.local ]; then
  echo "🔧 Criando arquivo .env.local..."
  echo "# Configurações da integração WhatsApp" > .env.local
  echo "NEXT_PUBLIC_APP_URL=https://seu-dominio.com.br" >> .env.local
  echo "SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key" >> .env.local
  echo "⚠️ Lembre-se de editar o arquivo .env.local com suas configurações!"
else
  echo "✅ Arquivo .env.local já existe."
fi

# Instruções para configurar o serviço PM2 (para manter as sessões ativas)
echo "
🚀 PRÓXIMOS PASSOS:

1. Instale o PM2 para manter a aplicação rodando:
   npm install -g pm2

2. Crie um arquivo de configuração PM2:
   echo '{
     \"name\": \"whatsapp-api\",
     \"script\": \"node_modules/next/dist/bin/next\",
     \"args\": \"start\",
     \"cwd\": \"./\",
     \"instances\": 1,
     \"autorestart\": true,
     \"watch\": false,
     \"max_memory_restart\": \"1G\",
     \"env\": {
       \"NODE_ENV\": \"production\"
     }
   }' > whatsapp-pm2.json

3. Inicie o serviço:
   pm2 start whatsapp-pm2.json

4. Configure o PM2 para iniciar automaticamente:
   pm2 startup
   pm2 save

5. Verifique se o serviço está rodando:
   pm2 status
"

echo "✅ Configuração concluída!" 