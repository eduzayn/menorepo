/**
 * Utilitários para geração de dados de teste
 */

/**
 * Gera um ID único para uso em testes
 */
export function generateTestId(prefix = 'test') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Dados de usuário para testes
 */
export const testUser = {
  id: 'user-test-123',
  email: 'teste@edunexia.com.br',
  nome: 'Usuário de Teste',
  permissoes: ['ler', 'escrever'],
  perfil: 'aluno'
};

/**
 * Dados de sessão para testes
 */
export const testSession = {
  access_token: 'access-token-test',
  refresh_token: 'refresh-token-test',
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: {
    id: 'user-test-123',
    email: 'teste@edunexia.com.br'
  }
};

/**
 * Dados de matrícula para testes
 */
export const testMatricula = {
  id: 'matricula-test-123',
  aluno_id: 'user-test-123',
  curso_id: 'curso-test-123',
  data_inicio: new Date().toISOString(),
  status: 'ativa',
  plano_pagamento: 'mensal',
  valor_total: 1199.90,
  parcelas: 12
};

/**
 * Dados de curso para testes
 */
export const testCurso = {
  id: 'curso-test-123',
  nome: 'Curso de Desenvolvimento Web',
  descricao: 'Aprenda a desenvolver aplicações web modernas',
  duracao_meses: 12,
  valor: 1199.90,
  categoria: 'tecnologia'
};

/**
 * Gera uma lista de parcelas para testes
 */
export function gerarParcelas(quantidade = 3, status = 'pendente') {
  return Array.from({ length: quantidade }, (_, i) => ({
    id: `parcela-test-${i + 1}`,
    matricula_id: 'matricula-test-123',
    numero: i + 1,
    valor: 199.90,
    data_vencimento: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    status,
    data_pagamento: status === 'paga' ? new Date().toISOString() : null
  }));
}

/**
 * Gera uma lista de documentos para testes
 */
export function gerarDocumentos(quantidade = 3, status = 'pendente') {
  const tipos = ['RG', 'CPF', 'Comprovante de Residência', 'Diploma', 'Certidão de Nascimento'];
  
  return Array.from({ length: quantidade }, (_, i) => ({
    id: `documento-test-${i + 1}`,
    matricula_id: 'matricula-test-123',
    tipo: tipos[i % tipos.length],
    nome_arquivo: `documento-${i + 1}.pdf`,
    url: `https://example.com/documentos/documento-${i + 1}.pdf`,
    status,
    data_upload: new Date().toISOString()
  }));
} 