<!-- cSpell:disable -->
# Integração WhatsApp para Edunéxia

Este módulo implementa a integração do WhatsApp para o sistema de comunicação da Edunéxia, suportando dois modos de operação:

1. **API Oficial do WhatsApp Business** - Integração com a API Cloud da Meta
2. **QR Code** - Integração via biblioteca whatsapp-web.js (similar ao WhatsApp Web)

## Configuração Rápida

Para configurar rapidamente em ambiente de produção, execute:

```bash
# Na pasta raiz do módulo de comunicação
chmod +x scripts/setup-whatsapp.sh
./scripts/setup-whatsapp.sh
```

Este script instalará:
- Biblioteca whatsapp-web.js
- Puppeteer (necessário para o funcionamento do whatsapp-web.js)
- Dependências do sistema operacional necessárias (se estiver no Linux)
- Criará diretórios e arquivos de configuração

## Configuração Manual

Se preferir configurar manualmente, siga estes passos:

### 1. Instalar Dependências

```bash
npm install --save whatsapp-web.js puppeteer
```

### 2. Configurar Servidor

Para que o whatsapp-web.js funcione corretamente em ambiente de produção, você precisará instalar algumas dependências do sistema (em servidores Linux):

```bash
apt-get update
apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 \
  libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
  libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
  libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
  libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 \
  libnss3 lsb-release xdg-utils wget
```

### 3. Configurar Pasta de Armazenamento de Sessões

O WhatsApp Web precisa armazenar dados da sessão:

```bash
mkdir -p .wwebjs_auth
chmod -R 755 .wwebjs_auth
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```
NEXT_PUBLIC_APP_URL=https://seu-dominio.com.br
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### 5. Manter a Aplicação Rodando (PM2)

Recomendamos usar o PM2 para manter a aplicação rodando:

```bash
# Instalar PM2
npm install -g pm2

# Criar arquivo de configuração
cat > whatsapp-pm2.json << EOL
{
  "name": "whatsapp-api",
  "script": "node_modules/next/dist/bin/next",
  "args": "start",
  "cwd": "./",
  "instances": 1,
  "autorestart": true,
  "watch": false,
  "max_memory_restart": "1G",
  "env": {
    "NODE_ENV": "production"
  }
}
EOL

# Iniciar serviço
pm2 start whatsapp-pm2.json

# Configurar para iniciar automaticamente
pm2 startup
pm2 save
```

## Modos de Integração

### Modo API Oficial

Para usar a API oficial do WhatsApp Business, você precisará:

1. Criar uma conta no [WhatsApp Business Platform](https://business.facebook.com/)
2. Configurar um aplicativo no Meta for Developers
3. Obter as credenciais (API Key, Phone Number ID, etc.)
4. Verificar seu número de telefone comercial
5. Solicitar acesso à API (pode levar algumas semanas para aprovação)

### Modo QR Code

O modo QR Code é mais simples de configurar:

1. Acesse a tela de configuração do WhatsApp no sistema
2. Selecione o modo "QR Code"
3. Clique em "Iniciar Sessão"
4. Escaneie o QR Code com o WhatsApp do seu telefone
5. Mantenha o telefone conectado à internet

**Importante:** No modo QR Code, se o telefone ficar sem internet ou se o aplicativo do WhatsApp for fechado, as mensagens não serão enviadas.

## Considerações de Produção

Para um ambiente de produção estável, considere:

1. **Persistência de Sessões:** Implementar um armazenamento persistente para as sessões (Redis, MongoDB)
2. **Balanceamento de Carga:** Se precisar escalar, implemente um mecanismo para distribuir sessões entre servidores
3. **Monitoramento:** Configurar alertas para quedas de sessão ou falhas de envio
4. **Backups:** Fazer backup regular dos diretórios de sessão (.wwebjs_auth)
5. **Segurança:** Limitar o acesso ao servidor e às APIs

## Limitações

- O modo QR Code depende de um telefone com WhatsApp ativo e conectado
- A Meta pode detectar o uso de automações e bloquear o número
- O WhatsApp tem limites de envio de mensagens, especialmente para números não verificados
- O uso do modo QR Code para envios em massa pode violar os termos de serviço do WhatsApp

## Resolução de Problemas

### Problemas Comuns

1. **Erro de QR Code expirado:**
   - Tente gerar um novo QR Code
   - Reinicie o serviço: `pm2 restart whatsapp-api`

2. **Sessão desconectada frequentemente:**
   - Verifique a conexão de internet do telefone
   - Desative otimizações de bateria para o WhatsApp no celular
   - Verifique se o WhatsApp está atualizado

3. **Erros de Puppeteer:**
   - Verifique se todas as dependências do sistema estão instaladas
   - Aumente a memória disponível para o Node.js: `NODE_OPTIONS=--max_old_space_size=4096`

### Logs

Para verificar logs do serviço:

```bash
pm2 logs whatsapp-api
```

## Recursos Adicionais

- [Documentação do whatsapp-web.js](https://wwebjs.dev/guide/)
- [Documentação da API oficial do WhatsApp](https://developers.facebook.com/docs/whatsapp)
- [Guia de boas práticas do WhatsApp Business](https://developers.facebook.com/docs/whatsapp/guides/best-practices)

## Contato para Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento da Edunéxia.

---

© 2024 Edunéxia - Sistema de Educação a Distância 
