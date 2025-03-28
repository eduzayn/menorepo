/**
 * Arquivo de teste para a integração com o gateway Lytex
 * 
 * Este arquivo não faz parte da aplicação principal e serve apenas para testar
 * a comunicação com a API do Lytex usando as credenciais fornecidas.
 */

// Usando require em vez de import para compatibilidade com ts-node
const { lytexService } = require('./services/lytexService');

async function testarIntegracaoLytex() {
  try {
    console.log('Iniciando teste de integração com o Lytex...');
    
    // Verifica se a configuração é válida
    const configValida = lytexService.isConfigValid();
    console.log(`Configuração válida: ${configValida}`);
    
    if (!configValida) {
      console.error('A configuração do Lytex é inválida. Verifique as variáveis de ambiente.');
      return;
    }
    
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