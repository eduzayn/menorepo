/**
 * Arquivo de suporte para testes E2E do Cypress no módulo Matrículas.
 */

// Importa os comandos personalizados
import './commands';

// Desabilita captura de falha de rede para melhorar a experiência de teste
Cypress.on('uncaught:exception', () => {
  // Retornar false evita que o Cypress falhe o teste quando 
  // uma exceção não tratada é lançada 
  return false;
}); 