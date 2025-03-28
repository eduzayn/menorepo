#!/usr/bin/env node

// Script para verificar se o pnpm está sendo usado na versão correta

const expectedVersion = '8.9.0';

// Verifica se o comando está sendo executado com pnpm
if (process.env.npm_execpath && !process.env.npm_execpath.includes('pnpm')) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Este projeto requer pnpm como gerenciador de pacotes.');
  console.error('\x1b[33m%s\x1b[0m', '⚠️ Por favor, use pnpm para instalar as dependências:');
  console.error('\x1b[36m%s\x1b[0m', '  pnpm install');
  console.error('\x1b[33m%s\x1b[0m', '⚠️ Se você não tem o pnpm instalado:');
  console.error('\x1b[36m%s\x1b[0m', `  npm install -g pnpm@${expectedVersion}`);
  console.error('\x1b[36m%s\x1b[0m', '  ou');
  console.error('\x1b[36m%s\x1b[0m', '  corepack enable && corepack prepare pnpm@8.9.0 --activate');
  console.error('\x1b[33m%s\x1b[0m', '📚 Para mais informações, consulte: docs/gerenciamento-pacotes.md');
  process.exit(1);
}

// Continua normalmente se estiver usando pnpm (verificação de versão é feita por outro script) 