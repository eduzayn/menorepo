import { describe, it, expect } from 'vitest';
import { 
  generateTestId, 
  testUser, 
  testSession, 
  testMatricula, 
  testCurso, 
  gerarParcelas, 
  gerarDocumentos 
} from '../test-data';

describe('Dados de Teste', () => {
  describe('generateTestId', () => {
    it('deve gerar IDs únicos', () => {
      const id1 = generateTestId();
      const id2 = generateTestId();
      
      expect(id1).not.toBe(id2);
    });

    it('deve aceitar um prefixo personalizado', () => {
      const prefix = 'aluno';
      const id = generateTestId(prefix);
      
      expect(id.startsWith(`${prefix}_`)).toBe(true);
    });
  });

  describe('dados pré-definidos', () => {
    it('deve ter propriedades corretas para testUser', () => {
      expect(testUser).toHaveProperty('id');
      expect(testUser).toHaveProperty('email');
      expect(testUser).toHaveProperty('nome');
      expect(testUser).toHaveProperty('permissoes');
      expect(testUser).toHaveProperty('perfil');
    });

    it('deve ter propriedades corretas para testSession', () => {
      expect(testSession).toHaveProperty('access_token');
      expect(testSession).toHaveProperty('refresh_token');
      expect(testSession).toHaveProperty('expires_at');
      expect(testSession).toHaveProperty('token_type');
      expect(testSession).toHaveProperty('user');
      expect(testSession.user).toHaveProperty('id');
      expect(testSession.user).toHaveProperty('email');
    });

    it('deve ter propriedades corretas para testMatricula', () => {
      expect(testMatricula).toHaveProperty('id');
      expect(testMatricula).toHaveProperty('aluno_id');
      expect(testMatricula).toHaveProperty('curso_id');
      expect(testMatricula).toHaveProperty('data_inicio');
      expect(testMatricula).toHaveProperty('status');
      expect(testMatricula).toHaveProperty('plano_pagamento');
      expect(testMatricula).toHaveProperty('valor_total');
      expect(testMatricula).toHaveProperty('parcelas');
    });

    it('deve ter propriedades corretas para testCurso', () => {
      expect(testCurso).toHaveProperty('id');
      expect(testCurso).toHaveProperty('nome');
      expect(testCurso).toHaveProperty('descricao');
      expect(testCurso).toHaveProperty('duracao_meses');
      expect(testCurso).toHaveProperty('valor');
      expect(testCurso).toHaveProperty('categoria');
    });
  });

  describe('gerarParcelas', () => {
    it('deve gerar o número correto de parcelas', () => {
      const quantidade = 5;
      const parcelas = gerarParcelas(quantidade);
      
      expect(parcelas).toHaveLength(quantidade);
    });

    it('deve gerar parcelas com as propriedades corretas', () => {
      const parcelas = gerarParcelas(3);
      const primeiraParcela = parcelas[0];
      
      expect(primeiraParcela).toHaveProperty('id');
      expect(primeiraParcela).toHaveProperty('matricula_id');
      expect(primeiraParcela).toHaveProperty('numero');
      expect(primeiraParcela).toHaveProperty('valor');
      expect(primeiraParcela).toHaveProperty('data_vencimento');
      expect(primeiraParcela).toHaveProperty('status');
      expect(primeiraParcela).toHaveProperty('data_pagamento');
    });

    it('deve gerar parcelas com status personalizado', () => {
      const status = 'paga';
      const parcelas = gerarParcelas(3, status);
      
      // Todas as parcelas devem ter o status especificado
      expect(parcelas.every(parcela => parcela.status === status)).toBe(true);
      
      // Parcelas pagas devem ter data_pagamento definida
      expect(parcelas.every(parcela => parcela.data_pagamento !== null)).toBe(true);
    });
  });

  describe('gerarDocumentos', () => {
    it('deve gerar o número correto de documentos', () => {
      const quantidade = 4;
      const documentos = gerarDocumentos(quantidade);
      
      expect(documentos).toHaveLength(quantidade);
    });

    it('deve gerar documentos com as propriedades corretas', () => {
      const documentos = gerarDocumentos(2);
      const primeiroDocumento = documentos[0];
      
      expect(primeiroDocumento).toHaveProperty('id');
      expect(primeiroDocumento).toHaveProperty('matricula_id');
      expect(primeiroDocumento).toHaveProperty('tipo');
      expect(primeiroDocumento).toHaveProperty('nome_arquivo');
      expect(primeiroDocumento).toHaveProperty('url');
      expect(primeiroDocumento).toHaveProperty('status');
      expect(primeiroDocumento).toHaveProperty('data_upload');
    });

    it('deve gerar documentos com status personalizado', () => {
      const status = 'aprovado';
      const documentos = gerarDocumentos(3, status);
      
      // Todos os documentos devem ter o status especificado
      expect(documentos.every(doc => doc.status === status)).toBe(true);
    });
  });
}); 