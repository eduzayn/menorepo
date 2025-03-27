/// <reference types="cypress" />

describe('Fluxo de Matrícula', () => {
  beforeEach(() => {
    // Interceptar chamadas de API para os dados necessários
    cy.intercept('GET', '**/api/cursos*', { fixture: 'cursos.json' }).as('getCursos');
    cy.intercept('GET', '**/api/planos*', { fixture: 'planos.json' }).as('getPlanos');
    cy.intercept('POST', '**/api/matriculas', { 
      statusCode: 201, 
      body: { id: 'nova-matricula-123' } 
    }).as('criarMatricula');
    
    // Visitar a página de nova matrícula
    cy.visit('/matriculas/nova');
  });

  it('deve completar todo o fluxo de matrícula', () => {
    // Verificar se o formulário de matrícula está visível
    cy.get('[data-cy=matricula-form-multi-step]').should('be.visible');
    
    // Verificar se o primeiro passo está ativo
    cy.get('[data-cy=step-title]').should('contain', 'Dados Básicos');
    
    // Preencher o formulário do primeiro passo
    cy.get('[data-cy=input-aluno]').type('Maria Silva');
    cy.get('[data-cy=select-curso]').click();
    cy.get('[data-cy=curso-option-1]').click();
    cy.get('[data-cy=select-plano]').click();
    cy.get('[data-cy=plano-option-1]').click();
    cy.get('[data-cy=input-data-inicio]').type('2024-04-01');
    cy.get('[data-cy=input-data-fim]').type('2025-04-01');
    cy.get('[data-cy=textarea-observacoes]').type('Observações de teste para o Cypress');
    
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
    
    // Visualizar o contrato
    cy.get('[data-cy=contrato-viewer]').should('be.visible');
    
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
    
    // Esperar pela chamada de API
    cy.wait('@criarMatricula');
    
    // Verificar se foi redirecionado para a página de sucesso
    cy.url().should('include', '/matriculas/sucesso');
    cy.get('[data-cy=mensagem-sucesso]').should('contain', 'Matrícula realizada com sucesso');
  });

  it('deve permitir navegar entre os passos do formulário', () => {
    // Preencher dados básicos
    cy.get('[data-cy=input-aluno]').type('José Santos');
    cy.get('[data-cy=select-curso]').click();
    cy.get('[data-cy=curso-option-1]').click();
    cy.get('[data-cy=select-plano]').click();
    cy.get('[data-cy=plano-option-1]').click();
    
    // Avançar para o próximo passo
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar se chegou no passo de documentação
    cy.get('[data-cy=step-title]').should('contain', 'Documentação');
    
    // Voltar para o passo anterior
    cy.get('[data-cy=botao-voltar]').click();
    
    // Verificar se voltou para o primeiro passo
    cy.get('[data-cy=step-title]').should('contain', 'Dados Básicos');
    
    // Verificar se os dados preenchidos ainda estão presentes
    cy.get('[data-cy=input-aluno]').should('have.value', 'José Santos');
  });

  it('deve validar campos obrigatórios no formulário', () => {
    // Tentar avançar sem preencher os campos obrigatórios
    cy.get('[data-cy=botao-proximo]').click();
    
    // Verificar se as mensagens de erro são exibidas
    cy.get('[data-cy=erro-aluno]').should('be.visible');
    cy.get('[data-cy=erro-curso]').should('be.visible');
    cy.get('[data-cy=erro-plano]').should('be.visible');
    
    // Preencher um campo e verificar se o erro desaparece
    cy.get('[data-cy=input-aluno]').type('Ana Clara');
    cy.get('[data-cy=erro-aluno]').should('not.exist');
  });
}); 