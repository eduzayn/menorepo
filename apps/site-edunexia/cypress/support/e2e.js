// ***********************************************************
// Este arquivo de suporte/e2e.js é processado e
// carregado automaticamente antes de seus arquivos de teste.
//
// Este é um ótimo lugar para colocar configuração global e
// comportamento que modifica o Cypress.
//
// Leia mais em:
// https://on.cypress.io/configuration
// ***********************************************************

// Importar comandos.js usando ES2015 para permitir importar comandos personalizados
import './commands'

// Desativar screenshots em caso de falha no teste (opcional)
// Cypress.Screenshot.defaults({
//   screenshotOnRunFailure: false
// })

// Ignorar erros não críticos durante os testes
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornando false evita que o Cypress falhe no teste
  // Esta configuração é útil quando o site tem erros JS não relacionados aos testes
  return false
})

// Configurações para lidar com solicitações de rede
// Cypress.Server.defaults({
//   delay: 500,
//   force404: false,
// })

// Se necessário, configurar variáveis globais
before(() => {
  // Definir mocks ou estado inicial global aqui
  window.mockApiEnabled = true
})

// Limpar estado após cada teste
afterEach(() => {
  // Limpar localStorage após cada teste
  cy.clearLocalStorage()
}) 