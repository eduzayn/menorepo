// ***********************************************
// Este exemplo de commands.js mostra como
// criar vários comandos personalizados e sobrescrever
// comandos existentes.
//
// Para mais detalhes, verifique:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Comando para simular acesso de usuário logado
Cypress.Commands.add('loginUsuario', (tipo = 'admin') => {
  // Simulação de login usando localStorage
  window.localStorage.setItem('edunexia:auth', JSON.stringify({
    usuario: {
      id: '1',
      nome: tipo === 'admin' ? 'Administrador Teste' : 'Usuário Teste',
      email: tipo === 'admin' ? 'admin@edunexia.com.br' : 'usuario@email.com',
      tipo: tipo
    },
    token: 'token-simulado-para-testes',
    expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }));
});

// Comando para esperar carregar a página completamente
Cypress.Commands.add('esperarCarregamento', () => {
  cy.get('body').should('not.have.class', 'loading');
  cy.get('#loader', { timeout: 10000 }).should('not.exist');
}); 