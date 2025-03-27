/// <reference types="cypress" />

describe('Funcionalidade de Chat', () => {
  beforeEach(() => {
    // Mock da API de autenticação
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          id: 'user-1',
          nome: 'Usuário Teste',
          email: 'usuario@teste.com',
          tipo: 'ATENDENTE'
        }
      }
    }).as('loginRequest');

    // Mock das conversas
    cy.intercept('GET', '**/api/conversas/listar', {
      statusCode: 200,
      body: [
        {
          id: 'conv-1',
          titulo: 'Conversa com João',
          participantes: [
            { id: 'user-1', nome: 'Usuário Teste', email: 'usuario@teste.com', tipo: 'ATENDENTE', online: true },
            { id: 'aluno-1', nome: 'João Silva', email: 'joao@teste.com', tipo: 'ALUNO', online: true }
          ],
          status: 'ATIVO',
          digitando: null,
          nao_lidas: 2,
          ultima_mensagem: {
            id: 'msg-1',
            conteudo: 'Olá, precisava de ajuda',
            criado_at: new Date().toISOString()
          },
          criado_at: new Date().toISOString(),
          atualizado_at: new Date().toISOString(),
          usuario_id: 'user-1'
        },
        {
          id: 'conv-2',
          titulo: 'Conversa com Maria',
          participantes: [
            { id: 'user-1', nome: 'Usuário Teste', email: 'usuario@teste.com', tipo: 'ATENDENTE', online: true },
            { id: 'aluno-2', nome: 'Maria Souza', email: 'maria@teste.com', tipo: 'ALUNO', online: false }
          ],
          status: 'ATIVO',
          digitando: null,
          nao_lidas: 0,
          ultima_mensagem: {
            id: 'msg-2',
            conteudo: 'Obrigada pela ajuda!',
            criado_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          criado_at: new Date().toISOString(),
          atualizado_at: new Date().toISOString(),
          usuario_id: 'user-1'
        }
      ]
    }).as('listarConversas');

    // Mock das mensagens da conversa
    cy.intercept('GET', '**/api/conversas/*/mensagens', {
      statusCode: 200,
      body: [
        {
          id: 'msg-1',
          conversa_id: 'conv-1',
          remetente_id: 'aluno-1',
          conteudo: 'Olá, tudo bem? Precisava de ajuda com a matrícula.',
          tipo: 'TEXTO',
          lida: false,
          criado_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          atualizado_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2',
          conversa_id: 'conv-1',
          remetente_id: 'aluno-1',
          conteudo: 'Estou com dificuldade para anexar meus documentos.',
          tipo: 'TEXTO',
          lida: false,
          criado_at: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
          atualizado_at: new Date(Date.now() - 9 * 60 * 1000).toISOString()
        }
      ]
    }).as('listarMensagens');

    // Mock para envio de mensagem
    cy.intercept('POST', '**/api/mensagens/enviar', {
      statusCode: 200,
      body: {
        id: 'msg-3',
        conversa_id: 'conv-1',
        remetente_id: 'user-1',
        conteudo: '@MENSAGEM',  // Será substituído
        tipo: 'TEXTO',
        lida: true,
        criado_at: new Date().toISOString(),
        atualizado_at: new Date().toISOString()
      }
    }).as('enviarMensagem');

    // Mock para marcar como lida
    cy.intercept('POST', '**/api/conversas/*/ler', {
      statusCode: 200,
      body: { success: true }
    }).as('marcarComoLida');

    // Login na aplicação
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type('usuario@teste.com');
    cy.get('[data-cy=password-input]').type('senha123');
    cy.get('[data-cy=login-button]').click();
    cy.wait('@loginRequest');

    // Navegar para a página de conversas
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=menu-conversas]').click();
  });

  it('deve listar as conversas disponíveis', () => {
    // Verificar se as conversas são carregadas
    cy.wait('@listarConversas');
    cy.get('[data-cy=conversation-list]').should('be.visible');
    cy.get('[data-cy=conversation-item]').should('have.length', 2);
    
    // Verificar dados da primeira conversa
    cy.get('[data-cy=conversation-item]').first().within(() => {
      cy.contains('Conversa com João').should('be.visible');
      cy.contains('Olá, precisava de ajuda').should('be.visible');
      cy.get('[data-cy=unread-badge]').should('contain', '2');
    });
  });

  it('deve carregar mensagens ao clicar em uma conversa', () => {
    // Clicar na primeira conversa
    cy.get('[data-cy=conversation-item]').first().click();
    
    // Verificar se as mensagens são carregadas
    cy.wait('@listarMensagens');
    cy.wait('@marcarComoLida');
    
    // Verificar se o título da conversa aparece no cabeçalho
    cy.get('[data-cy=chat-header]').should('contain', 'Conversa com João');
    
    // Verificar se as mensagens são exibidas
    cy.get('[data-cy=message-item]').should('have.length', 2);
    cy.contains('Olá, tudo bem? Precisava de ajuda com a matrícula.').should('be.visible');
    cy.contains('Estou com dificuldade para anexar meus documentos.').should('be.visible');
  });

  it('deve permitir enviar mensagens', () => {
    // Clicar na primeira conversa
    cy.get('[data-cy=conversation-item]').first().click();
    cy.wait('@listarMensagens');
    
    // Digitar e enviar uma mensagem
    const mensagemTeste = 'Olá, vou ajudar você com os documentos!';
    cy.get('[data-cy=message-input]').type(mensagemTeste);
    cy.get('[data-cy=send-button]').click();
    
    // Verificar se a requisição de envio foi feita
    cy.wait('@enviarMensagem').then((interception) => {
      // Verificar conteúdo enviado
      expect(interception.request.body.conteudo).to.equal(mensagemTeste);
    });
    
    // Verificar se a mensagem aparece na conversa
    cy.contains(mensagemTeste).should('be.visible');
  });

  it('deve mostrar indicador de digitação', () => {
    // Clicar na primeira conversa
    cy.get('[data-cy=conversation-item]').first().click();
    cy.wait('@listarMensagens');
    
    // Mock para atualizar status de digitação
    cy.intercept('POST', '**/api/conversas/*/digitando', {
      statusCode: 200,
      body: { success: true }
    }).as('indicarDigitando');
    
    // Digitar na caixa de mensagem
    cy.get('[data-cy=message-input]').type('Digitando...');
    
    // Verificar se a requisição de status de digitação foi feita
    cy.wait('@indicarDigitando');
  });

  it('deve permitir usar respostas rápidas', () => {
    // Mock para carregar respostas rápidas
    cy.intercept('GET', '**/api/respostas-rapidas', {
      statusCode: 200,
      body: [
        { id: 'resp-1', titulo: 'Saudação', conteudo: 'Olá, como posso ajudar?' },
        { id: 'resp-2', titulo: 'Documentos', conteudo: 'Para enviar documentos, utilize a área de upload no Portal do Aluno.' }
      ]
    }).as('carregarRespostas');
    
    // Clicar na primeira conversa
    cy.get('[data-cy=conversation-item]').first().click();
    cy.wait('@listarMensagens');
    
    // Abrir seletor de respostas rápidas
    cy.get('[data-cy=respostas-rapidas-select]').click();
    cy.wait('@carregarRespostas');
    
    // Selecionar uma resposta rápida
    cy.contains('Documentos').click();
    
    // Verificar se o texto foi adicionado ao campo de mensagem
    cy.get('[data-cy=message-input]').should('have.value', 'Para enviar documentos, utilize a área de upload no Portal do Aluno.');
    
    // Enviar a mensagem
    cy.get('[data-cy=send-button]').click();
    
    // Verificar se a mensagem foi enviada
    cy.wait('@enviarMensagem');
    cy.contains('Para enviar documentos, utilize a área de upload no Portal do Aluno.').should('be.visible');
  });

  it('deve filtrar conversas ao pesquisar', () => {
    // Mock da pesquisa
    cy.intercept('GET', '**/api/conversas/buscar?termo=Maria', {
      statusCode: 200,
      body: [
        {
          id: 'conv-2',
          titulo: 'Conversa com Maria',
          participantes: [
            { id: 'user-1', nome: 'Usuário Teste', email: 'usuario@teste.com', tipo: 'ATENDENTE', online: true },
            { id: 'aluno-2', nome: 'Maria Souza', email: 'maria@teste.com', tipo: 'ALUNO', online: false }
          ],
          status: 'ATIVO',
          digitando: null,
          nao_lidas: 0,
          ultima_mensagem: {
            id: 'msg-2',
            conteudo: 'Obrigada pela ajuda!',
            criado_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          criado_at: new Date().toISOString(),
          atualizado_at: new Date().toISOString(),
          usuario_id: 'user-1'
        }
      ]
    }).as('buscarConversas');
    
    // Pesquisar por Maria
    cy.get('[data-cy=search-input]').type('Maria');
    cy.wait('@buscarConversas');
    
    // Verificar resultados filtrados
    cy.get('[data-cy=conversation-item]').should('have.length', 1);
    cy.get('[data-cy=conversation-item]').should('contain', 'Conversa com Maria');
  });
}); 