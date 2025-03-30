/// <reference types="cypress" />

describe('Edunéxia - Navegação do Site', () => {
  beforeEach(() => {
    // Visitar a página inicial antes de cada teste
    cy.visit('/');
  });

  it('deve navegar para a página de planos ao clicar no botão "Conheça nossos planos"', () => {
    // Encontrar e clicar no botão de planos
    cy.contains('Conheça nossos planos').click();
    
    // Verificar se estamos na página correta
    cy.url().should('include', '/planos');
    cy.contains('Planos e Preços').should('be.visible');
  });

  it('deve navegar para a página de contato ao clicar no botão "Agende uma demonstração"', () => {
    // Encontrar e clicar no botão de contato
    cy.contains('Agende uma demonstração').click();
    
    // Verificar se estamos na página correta
    cy.url().should('include', '/contato');
    cy.contains('Entre em contato').should('be.visible');
  });

  it('deve navegar para a página de produto ao clicar em "Saiba mais"', () => {
    // Localizar o card do Sistema de Matrículas e clicar em "Saiba mais"
    cy.contains('Sistema de Matrículas')
      .parent()
      .contains('Saiba mais')
      .click();
    
    // Verificar se estamos na página correta
    cy.url().should('include', '/pagina/sistema-matriculas');
  });

  it('deve navegar para o blog ao clicar em "Ver todos os artigos"', () => {
    // A seção do blog pode não estar visível se não houver posts
    // Tentamos localizar o botão e, se existir, clicamos nele
    cy.contains('Ver todos os artigos').scrollIntoView();
    cy.contains('Ver todos os artigos').click();
    
    // Verificar se estamos na página correta
    cy.url().should('include', '/blog');
    cy.contains('Blog da Edunéxia').should('be.visible');
  });
});

describe('Edunéxia - Menu de Navegação', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve navegar para as páginas principais através do menu', () => {
    // Testar navegação para cada item do menu principal
    cy.contains('a', 'Início').click();
    cy.url().should('include', '/');
    
    cy.contains('a', 'Sobre').click();
    cy.url().should('include', '/sobre');
    
    cy.contains('a', 'Blog').click();
    cy.url().should('include', '/blog');
    
    cy.contains('a', 'Contato').click();
    cy.url().should('include', '/contato');
  });

  it('deve abrir o dropdown de soluções e navegar para as páginas de produtos', () => {
    // Em dispositivos desktop, podemos precisar clicar no menu "Soluções" antes
    // para mostrar o dropdown
    cy.contains('Soluções').trigger('mouseover');
    
    // Aguardar o submenu ficar visível
    cy.contains('Sistema de Matrículas').should('be.visible').click();
    cy.url().should('include', '/pagina/sistema-matriculas');
    
    cy.visit('/');
    cy.contains('Soluções').trigger('mouseover');
    cy.contains('Portal do Aluno').should('be.visible').click();
    cy.url().should('include', '/pagina/portal-aluno');
    
    cy.visit('/');
    cy.contains('Soluções').trigger('mouseover');
    cy.contains('Gestão Financeira').should('be.visible').click();
    cy.url().should('include', '/pagina/gestao-financeira');
  });
});

describe('Edunéxia - Página de Planos', () => {
  beforeEach(() => {
    cy.visit('/planos');
  });

  it('deve mostrar os três planos principais', () => {
    cy.contains('Essencial').should('be.visible');
    cy.contains('Profissional').should('be.visible');
    cy.contains('Enterprise').should('be.visible');
  });

  it('deve navegar para a página de contato com o plano selecionado', () => {
    // Clicar no botão do plano Essencial
    cy.contains('h3', 'Essencial')
      .parent()
      .parent()
      .contains('Solicitar demonstração')
      .click();
    
    cy.url().should('include', '/contato');
    cy.url().should('include', 'plano=essencial');
  });
});

describe('Edunéxia - Footer', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve navegar para as páginas através dos links do footer', () => {
    // Verificar links da seção Soluções
    cy.get('footer').contains('Sistema de Matrículas').click();
    cy.url().should('include', '/matriculas');
    
    cy.visit('/');
    cy.get('footer').contains('Portal do Aluno').click();
    cy.url().should('include', '/portal-do-aluno');
    
    // Verificar links da seção Empresa
    cy.visit('/');
    cy.get('footer').contains('Sobre Nós').click();
    cy.url().should('include', '/sobre');
    
    cy.visit('/');
    cy.get('footer').contains('Blog').click();
    cy.url().should('include', '/blog');
    
    // Verificar links do rodapé
    cy.visit('/');
    cy.get('footer').contains('Política de Privacidade').click();
    cy.url().should('include', '/privacidade');
  });
}); 