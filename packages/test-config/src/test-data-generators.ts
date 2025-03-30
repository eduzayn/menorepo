/**
 * Utilitários para gerar dados aleatórios para testes
 */

/**
 * Gera um ID único para um objeto de teste
 * @returns String aleatória para uso como ID em testes
 */
export function generateTestId(): string {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Gera um nome aleatório de pessoa para testes
 * @returns Nome de pessoa para uso em testes
 */
export function generateTestName(): string {
  const firstNames = [
    'Ana', 'João', 'Maria', 'Pedro', 'Luiza', 'Carlos',
    'Juliana', 'Paulo', 'Mariana', 'Lucas', 'Fernanda', 'Gabriel'
  ];
  
  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira',
    'Lima', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento', 'Carvalho'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

/**
 * Gera um CPF formatado aleatório para testes
 * Obs.: Este CPF é sintaticamente válido, mas não necessariamente válido
 * segundo o algoritmo de verificação do CPF real
 * 
 * @returns CPF formatado para uso em testes
 */
export function generateTestCPF(): string {
  const digits = Array.from({ length: 9 }, () => 
    Math.floor(Math.random() * 10)
  );
  
  return `${digits.slice(0, 3).join('')}.${digits.slice(3, 6).join('')}.${digits.slice(6, 9).join('')}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
}

/**
 * Gera um email aleatório para testes
 * @param name Nome opcional para usar na parte local do email
 * @returns Email formatado para uso em testes
 */
export function generateTestEmail(name?: string): string {
  const domains = ['edunexia.com', 'teste.com', 'example.org', 'test.net'];
  const localPart = name ? 
    name.toLowerCase().replace(/\s+/g, '.') : 
    `teste.${Math.random().toString(36).substring(2, 8)}`;
  
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${localPart}@${domain}`;
}

/**
 * Gera uma data aleatória entre dois limites
 * @param start Data de início (padrão: 1 ano atrás)
 * @param end Data de fim (padrão: hoje)
 * @returns Um objeto Date aleatório entre as datas especificadas
 */
export function generateTestDate(
  start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  end = new Date()
): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Gera um valor monetário aleatório entre um mínimo e máximo
 * @param min Valor mínimo (padrão: 100)
 * @param max Valor máximo (padrão: 1000)
 * @param decimals Número de casas decimais (padrão: 2)
 * @returns Número aleatório representando um valor monetário
 */
export function generateTestMoneyValue(
  min = 100, 
  max = 1000, 
  decimals = 2
): number {
  const value = min + Math.random() * (max - min);
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Gera um objeto de aluno para testes
 * @returns Objeto com dados de um aluno para testes
 */
export function generateTestStudent() {
  const nome = generateTestName();
  
  return {
    id: generateTestId(),
    nome,
    cpf: generateTestCPF(),
    email: generateTestEmail(nome),
    dataNascimento: generateTestDate(new Date('1990-01-01'), new Date('2005-12-31')),
    telefone: `(${Math.floor(Math.random() * 90) + 10}) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
    endereco: {
      rua: `Rua ${Math.floor(Math.random() * 1000)}`,
      numero: `${Math.floor(Math.random() * 1000)}`,
      bairro: `Bairro ${Math.floor(Math.random() * 100)}`,
      cidade: 'São Paulo',
      estado: 'SP',
      cep: `${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`
    }
  };
}

/**
 * Gera um objeto de curso para testes
 * @returns Objeto com dados de um curso para testes
 */
export function generateTestCourse() {
  const cursos = [
    'Desenvolvimento Web',
    'Desenvolvimento Mobile',
    'Ciência de Dados',
    'Inteligência Artificial',
    'Design UX/UI',
    'Marketing Digital',
    'Gestão de Projetos'
  ];
  
  const curso = cursos[Math.floor(Math.random() * cursos.length)];
  
  return {
    id: generateTestId(),
    nome: curso,
    descricao: `Curso completo de ${curso} com certificação`,
    cargaHoraria: Math.floor(Math.random() * 500) + 40,
    valor: generateTestMoneyValue(500, 5000),
    duracao: Math.floor(Math.random() * 12) + 1
  };
}

/**
 * Gera um objeto de matrícula para testes
 * @returns Objeto com dados de uma matrícula para testes
 */
export function generateTestEnrollment() {
  const aluno = generateTestStudent();
  const curso = generateTestCourse();
  
  return {
    id: generateTestId(),
    aluno,
    curso,
    dataMatricula: new Date(),
    valorTotal: curso.valor,
    status: 'ativa',
    formaPagamento: 'boleto',
    parcelas: Math.floor(Math.random() * 12) + 1
  };
} 