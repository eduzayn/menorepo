/**
 * Script para implantar a Edge Function do Lytex no Supabase
 * 
 * Este script automatiza o processo de implantação da Edge Function
 * que processa webhooks da Lytex para o Supabase.
 * 
 * Uso:
 *   node deploy-lytex-webhook.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

// Carrega variáveis de ambiente do arquivo .env se existir
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Configurações
const config = {
  supabaseProjectId: process.env.SUPABASE_PROJECT_ID || 'npiyusbnaaibibcucspv',
  lytexWebhookSecret: process.env.LYTEX_WEBHOOK_SECRET || '',
  edgeFunctionPath: path.resolve(__dirname, 'edge-functions/lytex-webhook')
};

// Interface para entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Função para fazer login no Supabase
function loginToSupabase() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Fazendo login no Supabase...');
    
    try {
      // Verificar se já está logado
      const loginStatus = execSync('supabase status', { stdio: 'pipe' }).toString();
      if (loginStatus.includes('You are logged in')) {
        console.log('✅ Já está logado no Supabase CLI');
        resolve();
        return;
      }
    } catch (error) {
      // Se não estiver logado, continua com o login
    }
    
    console.log('\n⚠️ É necessário fazer login no Supabase CLI.');
    console.log('📝 Acesse https://app.supabase.com/account/tokens para gerar um token de acesso.');
    
    rl.question('🔑 Cole aqui seu token de acesso do Supabase (formato sbp_xxx...): ', (token) => {
      try {
        execSync(`supabase login ${token}`, { stdio: 'inherit' });
        console.log('✅ Login realizado com sucesso!');
        resolve();
      } catch (error) {
        console.error('❌ Erro ao fazer login:', error.message);
        reject(error);
      }
    });
  });
}

// Implanta a Edge Function
async function deployFunction() {
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
      const secretsCommand = `supabase secrets set LYTEX_WEBHOOK_SECRET="${config.lytexWebhookSecret}" --project-ref ${config.supabaseProjectId}`;
      execSync(secretsCommand, { stdio: 'inherit' });
    } else {
      console.warn('⚠️ LYTEX_WEBHOOK_SECRET não definido. Configure manualmente no painel do Supabase.');
    }
    
    // Limpar pasta temporária
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log('✅ Implantação concluída com sucesso!');
    console.log(`🌐 URL da função: https://${config.supabaseProjectId}.supabase.co/functions/v1/lytex-webhook`);
    
    // Fechar a interface readline
    rl.close();
  } catch (error) {
    console.error('❌ Erro ao implantar função:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando implantação da Edge Function do Lytex');
  
  if (!checkSupabaseCli()) {
    rl.close();
    process.exit(1);
  }
  
  try {
    await loginToSupabase();
    await deployFunction();
  } catch (error) {
    console.error('❌ Erro durante o processo:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Executa o script
main(); 