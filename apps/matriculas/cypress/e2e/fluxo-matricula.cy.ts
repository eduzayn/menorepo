/// <reference types="cypress" />

describe('Fluxo de Matrícula', () => {
  beforeEach(() => {
    // Interceptar as chamadas de API para mock
    cy.intercept('GET', '/api/alunos/buscar*', { fixture: 'alunos.json' }).as('buscarAlunos');
    cy.intercept('GET', '/api/cursos', { fixture: 'cursos.json' }).as('listarCursos');
    cy.intercept('GET', '/api/planos-pagamento', { fixture: 'planos-pagamento.json' }).as('listarPlanos');
    cy.intercept('POST', '/api/documentos/upload', { success: true, id: 'doc-123' }).as('uploadDocumento');
    cy.intercept('POST', '/api/matriculas', { 
      success: true, 
      matriculaId: 'matricula-123',
      mensagem: 'Matrícula realizada com sucesso!'
    }).as('criarMatricula');
    cy.intercept('GET', '/api/boletos/matricula/*', { fixture: 'boletos.json' }).as('listarBoletos');
    cy.intercept('POST', '/api/boletos/gerar', { 
      success: true, 
      codigoBoleto: '34191.79001 01043.510047 91020.150008 9 84760026000',
      codigoPix: '00020101021226930014br.gov.bcb.pix2571', 
      url: 'https://exemplo.com/boleto/123456'
    }).as('gerarBoleto');
    
    // Login na plataforma (assumindo que temos uma rota de login configurada)
    cy.login('coordenador@edunexia.com', 'senha123');
    
    // Navegar para a página de matrículas
    cy.visit('/matriculas/nova');
  });

  it('deve completar todo o fluxo de matrícula com sucesso', () => {
    // Etapa 1: Buscar e selecionar aluno
    cy.get('[data-testid="busca-aluno-input"]').type('Silva');
    cy.wait('@buscarAlunos');
    
    // Selecionar o primeiro aluno da lista
    cy.get('[data-testid="aluno-resultado-item"]').first().click();
    cy.get('[data-testid="confirmar-aluno-btn"]').click();
    
    // Verificar se o modal de confirmação aparece
    cy.get('[data-testid="modal-confirmacao"]').should('be.visible');
    cy.get('[data-testid="confirmar-dados-btn"]').click();
    
    // Etapa 2: Selecionar curso
    cy.wait('@listarCursos');
    
    // Selecionar o primeiro curso da lista
    cy.get('[data-testid="curso-card"]').first().click();
    cy.get('[data-testid="confirmar-curso-btn"]').click();
    
    // Etapa 3: Selecionar plano de pagamento
    cy.wait('@listarPlanos');
    
    // Selecionar o plano mensal
    cy.get('[data-testid="plano-pagamento-card"]').contains('Mensal').click();
    cy.get('[data-testid="confirmar-plano-btn"]').click();
    
    // Etapa 4: Upload de documentos
    // Simular upload de RG
    cy.get('[data-testid="upload-rg"]').attachFile('documento-rg.jpg');
    cy.wait('@uploadDocumento');
    cy.get('[data-testid="status-upload-rg"]').should('contain', 'Enviado com sucesso');
    
    // Simular upload de CPF
    cy.get('[data-testid="upload-cpf"]').attachFile('documento-cpf.jpg');
    cy.wait('@uploadDocumento');
    cy.get('[data-testid="status-upload-cpf"]').should('contain', 'Enviado com sucesso');
    
    // Simular upload de comprovante de residência
    cy.get('[data-testid="upload-comprovante"]').attachFile('documento-residencia.jpg');
    cy.wait('@uploadDocumento');
    cy.get('[data-testid="status-upload-comprovante"]').should('contain', 'Enviado com sucesso');
    
    // Avançar para próxima etapa
    cy.get('[data-testid="continuar-documentos-btn"]').click();
    
    // Etapa 5: Visualizar e aceitar contrato
    // Verificar se o contrato está visível
    cy.get('[data-testid="contrato-preview"]').should('be.visible');
    
    // Marcar o checkbox de aceitação dos termos
    cy.get('[data-testid="aceitar-contrato-checkbox"]').check();
    
    // Simular assinatura digital
    cy.get('[data-testid="assinatura-digital-pad"]').click().drag(200, 50, { force: true });
    
    // Finalizar matrícula
    cy.get('[data-testid="finalizar-matricula-btn"]').click();
    
    // Aguardar a chamada de API para criação da matrícula
    cy.wait('@criarMatricula');
    
    // Verificar se foi redirecionado para a página de confirmação
    cy.url().should('include', '/matriculas/confirmacao');
    
    // Verificar mensagem de sucesso
    cy.get('[data-testid="mensagem-sucesso"]').should('contain', 'Matrícula realizada com sucesso');
    
    // Clicar no botão para gerar boleto
    cy.get('[data-testid="gerar-boleto-btn"]').click();
    cy.wait('@gerarBoleto');
    
    // Verificar se opções de pagamento estão disponíveis
    cy.get('[data-testid="visualizar-boleto-btn"]').should('be.visible');
    cy.get('[data-testid="copiar-pix-btn"]').should('be.visible');
    
    // Testar copiar código PIX
    cy.get('[data-testid="copiar-pix-btn"]').click();
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });
    
    // Verificar notificação de código copiado
    cy.get('[data-testid="notificacao"]').should('contain', 'Código PIX copiado');
  });

  it('deve exibir erro ao falhar no upload de documentos', () => {
    // Sobreescrever interceptação para simular falha
    cy.intercept('POST', '/api/documentos/upload', {
      statusCode: 500,
      body: { 
        success: false, 
        mensagem: 'Erro ao processar o documento. Tente novamente.' 
      }
    }).as('uploadDocumentoFalha');
    
    // Etapa 1: Buscar e selecionar aluno (reutilizamos código)
    cy.get('[data-testid="busca-aluno-input"]').type('Silva');
    cy.wait('@buscarAlunos');
    cy.get('[data-testid="aluno-resultado-item"]').first().click();
    cy.get('[data-testid="confirmar-aluno-btn"]').click();
    cy.get('[data-testid="modal-confirmacao"]').should('be.visible');
    cy.get('[data-testid="confirmar-dados-btn"]').click();
    
    // Etapa 2: Selecionar curso
    cy.wait('@listarCursos');
    cy.get('[data-testid="curso-card"]').first().click();
    cy.get('[data-testid="confirmar-curso-btn"]').click();
    
    // Etapa 3: Selecionar plano de pagamento
    cy.wait('@listarPlanos');
    cy.get('[data-testid="plano-pagamento-card"]').contains('Mensal').click();
    cy.get('[data-testid="confirmar-plano-btn"]').click();
    
    // Etapa 4: Upload de documentos
    // Simular upload com falha
    cy.get('[data-testid="upload-rg"]').attachFile('documento-rg.jpg');
    cy.wait('@uploadDocumentoFalha');
    
    // Verificar mensagem de erro
    cy.get('[data-testid="status-upload-rg"]').should('contain', 'Erro ao processar');
    cy.get('[data-testid="erro-upload-mensagem"]').should('be.visible');
    
    // Verificar que botão de continuar está desabilitado
    cy.get('[data-testid="continuar-documentos-btn"]').should('be.disabled');
    
    // Tentar novamente com interceptação de sucesso
    cy.intercept('POST', '/api/documentos/upload', { success: true, id: 'doc-123' }).as('uploadDocumentoRetry');
    
    // Clicar no botão de tentar novamente
    cy.get('[data-testid="tentar-novamente-btn"]').click();
    cy.get('[data-testid="upload-rg"]').attachFile('documento-rg.jpg');
    cy.wait('@uploadDocumentoRetry');
    
    // Verificar que agora foi bem-sucedido
    cy.get('[data-testid="status-upload-rg"]').should('contain', 'Enviado com sucesso');
  });

  it('deve verificar a obrigatoriedade de todos os campos', () => {
    // Tentar avançar sem selecionar um aluno
    cy.get('[data-testid="confirmar-aluno-btn"]').click();
    cy.get('[data-testid="erro-selecao-aluno"]').should('be.visible');
    
    // Selecionar aluno
    cy.get('[data-testid="busca-aluno-input"]').type('Silva');
    cy.wait('@buscarAlunos');
    cy.get('[data-testid="aluno-resultado-item"]').first().click();
    cy.get('[data-testid="confirmar-aluno-btn"]').click();
    cy.get('[data-testid="modal-confirmacao"]').should('be.visible');
    cy.get('[data-testid="confirmar-dados-btn"]').click();
    
    // Tentar avançar sem selecionar um curso
    cy.get('[data-testid="confirmar-curso-btn"]').click();
    cy.get('[data-testid="erro-selecao-curso"]').should('be.visible');
    
    // Selecionar curso
    cy.get('[data-testid="curso-card"]').first().click();
    cy.get('[data-testid="confirmar-curso-btn"]').click();
    
    // Tentar avançar sem selecionar plano de pagamento
    cy.get('[data-testid="confirmar-plano-btn"]').click();
    cy.get('[data-testid="erro-selecao-plano"]').should('be.visible');
    
    // Selecionar plano
    cy.get('[data-testid="plano-pagamento-card"]').first().click();
    cy.get('[data-testid="confirmar-plano-btn"]').click();
    
    // Tentar avançar sem fazer upload de documentos
    cy.get('[data-testid="continuar-documentos-btn"]').should('be.disabled');
    
    // Simular uploads
    cy.get('[data-testid="upload-rg"]').attachFile('documento-rg.jpg');
    cy.wait('@uploadDocumento');
    cy.get('[data-testid="upload-cpf"]').attachFile('documento-cpf.jpg');
    cy.wait('@uploadDocumento');
    cy.get('[data-testid="upload-comprovante"]').attachFile('documento-residencia.jpg');
    cy.wait('@uploadDocumento');
    
    // Agora deve estar habilitado
    cy.get('[data-testid="continuar-documentos-btn"]').should('be.enabled');
    cy.get('[data-testid="continuar-documentos-btn"]').click();
    
    // Tentar avançar sem aceitar contrato
    cy.get('[data-testid="finalizar-matricula-btn"]').should('be.disabled');
    
    // Aceitar contrato e assinar
    cy.get('[data-testid="aceitar-contrato-checkbox"]').check();
    cy.get('[data-testid="assinatura-digital-pad"]').click().drag(200, 50, { force: true });
    
    // Agora deve estar habilitado
    cy.get('[data-testid="finalizar-matricula-btn"]').should('be.enabled');
  });
}); 