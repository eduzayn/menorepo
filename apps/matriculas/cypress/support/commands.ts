/**
 * Arquivo de comandos personalizados do Cypress para o módulo Matrículas.
 */

// -- Suporte para Typescript --
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para login do aluno
       * @param email - Email do aluno
       * @param password - Senha do aluno
       */
      loginAluno(email: string, password: string): Chainable<void>;

      /**
       * Comando personalizado para login do administrador
       * @param email - Email do administrador
       * @param password - Senha do administrador
       */
      loginAdmin(email: string, password: string): Chainable<void>;

      /**
       * Comando personalizado para criar uma matrícula
       * @param cursoId - ID do curso
       * @param alunoId - ID do aluno
       */
      criarMatricula(cursoId: string, alunoId: string): Chainable<string>;
    }
  }
}

// Comando personalizado para login de aluno
Cypress.Commands.add('loginAluno', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-button]').click();
  
  // Esperar pelo redirecionamento após o login
  cy.url().should('include', '/aluno');
});

// Comando personalizado para login de administrador
Cypress.Commands.add('loginAdmin', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-button]').click();
  
  // Esperar pelo redirecionamento após o login
  cy.url().should('include', '/admin');
});

// Comando personalizado para criar uma matrícula
Cypress.Commands.add('criarMatricula', (cursoId, alunoId) => {
  cy.loginAdmin('admin@edunexia.com', 'senha123');
  cy.visit('/admin/matriculas/nova');
  
  // Preencher o formulário
  cy.get('[data-testid=curso-select]').select(cursoId);
  cy.get('[data-testid=aluno-select]').select(alunoId);
  cy.get('[data-testid=submit-button]').click();
  
  // Esperar pela confirmação de sucesso
  cy.get('[data-testid=mensagem-sucesso]').should('exist');
  
  // Retornar o ID da nova matrícula
  return cy.get('[data-testid=matricula-id]').invoke('text');
});

export {};