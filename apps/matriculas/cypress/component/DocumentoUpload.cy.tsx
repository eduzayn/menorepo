/// <reference types="cypress" />
import React from 'react';
import { DocumentoUpload } from '../../src/components/documentos/DocumentoUpload';
import { BrowserRouter } from 'react-router-dom';

describe('DocumentoUpload Component', () => {
  beforeEach(() => {
    // Mock da função URL.createObjectURL
    cy.window().then((win) => {
      win.URL.createObjectURL = () => 'https://exemplo.com/mock-url';
    });
    
    // Stub da função de navegação
    cy.stub(window, 'alert').as('alertStub');
    
    // Mock do serviço de documento
    cy.stub(window, 'fetch').as('fetchStub');
    
    // Montar o componente dentro de um BrowserRouter para os hooks do react-router
    cy.mount(
      <BrowserRouter>
        <DocumentoUpload />
      </BrowserRouter>
    );
  });

  it('deve renderizar o formulário de upload corretamente', () => {
    // Verificar o título
    cy.contains('h1', 'Upload de Documento').should('be.visible');
    
    // Verificar campos do formulário
    cy.get('select#tipoDocumento').should('be.visible');
    cy.get('input[type="file"]').should('be.visible');
    cy.get('input#nomePersonalizado').should('be.visible');
    
    // Verificar botões
    cy.contains('button', 'Cancelar').should('be.visible');
    cy.contains('button', 'Enviar Documento').should('be.visible');
  });

  it('deve exibir o campo para especificar tipo quando "outros" for selecionado', () => {
    // Inicialmente o campo não deve estar visível
    cy.get('input#outroTipo').should('not.exist');
    
    // Selecionar a opção "Outros"
    cy.get('select#tipoDocumento').select('outros');
    
    // Verificar se o campo aparece
    cy.get('input#outroTipo').should('be.visible');
    cy.contains('label', 'Especifique o Tipo*').should('be.visible');
    
    // Preencher o campo especial
    cy.get('input#outroTipo').type('Carteira de Vacinação');
    
    // Mudar para outro tipo e verificar se o campo desaparece
    cy.get('select#tipoDocumento').select('rg');
    cy.get('input#outroTipo').should('not.exist');
  });

  it('deve permitir fazer upload de arquivo e preencher nome automático', () => {
    // Selecionar um tipo de documento
    cy.get('select#tipoDocumento').select('cpf');
    
    // Preparar um arquivo para upload
    cy.fixture('sample.pdf', 'base64').then(fileContent => {
      // Converter Base64 para Blob
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
      const file = new File([blob], 'sample.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Fazer o upload do arquivo
      cy.get('input[type="file"]').then(input => {
        const inputEl = input[0];
        inputEl.files = dataTransfer.files;
        cy.wrap(inputEl).trigger('change', { force: true });
      });
      
      // Verificar se o nome do arquivo foi preenchido automaticamente
      cy.get('input#nomePersonalizado').should('have.value', 'sample.pdf');
    });
  });

  it('deve validar campos obrigatórios', () => {
    // Tentar enviar o formulário sem preencher os campos
    cy.contains('button', 'Enviar Documento').click();
    
    // Verificar mensagem de erro
    cy.contains('Selecione um arquivo para upload.').should('be.visible');
    
    // Preencher o tipo, mas não o arquivo
    cy.get('select#tipoDocumento').select('rg');
    cy.contains('button', 'Enviar Documento').click();
    
    // Verificar que ainda mostra erro de arquivo
    cy.contains('Selecione um arquivo para upload.').should('be.visible');
  });

  it('deve verificar o formato do arquivo', () => {
    // Selecionar um tipo de documento
    cy.get('select#tipoDocumento').select('rg');
    
    // Preparar um arquivo de formato inválido
    cy.fixture('sample.exe', { allowEmpty: true }).then(fileContent => {
      const blob = new Blob(['sample exe content'], { type: 'application/x-msdownload' });
      const file = new File([blob], 'sample.exe', { type: 'application/x-msdownload' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Fazer o upload do arquivo inválido
      cy.get('input[type="file"]').then(input => {
        const inputEl = input[0];
        inputEl.files = dataTransfer.files;
        cy.wrap(inputEl).trigger('change', { force: true });
      });
      
      // Verificar mensagem de erro de formato
      cy.contains('Formato de arquivo não suportado').should('be.visible');
    });
  });

  it('deve verificar tamanho máximo do arquivo', () => {
    // Selecionar um tipo de documento
    cy.get('select#tipoDocumento').select('rg');
    
    // Simular um arquivo grande (maior que 10MB)
    const largeBlob = new ArrayBuffer(11 * 1024 * 1024); // 11MB
    const file = new File([largeBlob], 'arquivo-grande.pdf', { type: 'application/pdf' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    // Fazer o upload do arquivo grande
    cy.get('input[type="file"]').then(input => {
      const inputEl = input[0];
      inputEl.files = dataTransfer.files;
      cy.wrap(inputEl).trigger('change', { force: true });
    });
    
    // Verificar mensagem de erro de tamanho
    cy.contains('O arquivo excede o tamanho máximo de 10MB.').should('be.visible');
  });

  it('deve permitir personalizar o nome do arquivo', () => {
    // Selecionar um tipo de documento
    cy.get('select#tipoDocumento').select('cpf');
    
    // Preparar um arquivo para upload
    cy.fixture('sample.pdf', 'base64').then(fileContent => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
      const file = new File([blob], 'sample.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Fazer o upload do arquivo
      cy.get('input[type="file"]').then(input => {
        const inputEl = input[0];
        inputEl.files = dataTransfer.files;
        cy.wrap(inputEl).trigger('change', { force: true });
      });
      
      // Editar o nome personalizado
      cy.get('input#nomePersonalizado').clear().type('CPF_Aluno123');
      
      // Verificar o valor do campo
      cy.get('input#nomePersonalizado').should('have.value', 'CPF_Aluno123');
    });
  });
}); 