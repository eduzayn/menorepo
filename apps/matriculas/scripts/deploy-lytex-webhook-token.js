/**
 * Script para implantar a Edge Function do Lytex no Supabase
 * usando o token de acesso direto
 * 
 * Este script automatiza o processo de implantação da Edge Function
 * que processa webhooks da Lytex para o Supabase.
 * 
 * Uso:
 *   node deploy-lytex-webhook-token.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente do arquivo .env se existir
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Configurações
const config = {
  supabaseProjectId: process.env.SUPABASE_PROJECT_ID || 'npiyusbnaaibibcucspv',
  lytexWebhookSecret: process.env.LYTEX_WEBHOOK_SECRET || 'KftSqbqq3+DPEuqXdZ8ZKk9w6VPEyn5QUEGZ1qKIR5l1vtwUyc5ALHkoqFiA/Wfqp8Ctd9bnzOM5+d4+Lm6uNQ==',
  edgeFunctionPath: path.resolve(__dirname, 'edge-functions/lytex-webhook'),
  // Token de acesso fornecido diretamente
  supabaseToken: 'sbp_009270aba0a5a21833e58ef6ab73c56ee803c0dc'
};

// Verifica se a CLI do Supabase está instalada
function checkSupabaseCli() {
  try {
    execSync('supabase --version', { stdio: 'pipe' });
    console.log('✅ CLI do Supabase encontrada');
    return true;
  } catch (error) {
    console.error('❌ CLI do Supabase não está instalada. Por favor, instale com:');
    console.error('   npm install -g supabase');
    return false;
  }
}

// Faz login no Supabase usando o token diretamente
function loginToSupabase() {
  try {
    console.log('🔐 Fazendo login no Supabase com o token fornecido...');
    execSync(`supabase login ${config.supabaseToken}`, { stdio: 'inherit' });
    console.log('✅ Login realizado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.message);
    return false;
  }
}

// Implanta a Edge Function
function deployFunction() {
  try {
    console.log('🚀 Implantando função lytex-webhook...');
    
    // Criar pasta temporária se necessário
    const tempDir = path.resolve(__dirname, 'temp-deploy');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Copiar arquivo da função para pasta temporária
    const sourceFile = path.resolve(config.edgeFunctionPath, 'index.ts');
    const deployDir = path.resolve(tempDir, 'lytex-webhook');
    
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir, { recursive: true });
    }
    
    fs.copyFileSync(sourceFile, path.resolve(deployDir, 'index.ts'));
    
    // Implantar função
    console.log(`📦 Implantando para o projeto ${config.supabaseProjectId}...`);
    const deployCommand = `supabase functions deploy lytex-webhook --project-ref ${config.supabaseProjectId}`;
    execSync(deployCommand, { 
      stdio: 'inherit',
      cwd: tempDir
    });
    
    // Configurar secrets
    if (config.lytexWebhookSecret) {
      console.log('🔐 Configurando secrets...');
      // Escapar caracteres especiais na secret
      const escapedSecret = config.lytexWebhookSecret.replace(/[+&^"\\]/g, '\\$&');
      const secretsCommand = `supabase secrets set LYTEX_WEBHOOK_SECRET="${escapedSecret}" --project-ref ${config.supabaseProjectId}`;
      execSync(secretsCommand, { stdio: 'inherit' });
    } else {
      console.warn('⚠️ LYTEX_WEBHOOK_SECRET não definido. Configure manualmente no painel do Supabase.');
    }
    
    // Limpar pasta temporária
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log('✅ Implantação concluída com sucesso!');
    console.log(`🌐 URL da função: https://${config.supabaseProjectId}.supabase.co/functions/v1/lytex-webhook`);
  } catch (error) {
    console.error('❌ Erro ao implantar função:', error.message);
    process.exit(1);
  }
}

// Função principal
function main() {
  console.log('🚀 Iniciando implantação da Edge Function do Lytex com token direto');
  
  if (!checkSupabaseCli()) {
    process.exit(1);
  }
  
  if (!loginToSupabase()) {
    process.exit(1);
  }
  
  deployFunction();
}

// Executa o script
main(); 