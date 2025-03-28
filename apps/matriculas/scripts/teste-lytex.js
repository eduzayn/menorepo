/**
 * Script de teste para a integração com o gateway Lytex
 * 
 * Este arquivo não faz parte da aplicação principal e serve apenas para testar
 * a comunicação com a API do Lytex usando as credenciais fornecidas.
 */

const axios = require('axios');

// Credenciais do Lytex (manualmente obtidas do .env)
const LYTEX_CLIENT_ID = '67904aed85a041251706543f';
const LYTEX_CLIENT_SECRET = 'USsRK677Mw29XrWvByfZOWYdBZ1iBUicJ1NjJTOveQodxQ8lenvmW5wIqqjxb0mTow2cvI3u3lGJKVi35WeFut78QTmJqpEj43Sz4t9Yht4dmYNyWXgMsHQKyq3ZVNzgtJlYBvCQDlGH6rjtF0IeVYHoXGKQKdGq1SiY9Ln4WwFkwEqSMiJXO5pRkMjnnLkTrX1DaTCRTmkWOCiiDShsCM7bZ9ooaHOLwsZEDNySJRTWNhIpdWmZSINSSfWSNA2a';
const LYTEX_BASE_URL = 'https://api.lytex.com.br';
const LYTEX_CALLBACK_URL = 'https://edunexia.com.br/api/pagamentos/lytex/webhook';

// Serviço simplificado do Lytex
const lytexService = {
  token: null,
  tokenExpiry: null,

  isTokenExpired() {
    if (!this.token || !this.tokenExpiry) return true;
    return new Date() > this.tokenExpiry;
  },

  async getAccessToken() {
    if (this.token && !this.isTokenExpired()) {
      return this.token;
    }

    try {
      const response = await axios.post(
        `${LYTEX_BASE_URL}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: LYTEX_CLIENT_ID,
          client_secret: LYTEX_CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.token = response.data.access_token;
      // Define a expiração para 1 hora antes do tempo real (margem de segurança)
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 3600) * 1000);

      if (!this.token) {
        throw new Error('Token não recebido da API Lytex');
      }

      return this.token;
    } catch (error) {
      console.error('Erro ao obter token de acesso Lytex:', error);
      throw new Error('Falha ao autenticar no gateway Lytex');
    }
  },

  async criarCobranca(params) {
    try {
      const token = await this.getAccessToken();

      const payload = {
        valor: params.valor,
        descricao: params.descricao,
        referencia: params.referencia,
        vencimento: params.vencimento.toISOString().split('T')[0], // formato YYYY-MM-DD
        cliente: {
          nome: params.aluno.nome,
          email: params.aluno.email,
          cpf: params.aluno.cpf,
          telefone: params.aluno.telefone || '',
        },
        metodosPagamento: params.metodosPagamento || ['pix', 'boleto', 'cartao'],
        maxParcelas: params.maxParcelas || 12,
        urlRetorno: params.urlRetorno || LYTEX_CALLBACK_URL,
        callbackUrl: LYTEX_CALLBACK_URL,
      };

      const response = await axios.post(
        `${LYTEX_BASE_URL}/api/v1/cobrancas`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        valor: response.data.valor,
        linkPagamento: response.data.link_pagamento,
        dataCriacao: response.data.data_criacao,
        dataVencimento: response.data.data_vencimento,
        pixCopiaECola: response.data.pix_copia_e_cola,
        qrCodeImage: response.data.qrcode_image,
        linhaDigitavel: response.data.linha_digitavel,
        pdf: response.data.pdf_url,
      };
    } catch (error) {
      console.error('Erro ao criar cobrança no Lytex:', error.response?.data || error.message);
      throw new Error('Falha ao criar cobrança no gateway Lytex');
    }
  },

  async consultarCobranca(cobrancaId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${LYTEX_BASE_URL}/api/v1/cobrancas/${cobrancaId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        valor: response.data.valor,
        linkPagamento: response.data.link_pagamento,
        dataCriacao: response.data.data_criacao,
        dataVencimento: response.data.data_vencimento,
        pixCopiaECola: response.data.pix_copia_e_cola,
        qrCodeImage: response.data.qrcode_image,
        linhaDigitavel: response.data.linha_digitavel,
        pdf: response.data.pdf_url,
      };
    } catch (error) {
      console.error('Erro ao consultar cobrança no Lytex:', error.response?.data || error.message);
      throw new Error('Falha ao consultar cobrança no gateway Lytex');
    }
  },
};

// Função principal de teste
async function testarIntegracaoLytex() {
  try {
    console.log('Iniciando teste de integração com o Lytex...');
    
    // Teste de criação de cobrança
    const cobranca = await lytexService.criarCobranca({
      aluno: {
        id: 'aluno-teste-001',
        nome: 'Aluno Teste',
        email: 'aluno.teste@example.com',
        cpf: '12345678909',
        telefone: '11999999999'
      },
      valor: 10000, // R$ 100,00
      descricao: 'Teste de integração - Matrícula',
      referencia: `teste-${new Date().getTime()}`,
      vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
      metodosPagamento: ['pix', 'boleto'],
      maxParcelas: 1
    });
    
    console.log('Cobrança criada com sucesso:');
    console.log(`ID: ${cobranca.id}`);
    console.log(`Status: ${cobranca.status}`);
    console.log(`Valor: R$ ${(cobranca.valor / 100).toFixed(2)}`);
    console.log(`Link de pagamento: ${cobranca.linkPagamento}`);
    
    if (cobranca.pixCopiaECola) {
      console.log(`PIX Copia e Cola: ${cobranca.pixCopiaECola}`);
    }
    
    // Consulta a cobrança recém-criada
    const cobrancaConsultada = await lytexService.consultarCobranca(cobranca.id);
    console.log('\nDados da consulta da cobrança:');
    console.log(`Status: ${cobrancaConsultada.status}`);
    
    console.log('\nTeste concluído com sucesso!');
    
    return cobranca;
  } catch (error) {
    console.error('Erro durante o teste de integração:', error);
  }
}

// Executa o teste
testarIntegracaoLytex()
  .then(result => {
    if (result) {
      console.log('\nResultado do teste:', result);
    }
  })
  .catch(error => {
    console.error('Erro ao executar o teste:', error);
  }); 