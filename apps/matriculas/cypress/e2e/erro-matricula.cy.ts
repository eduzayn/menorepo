/// <reference types="cypress" />

describe('Fluxo de Matrícula - Cenários de Erro', () => {
  beforeEach(() => {
    // Interceptar chamadas de API para os dados necessários
    cy.intercept('GET', '**/api/cursos*', { fixture: 'cursos.json' }).as('getCursos');
    cy.intercept('GET', '**/api/planos*', { fixture: 'planos.json' }).as('getPlanos');
    
    // Visitar a página de nova matrícula
    cy.visit('/matriculas/nova');
  });

  it('deve exibir erros para campos obrigatórios não preenchidos', () => {
    // Verificar se o formulário de matrícula está visível
    cy.get('[data-cy=matricula-form-multi-step]').should('be.visible');
    
    // Tentar avançar sem preencher nenhum campo
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar mensagens de erro para campos obrigatórios
    cy.get('[data-cy=erro-aluno]').should('be.visible');
    cy.get('[data-cy=erro-curso]').should('be.visible');
    cy.get('[data-cy=erro-plano]').should('be.visible');
    cy.get('[data-cy=erro-status]').should('be.visible');
  });

  it('deve exibir erro para data de fim anterior à data de início', () => {
    // Preencher campos obrigatórios
    cy.get('[data-cy=input-aluno]').type('Maria Silva');
    cy.get('[data-cy=select-curso]').click();
    cy.get('[data-cy=curso-option-1]').click();
    cy.get('[data-cy=select-plano]').click();
    cy.get('[data-cy=plano-option-1]').click();
    
    // Inserir data de início posterior à data de fim
    const dataAtual = new Date();
    const dataInicio = new Date(dataAtual);
    dataInicio.setMonth(dataInicio.getMonth() + 6); // 6 meses no futuro
    const dataFim = new Date(dataAtual);
    dataFim.setMonth(dataFim.getMonth() + 3); // 3 meses no futuro
    
    // Formatar datas no formato YYYY-MM-DD
    const formatarData = (data: Date) => {
      return data.toISOString().split('T')[0];
    };
    
    cy.get('[data-cy=input-data-inicio]').type(formatarData(dataInicio));
    cy.get('[data-cy=input-data-fim]').type(formatarData(dataFim));
    
    // Tentar avançar para o próximo passo
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar mensagem de erro para datas inválidas
    cy.get('[data-cy=erro-data]').should('be.visible');
    cy.get('[data-cy=erro-data]').should('contain', 'A data de fim deve ser posterior à data de início');
  });

  it('deve exibir erro ao falhar na criação da matrícula', () => {
    // Interceptar a chamada POST para simular erro no servidor
    cy.intercept('POST', '**/api/matriculas', {
      statusCode: 500,
      body: { 
        error: true, 
        message: 'Erro interno do servidor ao processar a matrícula' 
      }
    }).as('erroMatricula');
    
    // Preencher o formulário do primeiro passo
    cy.get('[data-cy=input-aluno]').type('Maria Silva');
    cy.get('[data-cy=select-curso]').click();
    cy.get('[data-cy=curso-option-1]').click();
    cy.get('[data-cy=select-plano]').click();
    cy.get('[data-cy=plano-option-1]').click();
    cy.get('[data-cy=input-data-inicio]').type('2024-04-01');
    cy.get('[data-cy=input-data-fim]').type('2025-04-01');
    
    // Clicar no botão de próximo
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar se avançou para o segundo passo (Documentação)
    cy.get('[data-cy=step-title]').should('contain', 'Documentação');
    
    // Simular upload de documentos
    cy.get('[data-cy=upload-documento-rg]').attachFile('documento-rg.pdf');
    cy.get('[data-cy=upload-documento-cpf]').attachFile('documento-cpf.pdf');
    cy.get('[data-cy=upload-documento-comprovante-residencia]')
      .attachFile('comprovante-residencia.pdf');
    
    // Clicar no botão de próximo
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar se avançou para o terceiro passo (Contrato)
    cy.get('[data-cy=step-title]').should('contain', 'Contrato');
    
    // Marcar como lido e aceitar os termos
    cy.get('[data-cy=checkbox-li-contrato]').check();
    cy.get('[data-cy=checkbox-aceito-termos]').check();
    
    // Clicar no botão de próximo
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar se avançou para o quarto passo (Pagamento)
    cy.get('[data-cy=step-title]').should('contain', 'Pagamento');
    
    // Selecionar forma de pagamento
    cy.get('[data-cy=opcao-pagamento-cartao]').click();
    
    // Preencher dados do cartão
    cy.get('[data-cy=input-cartao-numero]').type('4111111111111111');
    cy.get('[data-cy=input-cartao-nome]').type('MARIA SILVA');
    cy.get('[data-cy=input-cartao-validade]').type('12/25');
    cy.get('[data-cy=input-cartao-cvv]').type('123');
    
    // Clicar no botão de finalizar
    cy.get('[data-cy=botao-concluir]').click();
    
    // Aguardar pela chamada de API que irá falhar
    cy.wait('@erroMatricula');
    
    // Verificar se a mensagem de erro é exibida
    cy.get('[data-cy=erro-submit]').should('be.visible');
    cy.get('[data-cy=erro-submit]').should('contain', 'Erro interno do servidor');
  });

  it('deve exibir erro ao falhar no processamento do pagamento', () => {
    // Interceptar a chamada POST para o pagamento simulando erro
    cy.intercept('POST', '**/api/pagamentos/processar', {
      statusCode: 422,
      body: { 
        error: true, 
        message: 'Cartão recusado. Verifique os dados do cartão ou entre em contato com o banco emissor.' 
      }
    }).as('erroPagamento');
    
    // Preencher o formulário completo (passos 1-3) e chegar até o pagamento
    // Passo 1: Dados Básicos
    cy.get('[data-cy=input-aluno]').type('José Santos');
    cy.get('[data-cy=select-curso]').click();
    cy.get('[data-cy=curso-option-1]').click();
    cy.get('[data-cy=select-plano]').click();
    cy.get('[data-cy=plano-option-1]').click();
    cy.get('[data-cy=input-data-inicio]').type('2024-05-01');
    cy.get('[data-cy=input-data-fim]').type('2025-05-01');
    cy.get('[data-cy=botao-proximo]').click();
    
    // Passo 2: Documentação
    cy.get('[data-cy=upload-documento-rg]').attachFile('documento-rg.pdf');
    cy.get('[data-cy=upload-documento-cpf]').attachFile('documento-cpf.pdf');
    cy.get('[data-cy=upload-documento-comprovante-residencia]')
      .attachFile('comprovante-residencia.pdf');
    cy.get('[data-cy=botao-proximo]').click();
    
    // Passo 3: Contrato
    cy.get('[data-cy=checkbox-li-contrato]').check();
    cy.get('[data-cy=checkbox-aceito-termos]').check();
    cy.get('[data-cy=botao-proximo]').click();
    
    // Passo 4: Pagamento
    cy.get('[data-cy=opcao-pagamento-cartao]').click();
    
    // Preencher dados do cartão com valores que causarão falha
    cy.get('[data-cy=input-cartao-numero]').type('4111111111111111');
    cy.get('[data-cy=input-cartao-nome]').type('CARTAO INVALIDO');
    cy.get('[data-cy=input-cartao-validade]').type('12/25');
    cy.get('[data-cy=input-cartao-cvv]').type('123');
    
    // Clicar no botão de finalizar
    cy.get('[data-cy=botao-concluir]').click();
    
    // Aguardar pela chamada de API que irá falhar
    cy.wait('@erroPagamento');
    
    // Verificar se a mensagem de erro específica do pagamento é exibida
    cy.get('[data-cy=erro-pagamento]').should('be.visible');
    cy.get('[data-cy=erro-pagamento]').should('contain', 'Cartão recusado');
  });

  it('deve exibir erro para documentos obrigatórios não enviados', () => {
    // Preencher o primeiro passo
    cy.get('[data-cy=input-aluno]').type('Ana Oliveira');
    cy.get('[data-cy=select-curso]').click();
    cy.get('[data-cy=curso-option-1]').click();
    cy.get('[data-cy=select-plano]').click();
    cy.get('[data-cy=plano-option-1]').click();
    cy.get('[data-cy=input-data-inicio]').type('2024-04-01');
    cy.get('[data-cy=input-data-fim]').type('2025-04-01');
    cy.get('[data-cy=botao-proximo]').click();
    
    // No segundo passo, tentar avançar sem enviar documentos obrigatórios
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar que há mensagem de erro para documentos obrigatórios
    cy.get('[data-cy=erro-documentos-obrigatorios]').should('be.visible');
    cy.get('[data-cy=erro-documentos-obrigatorios]')
      .should('contain', 'Todos os documentos obrigatórios devem ser enviados');
  });
}); 