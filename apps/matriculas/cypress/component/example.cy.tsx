import React from 'react';
import { mount } from 'cypress/react';

// Componente de exemplo para testar
const ExemploComponente = () => {
  return (
    <div className="container">
      <h1 data-testid="titulo">Sistema de Matrículas</h1>
      <button data-testid="botao-acao">Realizar Ação</button>
    </div>
  );
};

describe('Exemplo de Componente', () => {
  it('deve renderizar corretamente', () => {
    // Montar o componente
    mount(<ExemploComponente />);
    
    // Verificar se o título está correto
    cy.get('[data-testid=titulo]').should('have.text', 'Sistema de Matrículas');
    
    // Verificar se o botão existe
    cy.get('[data-testid=botao-acao]').should('be.visible');
  });
  
  it('deve responder ao clique', () => {
    // Criar um spy para monitorar cliques
    const onClick = cy.spy().as('clickSpy');
    
    // Montar um componente com o evento de clique monitorado
    mount(
      <div>
        <button data-testid="botao-teste" onClick={onClick}>
          Clique em mim
        </button>
      </div>
    );
    
    // Clicar no botão
    cy.get('[data-testid=botao-teste]').click();
    
    // Verificar se o spy foi chamado
    cy.get('@clickSpy').should('have.been.called');
  });
}); 