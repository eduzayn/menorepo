/// <reference types="cypress" />
import React from 'react';
import { ChatWindow } from '../../src/components/ChatWindow';
import { Conversa, Mensagem } from '../../src/types/comunicacao';

describe('ChatWindow Component', () => {
  // Mock dos dados
  const mockConversa: Conversa = {
    id: 'conv-1',
    titulo: 'Conversa Teste',
    participantes: [
      { id: 'user-1', nome: 'Usuário 1' },
      { id: 'user-2', nome: 'Usuário 2' }
    ],
    status: 'ATIVO',
    digitando: null,
    nao_lidas: 0,
    ultima_mensagem: { id: 'msg-1', conteudo: 'Olá', criado_at: new Date().toISOString() },
    criado_at: new Date().toISOString(),
    atualizado_at: new Date().toISOString(),
    usuario_id: 'user-1'
  };

  const mockMensagens: Mensagem[] = [
    {
      id: 'msg-1',
      conversa_id: 'conv-1',
      remetente_id: 'user-1',
      conteudo: 'Olá, tudo bem?',
      lida: true,
      criado_at: new Date().toISOString()
    },
    {
      id: 'msg-2',
      conversa_id: 'conv-1',
      remetente_id: 'user-2',
      conteudo: 'Tudo bem e você?',
      lida: false,
      criado_at: new Date().toISOString()
    }
  ];

  // Funções mock com spies do Cypress
  const onEnviarMensagemSpy = cy.spy().as('onEnviarMensagemSpy');
  const onMarcarComoLidaSpy = cy.spy().as('onMarcarComoLidaSpy');
  const onIndicarDigitandoSpy = cy.spy().as('onIndicarDigitandoSpy');

  beforeEach(() => {
    // Montar o componente antes de cada teste
    cy.mount(
      <div className="h-[600px] w-[800px]">
        <ChatWindow
          conversa={mockConversa}
          mensagens={mockMensagens}
          onEnviarMensagem={onEnviarMensagemSpy}
          onMarcarComoLida={onMarcarComoLidaSpy}
          onIndicarDigitando={onIndicarDigitandoSpy}
        />
      </div>
    );
  });

  it('deve renderizar o cabeçalho corretamente', () => {
    cy.contains('Conversa Teste').should('be.visible');
    cy.contains('2 participantes').should('be.visible');
    cy.contains('ATIVO').should('be.visible');
  });

  it('deve exibir as mensagens da conversa', () => {
    cy.contains('Olá, tudo bem?').should('be.visible');
    cy.contains('Tudo bem e você?').should('be.visible');
  });

  it('deve chamar onMarcarComoLida ao montar o componente', () => {
    cy.get('@onMarcarComoLidaSpy').should('have.been.called');
  });

  it('deve enviar mensagem quando o formulário é submetido', () => {
    const mensagemTeste = 'Nova mensagem de teste';
    
    // Digitar uma mensagem
    cy.get('input[placeholder="Digite sua mensagem..."]').type(mensagemTeste);
    
    // Verificar indicação de digitação
    cy.get('@onIndicarDigitandoSpy').should('have.been.calledWith', true);
    
    // Enviar a mensagem
    cy.get('form').submit();
    
    // Verificar se a função foi chamada com o texto correto
    cy.get('@onEnviarMensagemSpy').should('have.been.calledWith', mensagemTeste);
    
    // Verificar se o campo foi limpo
    cy.get('input[placeholder="Digite sua mensagem..."]').should('have.value', '');
  });

  it('deve indicar quando parou de digitar ao tirar o foco do campo', () => {
    // Digitar uma mensagem
    cy.get('input[placeholder="Digite sua mensagem..."]').type('Digitando...');
    
    // Verificar indicação de digitação
    cy.get('@onIndicarDigitandoSpy').should('have.been.calledWith', true);
    
    // Tirar o foco do campo
    cy.get('input[placeholder="Digite sua mensagem..."]').blur();
    
    // Verificar se indicou que parou de digitar
    cy.get('@onIndicarDigitandoSpy').should('have.been.calledWith', false);
  });

  it('não deve enviar mensagem quando o campo está vazio', () => {
    // Tentar enviar o formulário sem preencher o campo
    cy.get('form').submit();
    
    // Verificar que a função não foi chamada
    cy.get('@onEnviarMensagemSpy').should('not.have.been.called');
  });

  it('deve abrir chamada de vídeo ao clicar no botão', () => {
    // Clicar no botão de chamada
    cy.contains('Chamada').click();
    
    // Verificar se o modal de chamada de vídeo é exibido
    cy.get('[data-testid="video-call"]').should('be.visible');
    
    // Fechar a chamada
    cy.get('button[title="Fechar"]').click();
    
    // Verificar se o modal foi fechado
    cy.get('[data-testid="video-call"]').should('not.exist');
  });

  it('deve exibir indicador de digitação quando alguém está digitando', () => {
    // Remonta o componente com alguém digitando
    const conversaComDigitacao = {
      ...mockConversa,
      digitando: 'user-2'
    };
    
    cy.mount(
      <div className="h-[600px] w-[800px]">
        <ChatWindow
          conversa={conversaComDigitacao}
          mensagens={mockMensagens}
          onEnviarMensagem={onEnviarMensagemSpy}
          onMarcarComoLida={onMarcarComoLidaSpy}
          onIndicarDigitando={onIndicarDigitandoSpy}
        />
      </div>
    );
    
    // Verificar se o indicador de digitação é exibido
    cy.contains('Usuário 2 está digitando...').should('be.visible');
  });
}); 