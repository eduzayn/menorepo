/// <reference types="cypress" />

describe('Navegação no Módulo de Comunicação', () => {
  beforeEach(() => {
    // Visitar a página inicial do módulo de comunicação
    cy.visit('/')
    
    // Simular login se necessário
    // cy.login('usuario@teste.com', 'senha123')
  })

  it('deve navegar para a página de conversas', () => {
    // Clicar no item de menu de conversas
    cy.get('[data-cy=menu-conversas]').click()
    
    // Verificar se foi redirecionado para a URL correta
    cy.url().should('include', '/conversas')
    
    // Verificar se o componente de lista de conversas está visível
    cy.get('[data-cy=conversation-list]').should('be.visible')
  })

  it('deve navegar para a página de grupos', () => {
    // Clicar no item de menu de grupos
    cy.get('[data-cy=menu-grupos]').click()
    
    // Verificar se foi redirecionado para a URL correta
    cy.url().should('include', '/grupos')
    
    // Verificar se o componente de lista de grupos está visível
    cy.get('[data-cy=grupos-list]').should('be.visible')
  })

  it('deve pesquisar por conversas', () => {
    // Navegar para a página de conversas
    cy.get('[data-cy=menu-conversas]').click()
    
    // Digitar no campo de busca
    cy.get('[data-cy=search-input]').type('João Silva')
    
    // Verificar que os resultados da busca são exibidos
    cy.get('[data-cy=conversation-item]').should('contain', 'João Silva')
  })

  it('deve exibir notificações não lidas', () => {
    // Verificar que o indicador de notificações existe
    cy.get('[data-cy=notificacoes-badge]').should('exist')
    
    // Clicar no ícone de notificações
    cy.get('[data-cy=notificacoes-icon]').click()
    
    // Verificar que o painel de notificações é exibido
    cy.get('[data-cy=notificacoes-panel]').should('be.visible')
  })
}) 