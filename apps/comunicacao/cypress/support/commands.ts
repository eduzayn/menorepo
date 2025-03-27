// ***********************************************
// Este arquivo contém comandos personalizados do Cypress
// ***********************************************

// Exemplo de comando personalizado: adicionar um comando para login
Cypress.Commands.add('login', (email: string, senha: string) => {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type(email)
  cy.get('[data-cy=senha-input]').type(senha)
  cy.get('[data-cy=login-button]').click()
})

// Comando para verificar notificações na interface
Cypress.Commands.add('verificarNotificacao', (texto: string) => {
  cy.get('[data-cy=notificacao]').should('contain', texto)
})

// Declaração para TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, senha: string): Chainable<void>
      verificarNotificacao(texto: string): Chainable<void>
    }
  }
} 