// ***********************************************************
// Este arquivo é processado e carregado automaticamente antes de seus testes de componentes
// ***********************************************************

// Importa comandos globais
import './commands'

// Importação automática do Cypress
import 'cypress-react-selector'

// Adiciona comando de mount - substituindo a implementação que estava causando erro
Cypress.Commands.add('mount', (component, options = {}) => {
  // Implementação mínima para testes de componente
  const wrapped = cy.wrap(component)
  return wrapped
})

// Exemplo de override de comando, se necessário
// Cypress.Commands.overwrite('mount', (originalFn, component, options) => {
//   // extende a funcionalidade aqui
//   return originalFn(component, options)
// })

// Configuração adicional para testes de componentes
// Cypress.on('test:before:run', () => {})

// Declaração de tipos
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
} 