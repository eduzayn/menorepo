/**
 * Utilitário para criar cobranças de teste com a Lytex
 * 
 * Este script permite criar cobranças com diferentes métodos de pagamento
 * para testar a integração com o gateway Lytex.
 * 
 * Uso:
 *   node lytex-charge-creator.js <tipo> <valor>
 * 
 * Onde:
 *   - tipo: 'boleto', 'pix', 'credit_card' (padrão: 'pix')
 *   - valor: valor em reais (padrão: 10)
 * 
 * Exemplo:
 *   node lytex-charge-creator.js pix 15.50
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente do arquivo .env se existir
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Configurações da Lytex
const config = {
  clientId: process.env.LYTEX_CLIENT_ID || '5eb456bbd8a9436787e8a5edc106199a',
  clientSecret: process.env.LYTEX_CLIENT_SECRET || 'd7c12c8dab894ed0857ac7814c7a75f9',
  tokenUrl: 'https://api.lytex.com.br/oauth/token',
  apiBaseUrl: 'https://api.lytex.com.br/v1',
  webhookUrl: 'https://edunexia-dev.supabase.co/functions/v1/lytex-webhook'
};

// Obtém argumentos da linha de comando
const paymentType = process.argv[2] || 'pix';
const amount = parseFloat(process.argv[3] || '10') * 100; // Converte para centavos

// Token de acesso e cache
let accessToken = null;
let tokenExpiry = 0;

/**
 * Obtém um token de acesso válido para a API da Lytex
 */
async function getAccessToken() {
  // Verifica se o token atual ainda é válido
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    console.log('🔑 Obtendo novo token de acesso...');
    
    const response = await axios.post(config.tokenUrl, 
      {
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Armazena o token e calcula o tempo de expiração (1 hora)
    accessToken = response.data.access_token;
    tokenExpiry = now + (response.data.expires_in * 1000) - 60000; // Margem de segurança de 1 minuto
    
    console.log('✅ Token obtido com sucesso!');
    return accessToken;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com a Lytex');
  }
}

/**
 * Gera um ID de referência único para a transação
 */
function generateReference() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EDX-${timestamp}-${random}`;
}

/**
 * Cria uma cobrança na Lytex
 */
async function createCharge() {
  try {
    const token = await getAccessToken();
    const reference = generateReference();
    
    // Dados do cliente para teste
    const customer = {
      name: 'Aluno Teste Edunéxia',
      email: 'aluno.teste@edunexia.com',
      tax_id: '12345678900' // CPF para teste
    };
    
    // Configurações específicas para cada tipo de pagamento
    const paymentConfig = {};
    
    if (paymentType === 'boleto') {
      paymentConfig.payment_method = 'boleto';
      paymentConfig.due_date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 3 dias
    } else if (paymentType === 'credit_card') {
      paymentConfig.payment_method = 'credit_card';
    } else {
      // Default para PIX
      paymentConfig.payment_method = 'pix';
      paymentConfig.pix_expiration_date = 3600; // 1 hora
    }
    
    console.log(`💰 Criando cobrança ${paymentConfig.payment_method} no valor de R$ ${(amount/100).toFixed(2)}...`);
    
    const payload = {
      amount,
      currency: 'BRL',
      description: `Matrícula Edunéxia - Teste ${paymentConfig.payment_method}`,
      reference,
      customer,
      notification_url: config.webhookUrl,
      ...paymentConfig,
      // Opções de checkout e redirecionamento
      success_url: 'https://edunexia.com.br/matricula/sucesso',
      cancel_url: 'https://edunexia.com.br/matricula/cancelado'
    };
    
    console.log('📝 Payload da cobrança:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${config.apiBaseUrl}/charges`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Cobrança criada com sucesso!');
    console.log('📋 Detalhes da cobrança:');
    console.log('------------------------');
    console.log(`ID: ${response.data.id}`);
    console.log(`Referência: ${response.data.reference}`);
    console.log(`Status: ${response.data.status}`);
    console.log(`Valor: R$ ${(response.data.amount/100).toFixed(2)}`);
    
    if (response.data.checkout_url) {
      console.log(`\n🔗 URL de Checkout: ${response.data.checkout_url}`);
      console.log('\nAcesse esta URL para completar o pagamento no ambiente de testes da Lytex.');
    }
    
    if (paymentType === 'pix' && response.data.pix) {
      console.log(`\n📱 Chave PIX Copia e Cola: ${response.data.pix.qr_code}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar cobrança:', error.response?.data || error.message);
    throw new Error('Falha ao criar cobrança na Lytex');
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando criação de cobrança Lytex para testes');
  console.log(`📊 Tipo de pagamento: ${paymentType}`);
  console.log(`💵 Valor: R$ ${(amount/100).toFixed(2)}`);
  console.log('------------------------');
  
  try {
    await createCharge();
    console.log('\n✨ Processo finalizado com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro no processo:', error.message);
    process.exit(1);
  }
}

// Executa o programa
main(); 