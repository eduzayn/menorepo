describe('Exemplo de teste E2E', () => {
  beforeEach(() => {
    // Visite a página inicial antes de cada teste
    cy.visit('/');
  });

  it('deve verificar o título da página', () => {
    // Verifique se o título da página está correto
    cy.title().should('include', 'Matrículas');
  });

  it('deve navegar para a página de listagem de matrículas', () => {
    // Encontre o link para a página de matrículas e clique nele
    cy.get('a[href*="matriculas"]').click();
    
    // Verifique se a URL mudou corretamente
    cy.url().should('include', '/matriculas');
    
    // Verifique se a tabela de matrículas foi carregada
    cy.get('table').should('be.visible');
  });
}); 