import './commands'

// Função para impedir as mensagens do Cypress sendo registradas no console
// https://docs.cypress.io/api/events/catalog-of-events#Uncaught-Exceptions
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  console.error('Erro não tratado:', err)
  return false
}) 